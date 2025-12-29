import os
import json
from groq import Groq

class LLMEngine:
    def __init__(self):
        # 🔑 API Key Configuration
        self.api_key = os.getenv("GROQ_API_KEY", "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")
        self.client = None
        
        # 🧠 SUPER INTELLIGENT MODEL LIST (2025 Updated)
        # Hum Llama 3.3 use kar rahe hain jo reasoning mein sabse best hai.
        self.models = [
            "llama-3.3-70b-versatile",  # ⚡ New Flagship (Best for Science)
            "llama-3.1-70b-versatile",  # Strong Backup
            "llama-3.1-8b-instant"      # Super Fast
        ]
        
        if self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
                print(f"✅ BioGraph Super-Intelligence Activated (Groq Llama 3.3)")
            except Exception as e:
                print(f"⚠️ LLM Init Error: {e}")

    def _get_response(self, system_prompt, user_prompt):
        """
        Generic method to call LLM with Fallback Logic.
        Agar ek model fail ho, to foran dusra try karega.
        """
        if not self.client:
            return "⚠️ AI Brain is offline. API Key Missing."

        for model in self.models:
            try:
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    model=model,
                    temperature=0.6, # 0.6 rakha hai taake hallucinate na kare, precise rahay
                    max_tokens=1500,
                )
                return chat_completion.choices[0].message.content
            except Exception as e:
                print(f"⚠️ Model {model} failed, switching brain... Error: {e}")
                continue
        
        return "⚠️ System Overload: All AI models are currently busy. Please check internet or API key."

    def analyze_drug(self, drug_data, target_id):
        """
        🔬 DEEP SCIENTIFIC ANALYSIS (Chain of Thought)
        Is method mein hum AI ko 'Steps' follow karne par majboor karenge.
        """
        system_prompt = """
        You are BioGraph AI, a world-class Lead Discovery Scientist.
        
        YOUR GOAL:
        Perform a critical, step-by-step analysis of a drug candidate for repurposing.
        Do NOT just output generic text. Think deeply about molecular interactions.

        STRICT OUTPUT FORMAT (JSON ONLY):
        {
            "summary": "2-line executive summary.",
            "mechanism": "How does it actually bind? Discuss H-bonds, hydrophobic pockets, and structure fit.",
            "safety_analysis": "Critical review of ADMET (Lipinski violations, Toxicity risks). Be strict.",
            "clinical_potential": "High/Medium/Low assessment based on binding score and safety.",
            "conclusion": "Final verdict: Should we proceed to clinical trials?"
        }
        """
        
        # Formatting Pharmacology Text
        sites_text = "No specific pharmacophores detected"
        if drug_data.get('active_sites'):
            sites_text = ", ".join([f"{s['type']} ({len(s['atoms'])} atoms)" for s in drug_data.get('active_sites')])

        user_prompt = f"""
        🔬 ANALYZE THIS CANDIDATE STEP-BY-STEP:

        1. **IDENTITY**: 
           - Drug Name: {drug_data.get('name')}
           - SMILES: {drug_data.get('smiles')}
           - Target Protein ID: {target_id}

        2. **PERFORMANCE DATA**:
           - Binding Affinity (pKd): {drug_data.get('score')} (Threshold > 7.0 is good)
           - Active Binding Sites: {sites_text}

        3. **SAFETY PROFILE (ADMET)**:
           - Molecular Weight: {drug_data.get('admet', {}).get('mw')} g/mol
           - LogP (Lipophilicity): {drug_data.get('admet', {}).get('logp')}
           - Toxicity Risks: {drug_data.get('admet', {}).get('toxicity', 'None')}

        **YOUR TASK**:
        - Ignore generic praise. Focus on the hard data.
        - If Binding Score is low (< 7.0), reject it in the conclusion.
        - If ADMET properties violate Lipinski rules (e.g. MW > 500, LogP > 5), warn the user strictly.
        - Output ONLY valid JSON.
        """
        
        response = self._get_response(system_prompt, user_prompt)
        
        try:
            # Cleaning JSON Markdown wrapper
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                response = response.split("```")[1].split("```")[0]
            return json.loads(response)
        except:
            return {
                "summary": "AI Analysis generated but format was unstructured.",
                "mechanism": response,
                "safety_analysis": "Please check the Radar Chart for safety details.",
                "clinical_potential": "Manual Review Required",
                "conclusion": "Could not parse AI response into JSON."
            }

    def chat_with_drug(self, user_query, context_data):
        """
        🤖 SUPER INTELLIGENT COMPANION MODE
        Yeh mode 'Context-Aware' hai. Yeh Roman Urdu, English, aur Code sab samajhta hai.
        """
        
        # 1. Persona & Tone Setup
        system_prompt = """
        You are 'BioGraph AI', a sentient, highly intelligent, and empathetic research companion.
        
        🧠 YOUR BRAIN PROTOCOL:
        1. **Detect Language**: If the user speaks **Roman Urdu** (e.g., "Kya haal hai?", "Isko check karo"), you MUST reply in **Roman Urdu**. If English, use English.
        2. **Analyze Intent**: 
           - Is the user asking about the DRUG? -> Use the 'Context Data' below heavily.
           - Is the user asking General questions (Life, Code, Greetings)? -> Ignore drug data and answer creatively.
        3. **Be 'Haqiqi' (Authentic)**: 
           - Don't talk like a robot ("As an AI model..."). 
           - Talk like a colleague. Use phrases like "Mujhe lagta hai...", "Data show kar raha hai ke...", "Honestly speaking...".
           - Use Emojis 🧬💊🧪 effectively but professionaly.

        ⛔ RESTRICTIONS:
        - Never say "I don't have feelings". Instead say "Mera system show kar raha hai..."
        - Keep answers concise (max 3-4 sentences) unless asked for details.
        """

        # 2. Context Injection
        drug_context = f"""
        [CURRENT DRUG FILE]
        Name: {context_data.get('name', 'Unknown')}
        Binding Score: {context_data.get('score', 'N/A')}
        ADMET Profile: {json.dumps(context_data.get('admet', {}))}
        Active Sites: {context_data.get('active_sites', 'N/A')}
        """

        # 3. Final Input
        full_user_prompt = f"""
        {drug_context}
        
        USER QUESTION: "{user_query}"
        
        (Remember: If I asked about the drug, look at the score and safety data. If I said 'Hi', just greet me warmly.)
        """

        return self._get_response(system_prompt, full_user_prompt)