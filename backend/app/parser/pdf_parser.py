import fitz  # PyMuPDF
import io
from app.api.exceptions import APIException
from app.parser.models import ParsedDocument, ParsedPage

class ParsingError(APIException):
    def __init__(self, message: str):
        super().__init__(code="PARSING_ERROR", message=message, status_code=400)

class PDFParser:
    @staticmethod
    def parse(file_bytes: bytes) -> ParsedDocument:
        try:
            doc = fitz.open("pdf", file_bytes)
            parsed_doc = ParsedDocument()
            parsed_doc.metadata["page_count"] = len(doc)
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text("text").strip()
                
                # If PyMuPDF extracts nothing, it might be a scanned PDF
                if text:
                    parsed_doc.pages.append(ParsedPage(
                        page_number=page_num + 1,
                        text=text
                    ))
            
            doc.close()
            
            # If no text extracted at all, we could raise an error to trigger OCR fallback
            if not parsed_doc.pages:
                raise ParsingError("No text extracted from PDF. May require OCR.")
                
            return parsed_doc
            
        except Exception as e:
            if isinstance(e, ParsingError):
                raise
            raise ParsingError(f"Failed to parse PDF: {str(e)}")
