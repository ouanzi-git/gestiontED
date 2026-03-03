import os
import json
from groq import Groq
from dotenv import load_dotenv
from typing import Dict, Any

# Load environment variables from backend/.env
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend', '.env')
load_dotenv(dotenv_path=env_path)

def extract_metadata(text: str, category: str = "Autre") -> Dict[str, Any]:
    """Extract category-specific metadata from text using Groq LLM."""
    
    # Define mapping of categories to their expected metadata fields
    fields_mapping = {
        "Contrats": ["Type", "parties", "montant", "durée", "clauses clés"],
        "Devis": ["Client", "date validité", "total HT/TTC", "articles"],
        "Bon de livraison": ["N° Bon livraison", "chantier", "matériaux", "quantités", "date"],
        "Fiches Synoptiques": ["Projet", "phase", "version", "responsable", "plan"]
    }

    fields = fields_mapping.get(category, ["title", "reference", "date", "supplier", "client", "amount"])
    
    if not text:
        return {field: "N/A" for field in fields}

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {field: "ERR_NO_KEY" for field in fields}
    
    client = Groq(api_key=api_key)
    
    fields_str = "\n    - ".join(fields)
    
    prompt = f"""
    You are a specialized AI metadata extractor for French business documents.
    Analyze the following text from a document of category "{category}".
    Extract ONLY the following metadata fields:
    - {fields_str}

    Rules:
    - Respond strictly with a JSON object.
    - If a field is missing, use "N/A".
    - Keep original French values and formatting.
    - Use EXACTLY the keys provided above.

    Text:
    {text[:6000]}
    """

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert document extraction engine. Always output valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        extracted = json.loads(completion.choices[0].message.content)
        
        # Ensure all requested fields are in the output
        result = {}
        for field in fields:
            result[field] = extracted.get(field, "N/A")
            
        return result
    except Exception as e:
        print(f"Groq Metadata Extraction Error: {e}")
        return {field: "N/A" for field in fields}
