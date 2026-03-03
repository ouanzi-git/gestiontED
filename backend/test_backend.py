import sys
import os
import json

# Add parent to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from processing.processor import process_document

def test_extraction():
    # Find the most recent PDF file in uploads
    upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    files = [f for f in os.listdir(upload_dir) if f.lower().endswith(".pdf")]
    if not files:
        print("No PDF files found in uploads.")
        return

    latest_file = os.path.join(upload_dir, files[-1])
    print(f"Testing with: {latest_file}")
    
    try:
        results = process_document(latest_file)
        print("\n--- Processing Results ---")
        print(json.dumps(results, indent=2))
        
        # Verify keys
        expected_categories = ["Contrats", "Devis", "Bon de livraison", "Fiches Synoptiques"]
        category = results.get("detected_type")
        
        if category in expected_categories:
            print(f"SUCCESS: Document classified as {category}")
        else:
            print(f"WARNING: Unexpected category: {category}")
            
        if results.get("confidence") > 0.8:
            print(f"SUCCESS: High confidence detection: {results['confidence']}")
        else:
            print("WARNING: Confidence is still 0. Extraction might have failed.")
            
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    test_extraction()
