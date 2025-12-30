import os
import json
from google import genai
from google.genai import types

class LLMEngine:
    def __init__(self):
        # 🔑 API Key Environment se load hogi
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        
        # 🚀 PRIMARY MODEL: Sabse latest aur tez wala
        self.active_model_id = "gemini-2.5-flash" 
        
        if self.api_key:
            try:
                # ✅ NEW SDK INITIALIZATION
                self.client = genai.Client(api_key=self.api_key)
                print(f"✅ BioGraph Intelligence Activated (Google Gen AI SDK)")
            except Exception as e:
                print(f"⚠️ GenAI Init Error: {e}")
        else:
            print("⚠️ WARNING: GEMINI_API_KEY not found.")

    def _get_response(self, prompt):
        """
        Ye function automatically best working model dhoond lega.
        """
        if not self.client:
            return "⚠️ AI Brain is offline. API Key Missing."

        # 📋 List of Models to Try (Priority Order based on your list)
        candidate_models = [
            self.active_model_id,       # gemini-2.5-flash (Best)
            "gemini-2.5-flash",
            "gemini-2.5-pro",           # More Intelligent Backup
            "gemini-2.0-flash",         # Stable Backup
            "gemini-2.0-flash-exp",     # Experimental Backup
            "gemini-flash-latest"       # Generic Alias
        ]
        
        # Duplicates remove karein
        seen = set()
        unique_candidates = [x for x in candidate_models if not (x in seen or seen.add(x))]

        for model in unique_candidates:
            try:
                # 🚀 Attempt Generation
                response = self.client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.7
                    )
                )
                
                # Agar success ho gaya, to is model ko future ke liye save karlo
                if model != self.active_model_id:
                    print(f"🔄 Switched AI Model to: {model}")
                    self.active_model_id = model
                
                return response.text

            except Exception as e:
                # Agar error aye to next model try karo
                error_msg = str(e)
                if "404" in error_msg or "not found" in error_msg.lower():
                    continue
                else:
                    # Connection Errors (Ignore and retry next)
                    continue

        return "⚠️ System Overload: Could not connect to any AI model. Please check Internet or API Key."

    def analyze_drug(self, drug_data, target_id):
        """
        🔬 DEEP SCIENTIFIC ANALYSIS
        """
        prompt = f"""
        You are BioGraph AI, an expert Lead Discovery Scientist.
        Perform a critical analysis of this drug candidate.
        
        INPUT DATA:
        - Name: {drug_data.get('name')}
        - SMILES: {drug_data.get('smiles')}
        - Target Protein: {target_id}
        - Binding Score: {drug_data.get('score')}
        - ADMET Profile: {json.dumps(drug_data.get('admet', {}))}
        
        TASK:
        Return a valid JSON object with exactly these keys:
        {{
            "summary": "2-line executive summary.",
            "mechanism": "How does it actually bind? Discuss interactions.",
            "safety_analysis": "Critical review of ADMET risks.",
            "clinical_potential": "High/Medium/Low",
            "conclusion": "Final verdict"
        }}
        
        IMPORTANT: Return ONLY the JSON. No markdown formatting.
        """
        
        response_text = self._get_response(prompt)
        
        try:
            # Clean JSON (Markdown hatana)
            cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_text)
        except:
            return {
                "summary": "AI Analysis generated but format was unstructured.",
                "mechanism": response_text[:500],
                "safety_analysis": "Please check the Radar Chart for safety details.",
                "clinical_potential": "Manual Review Required",
                "conclusion": "Parsing Error"
            }

    def chat_with_drug(self, user_query, context_data):
        """
        🤖 Chat Mode
        """
        prompt = f"""
        You are 'BioGraph AI', an intelligent research companion.
        - If the user uses Roman Urdu, reply in Roman Urdu.
        - Be professional but conversational.
        
        DRUG CONTEXT:
        Name: {context_data.get('name')}
        Score: {context_data.get('score')}
        ADMET: {context_data.get('admet')}
        
        USER QUESTION: "{user_query}"
        """
        return self._get_response(prompt)

    def optimize_drug(self, drug_data, target_id):
        prompt = f"""
        You are a Medicinal Chemist. Suggest a structural modification to improve the drug.
        
        DRUG: {drug_data.get('name')} (SMILES: {drug_data.get('smiles')})
        TARGET: {target_id}
        
        Return JSON with keys: 
        {{ "original_flaw": "...", "suggestion": "...", "optimized_smiles": "...", "reasoning": "..." }}
        Return ONLY JSON.
        """
        
        response_text = self._get_response(prompt)
        try:
            cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_text)
        except:
            return {"original_flaw": "Error", "suggestion": "Manual", "optimized_smiles": "", "reasoning": "Parse Error"}

# ✅ Instance Creation
llm_bot = LLMEngine()