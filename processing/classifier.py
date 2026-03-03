from __future__ import annotations
import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from backend/.env
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend', '.env')
load_dotenv(dotenv_path=env_path)

class DocumentClassifier:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment")
        self.client = Groq(api_key=api_key)
        self.labels = ["Contrats", "Devis", "Bon de livraison", "Fiches Synoptiques"]

    def classify(self, text: str) -> tuple[str, float]:
        if not text:
            return "Other", 0.0
        
        sample_text = text[:4000]
        
        prompt = f"""
        You are a specialized AI document classifier for French business documents.
        Analyze the following text from a document and classify it into EXACTLY ONE of these categories:
        - Contrats
        - Devis
        - Bon de livraison
        - Fiches Synoptiques

        Respond ONLY with the category name.

        Text:
        {sample_text}
        """

        try:
            completion = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a professional French document classifier."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=20
            )
            
            result = completion.choices[0].message.content.strip()
            
            # Match result to our labels
            for label in self.labels:
                if label.lower() in result.lower():
                    return label, 0.98
            
            return "Other", 0.5
        except Exception as e:
            print(f"Groq Classification Error: {e}")
            return "Other", 0.0

# Singleton instance
classifier = DocumentClassifier()
