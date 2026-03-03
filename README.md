# Intelligent Document Management System

A modern, secure document management system using open-source technologies for intelligent classification and metadata extraction.

## Features
- Drag & drop file upload.
- Intelligent classification (Contract, Quote, etc.) using `sentence-transformers`.
- OCR for images and PDFs using `Tesseract`.
- Metadata extraction (dates, amounts, entities) using `spaCy` and `Regex`.

## Prerequisites
1. **Python 3.10+**
2. **Node.js 18+**
3. **Tesseract OCR**: 
   - Windows: [Download installer](https://github.com/UB-Mannheim/tesseract/wiki)
   - Linux: `sudo apt install tesseract-ocr`
4. **Poppler** (for PDF conversion):
   - Windows: [Download](https://github.com/oschwartz10612/poppler-windows/releases/) and add to PATH.
   - Linux: `sudo apt install poppler-utils`

## Setup

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Download SpaCy model: `python -m spacy download en_core_web_sm`
4. Run server: `python main.py` (Runs on port 8000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on port 3000)

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Lucide React.
- **Backend**: FastAPI.
- **Processing**: pytesseract, python-docx, openpyxl, sentence-transformers, spacy.
