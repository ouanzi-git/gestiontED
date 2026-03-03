from .extractor import extract_text
from .classifier import classifier
from .metadata import extract_metadata
import time

def process_document(file_path: str):
    """Orchestrates the document processing pipeline."""
    start_time = time.time()
    
    # 1. Text Extraction
    text, ocr_used = extract_text(file_path)
    
    # 2. Classification
    doc_type, confidence = classifier.classify(text)
    
    # 3. Metadata Extraction
    metadata = extract_metadata(text, category=doc_type)
    
    processing_time = round(time.time() - start_time, 2)
    
    return {
        "detected_type": doc_type,
        "confidence": round(confidence, 2),
        "extracted_text_preview": text[:500] if text else "",
        "metadata": metadata,
        "ocr_used": ocr_used,
        "processing_time_seconds": processing_time
    }
