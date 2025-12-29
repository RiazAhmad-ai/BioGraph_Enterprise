import time
import asyncio
import torch
import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
from torch_geometric.loader import DataLoader
from torch_geometric.data import Batch
from rdkit import Chem

# Modules
from modules.ai_model import load_ai_model, DEVICE
from modules.chemistry import get_protein_sequence, process_data_object, get_smiles_from_input, get_pharmacophore_data
from modules.database import get_all_drugs
from modules.admet import calculate_admet_properties
from modules.utils import calculate_confidence
from modules.state import SCAN_PROGRESS 
from modules.llm_engine import generate_scientific_explanation, chat_with_drug_data

router = APIRouter()
model = load_ai_model("drug_model_v4.pt")

class DrugAnalysisRequest(BaseModel):
    target_id: str
    smiles: Optional[str] = None
    mode: str

# --- 1. ANALYZE ENDPOINT (Manual & Auto) ---
@router.post("/analyze")
async def analyze_drug(request: DrugAnalysisRequest):
    # Reset Progress
    SCAN_PROGRESS["current"] = 0
    SCAN_PROGRESS["total"] = 1
    SCAN_PROGRESS["status"] = "Validating..."
    
    start_time = time.time()
    protein_seq = get_protein_sequence(request.target_id)
    
    if not protein_seq:
        return {"error": f"Invalid Target ID '{request.target_id}'"}

    # --- MANUAL MODE ---
    if request.mode == 'manual':
        SCAN_PROGRESS["status"] = "Processing..."
        if not request.smiles: return {"error": "Input is missing!"}
        
        real_smiles, mol = get_smiles_from_input(request.smiles)
        if not real_smiles or not mol:
            return {"error": f"Could not find structure for '{request.smiles}'."}

        # ✅ LOGIC: Name vs SMILES Auto-Detection
        # Agar input aur real_smiles same hain, iska matlab user ne SMILES dala hai.
        # Toh hum Name ko "Custom Ligand" ya "Molecule-X" set karenge.
        # Agar different hain, toh user ne Name (e.g. Panadol) dala tha.
        
        display_name = request.smiles
        if request.smiles == real_smiles:
             # User entered SMILES -> Auto Generate Name
             display_name = f"Custom Ligand {str(int(time.time()))[-4:]}"
        else:
             # User entered Name -> SMILES is already in real_smiles
             display_name = request.smiles

        score = 0.0
        status = "UNKNOWN"
        data = process_data_object(real_smiles, protein_seq)
        
        if model and data:
            try:
                batch = Batch.from_data_list([data])
                with torch.no_grad():
                    raw = model(batch.to(DEVICE)).item()
                    score = round(max(4.0, min(12.0, raw)), 2)
                    status = "ACTIVE" if score > 7.5 else "INACTIVE"
            except: status = "MODEL ERROR"
        
        # 1. Calculate ADMET
        admet_data = calculate_admet_properties(mol)
        confidence_val = calculate_confidence(score, threshold=7.5)

        # 2. Calculate Pharmacophores
        pharmacophore_data = get_pharmacophore_data(mol)

        # 3. Generate AI Explanation
        ai_explanation = generate_scientific_explanation(
            drug_name=display_name,
            smiles=real_smiles,
            score=score,
            admet=admet_data,
            active_sites=pharmacophore_data
        )

        SCAN_PROGRESS["current"] = 1
        SCAN_PROGRESS["status"] = "Done"

        return {
            "name": display_name,   # ✅ Corrected Name
            "smiles": real_smiles,  # ✅ Corrected SMILES
            "score": score,
            "status": status,
            "confidence": confidence_val,
            "color": "#00f3ff" if status == "ACTIVE" else "#ff0055",
            "admet": admet_data,
            "active_sites": pharmacophore_data,
            "ai_explanation": ai_explanation
        }

    # --- AUTO MODE ---
    elif request.mode == 'auto':
        SCAN_PROGRESS["status"] = "Fetching DB..."
        all_drugs = get_all_drugs()
        SCAN_PROGRESS["total"] = len(all_drugs)
        
        data_list = []
        valid_indices = []
        
        SCAN_PROGRESS["status"] = "Analyzing..."
        for i, drug in enumerate(all_drugs):
            d_obj = process_data_object(drug['smiles'], protein_seq)
            if d_obj:
                data_list.append(d_obj)
                valid_indices.append(i)
            
            if i % 50 == 0:
                SCAN_PROGRESS["current"] = i
                await asyncio.sleep(0.001) 

        results = []
        all_scores = []
        
        SCAN_PROGRESS["status"] = "Inference..."
        if model and data_list:
            loader = DataLoader(data_list, batch_size=64, shuffle=False)
            with torch.no_grad():
                for batch in loader:
                    try:
                        all_scores.extend(model(batch.to(DEVICE)).view(-1).tolist())
                    except: all_scores.extend([0.0]*batch.num_graphs)
                    await asyncio.sleep(0.001)
        
        SCAN_PROGRESS["current"] = len(all_drugs)
        SCAN_PROGRESS["status"] = "Finalizing..."

        for idx, score_val in zip(valid_indices, all_scores):
            final_score = round(max(4.0, min(12.0, score_val)), 2)
            results.append({
                "name": all_drugs[idx]["name"],
                "smiles": all_drugs[idx]["smiles"],
                "score": final_score,
                "confidence": calculate_confidence(final_score),
                "status": "ACTIVE" if final_score > 7.5 else "INACTIVE",
                "color": "#00f3ff" if final_score > 7.5 else "#ff0055"
            })
            
        results.sort(key=lambda x: x["score"], reverse=True)
        SCAN_PROGRESS["status"] = "Done"
        return {"results": results, "scan_time": round(time.time() - start_time, 2)}


