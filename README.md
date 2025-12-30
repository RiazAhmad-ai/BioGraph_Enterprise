🧬 BioGraph Enterprise
The Universal Drug Repurposing Engine v2.0

Advancing Medicine through Graph Intelligence
A next-generation AI platform for discovering new therapeutic uses for existing drugs.

<p align="center"> <img src="https://img.shields.io/badge/AI-Drug%20Discovery-purple"> <img src="https://img.shields.io/badge/Graph-Neural%20Networks-blue"> <img src="https://img.shields.io/badge/Status-Research--Grade-green"> <img src="https://img.shields.io/badge/License-Academic-lightgrey"> </p>
🌌 Vision

BioGraph Enterprise is an AI-powered scientific discovery platform designed to repurpose existing drugs for new disease targets — especially in cases where conventional treatments fail.

It combines:

🧠 Graph Neural Networks for molecular reasoning

🧬 Protein sequence intelligence

🧪 Cheminformatics & ADMET safety modeling

🕹️ Interactive visualization and batch inference

into a unified Discovery Engine that transforms months of research into minutes.

🧭 System Overview
User → Dashboard → BioGraph Engine → AI Core → Safety Layer → Results → PDF / Visuals

Layer	Responsibility
Frontend	Visualization, interaction, history
Backend	Orchestration, APIs, state
AI Core	Binding prediction, embeddings
Chemistry	ADMET, pharmacophores
Reporting	Scientific PDF generation
🏗️ Architecture
🖥 Backend — BioGraph Engine (FastAPI)
Component	Purpose
Routers	/analysis, /upload, /reports
State	Global scan progress tracking
DB	SQLite drug library
CORS	Frontend communication
🌐 Frontend — Glassmorphic Dashboard (React + Vite)
Feature	Description
Glass UI	Transparent scientific aesthetic
Hooks	Centralized state logic
History	Local persistent scan memory
3D Viewer	Protein structural exploration
🧠 AI & Scientific Core
🔬 DeepDrugNet_V4

Dual-path neural architecture

Drug Graph (GAT) ─┐
                  ├─ Fusion Head → Binding Score
Protein CNN ──────┘

Path	Model	Purpose
Drug	GATConv + BatchNorm	Molecular reasoning
Protein	1D CNN	Pocket detection
Fusion	Linear head	Affinity prediction
🧪 Safety & Chemistry
Module	Function
ADMET	Toxicity & pharmacokinetics
Pharmacophore	Active site mapping
Confidence	Model reliability estimation
🕹️ Operating Modes
Mode	Description
Manual	Single molecule analysis
Auto	Full drug library repurposing
Upload	Batch CSV / TXT inference
🔌 API Endpoints
Method	Endpoint	Description
POST	/analyze	Single drug analysis
POST	/upload	Batch inference
POST	/chat_drug	LLM explanation
POST	/download_report	PDF export
GET	/progress	Live scan status
📂 Project Structure
backend/
 ├── modules/
 │   ├── ai_model.py
 │   ├── admet.py
 │   ├── chemistry.py
 │   ├── llm_engine.py
 │   └── report_generator.py

frontend/
 ├── components/
 │   ├── HologramDisplay.jsx
 │   ├── ProteinViewer.jsx
 │   └── AdmetChart.jsx

🚀 Installation
Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

Frontend
npm install
npm run dev

🏁 Scientific Impact

BioGraph Enterprise enables:

Faster hypothesis testing

Safer early-stage screening

More accessible computational biology

Cost-effective drug discovery

It does not replace scientists — it amplifies them.

👤 Credits

Created by BioGraph AI
Advancing Medicine through Graph Intelligence.