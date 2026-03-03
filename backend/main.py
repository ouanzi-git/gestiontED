from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
import time
from typing import Dict, Any
import sys

# Add the parent directory to sys.path to allow importing from processing
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from processing.processor import process_document

app = FastAPI(title="Intelligent Document Management System")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.get("/")
async def root():
    return {"message": "Welcome to the Intelligent Upload API"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    start_time = time.time()
    
    # 1. Validation
    # Allow: PDF, DOCX, XLSX, PPTX, JPG, PNG, TIFF
    allowed_extensions = {".pdf", ".docx", ".xlsx", ".pptx", ".jpg", ".jpeg", ".png", ".tiff"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"File type {file_ext} not supported.")

    # 2. Save File
    file_id = str(uuid.uuid4())
    unique_filename = f"{file_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            if len(content) > 50 * 1024 * 1024:  # 50MB limit
                raise HTTPException(status_code=400, detail="File too large (> 50MB)")
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # 3. Processing
    try:
        results = process_document(file_path)
        return {
            "filename": file.filename,
            "file_id": file_id,
            "status": "success",
            "message": "File uploaded and processed",
            "processing_results": results
        }
    except Exception as e:
        # even if processing fails, the file is uploaded. 
        # but we returning 500 for now to indicate pipeline failure
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