# --- 2. UPLOAD ENDPOINT ---
@router.post("/upload")
async def upload_file(target_id: str = Form(...), file: UploadFile = File(...)):
    # Reset Progress
    SCAN_PROGRESS["current"] = 0
    SCAN_PROGRESS["total"] = 1
    SCAN_PROGRESS["status"] = "Reading File..."
    
    protein_seq = get_protein_sequence(target_id)
    if not protein_seq: return {"error": "Invalid Target ID"}

    start_time = time.time()
    results = []

    try:
        contents = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith('.txt'):
            df = pd.read_csv(io.BytesIO(contents), sep='\t')
        else:
            return {"error": "Invalid format. Only .csv or .txt allowed."}

        # Normalize Columns
        df.columns = [c.lower().strip() for c in df.columns]
        if 'smiles' not in df.columns: return {"error": "Column 'smiles' not found!"}
        if 'name' not in df.columns: df['name'] = [f"Drug_{i}" for i in range(len(df))]

        drugs_data = df.to_dict(orient='records')
        SCAN_PROGRESS["total"] = len(drugs_data)
        SCAN_PROGRESS["status"] = "Analyzing Batch..."
        
        data_list = []
        valid_indices = []

        for i, row in enumerate(drugs_data):
            d_obj = process_data_object(row['smiles'], protein_seq)
            if d_obj:
                data_list.append(d_obj)
                valid_indices.append(i)
            if i % 10 == 0:
                SCAN_PROGRESS["current"] = i
                await asyncio.sleep(0.001)

        if not data_list: return {"error": "No valid molecules found."}

        all_scores = []
        if model and data_list:
            loader = DataLoader(data_list, batch_size=64, shuffle=False)
            with torch.no_grad():
                for batch in loader:
                    try:
                        all_scores.extend(model(batch.to(DEVICE)).view(-1).tolist())
                    except: all_scores.extend([0.0]*batch.num_graphs)
                    await asyncio.sleep(0.001)
        else: all_scores = [0.0] * len(data_list)

        SCAN_PROGRESS["current"] = len(drugs_data)
        SCAN_PROGRESS["status"] = "Done"

        for idx, score_val in zip(valid_indices, all_scores):
            final_score = round(max(4.0, min(12.0, score_val)), 2)
            row = drugs_data[idx]
            
            admet_data = {}
            active_sites = [] 

            if final_score > 7.5:
                mol = Chem.MolFromSmiles(row['smiles'])
                admet_data = calculate_admet_properties(mol)
                active_sites = get_pharmacophore_data(mol)

            results.append({
                "name": str(row['name']),
                "smiles": str(row['smiles']),
                "score": final_score,
                "confidence": calculate_confidence(final_score),
                "status": "ACTIVE" if final_score > 7.5 else "INACTIVE",
                "color": "#00f3ff" if final_score > 7.5 else "#ff0055",
                "admet": admet_data,
                "active_sites": active_sites 
            })

        results.sort(key=lambda x: x["score"], reverse=True)
        return {"results": results, "scan_time": round(time.time() - start_time, 2)}

    except Exception as e:
        print(f"❌ Upload Error: {e}")
        return {"error": f"Failed to process file: {str(e)}"}


class ChatRequest(BaseModel):
    question: str
    drug_context: dict

@router.post("/chat_drug")
async def chat_drug(request: ChatRequest):
    answer = chat_with_drug_data(request.question, request.drug_context)
    return {"answer": answer}