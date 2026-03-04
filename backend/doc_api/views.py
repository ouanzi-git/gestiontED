import os
import uuid
import chromadb
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse, HttpRequest
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

# Import models
from .models import Document

# Import processing logic
# Since 'processing' is at the root of 'tgcc_rag' and 'backend' is also at the root,
# we need to ensure the parent directory is in sys.path or use relative paths.
# For simplicity in this environment, we assume 'processing' is discoverable.
from processing.processor import process_document

# Assuming an embedding function is needed for ChromaDB
# For now, we will use ChromaDB's default embedding function or a placeholder
# from processing.embeddings import generate_embedding

# Initialize ChromaDB client
CHROMA_PATH = os.path.join(settings.BASE_DIR, "chroma_db")
os.makedirs(CHROMA_PATH, exist_ok=True)
chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = chroma_client.get_or_create_collection(name="documents")

@csrf_exempt
@require_POST
def upload_document(request: HttpRequest) -> JsonResponse:
    uploaded_file = request.FILES.get('file')
    
    if not uploaded_file:
        return JsonResponse({
            "status": "error", 
            "message": "No file uploaded. Please provide a 'file' payload."
        }, status=400)
        
    try:
        # 1. Save file to disk temporarily
        fs = FileSystemStorage(location=settings.MEDIA_ROOT)
        filename = fs.save(uploaded_file.name, uploaded_file)
        file_path = fs.path(filename)
        
        # 2. Process document through the AI pipeline
        try:
            result = process_document(file_path)
        except Exception as processing_error:
            if os.path.exists(file_path):
                os.remove(file_path)
            return JsonResponse({
                "status": "error", 
                "message": f"Document processing failed: {str(processing_error)}"
            }, status=500)
            
        # 3. Store structured data in PostgreSQL (via Django ORM)
        document = Document.objects.create(
            id=uuid.uuid4(),
            category=result.get("detected_type", "Unknown"),
            structured_metadata=result.get("metadata", {}),
            rag_summary=result.get("extracted_text_preview", ""), # Using preview for summary as per processor output
            confidence=result.get("confidence", 0.0)
        )
        
        # 4. Add to ChromaDB
        # Using the text preview for documents in ChromaDB
        collection.add(
            ids=[str(document.id)],
            documents=[document.rag_summary],
            metadatas=[{
                "document_id": str(document.id),
                "category": document.category,
                "confidence": document.confidence,
                "ocr_used": str(result.get("ocr_used", False))
            }]
        )
        
        return JsonResponse({
            "filename": uploaded_file.name,
            "processing_results": {
                "detected_type": document.category,
                "confidence": document.confidence,
                "extracted_text_preview": document.rag_summary,
                "metadata": document.structured_metadata,
                "ocr_used": result.get("ocr_used", False),
                "processing_time_seconds": result.get("processing_time_seconds", 0.0)
            }
        }, status=201)
        
    except Exception as e:
        return JsonResponse({
            "status": "error", 
            "message": f"An unexpected server error occurred: {str(e)}"
        }, status=500)
