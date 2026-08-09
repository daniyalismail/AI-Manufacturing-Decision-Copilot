from app.parser.pdf_parser import PDFParser
from app.parser.docling_parser import OfficeParser
from app.ocr.tesseract import OCRService
from app.parser.models import ParsedDocument
from app.parser.pdf_parser import ParsingError

class ParserFactory:
    @staticmethod
    def parse(file_bytes: bytes, mime_type: str, filename: str) -> ParsedDocument:
        if mime_type == "application/pdf":
            try:
                return PDFParser.parse(file_bytes)
            except ParsingError:
                # If PDF is scanned, we could fall back to OCR here (e.g. converting pages to images first)
                # For simplicity in this iteration, we bubble up the error.
                raise
                
        elif mime_type in [
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ]:
            ext = ".docx" if "wordprocessingml" in mime_type else ".xlsx"
            return OfficeParser.parse(file_bytes, ext)
            
        elif mime_type in ["image/png", "image/jpeg"]:
            return OCRService.parse_image(file_bytes)
            
        elif mime_type == "text/plain":
            from app.parser.models import ParsedPage
            return ParsedDocument(
                full_text=file_bytes.decode("utf-8"),
                pages=[ParsedPage(page_number=1, text=file_bytes.decode("utf-8"))],
                metadata={}
            )
            
        else:
            raise ParsingError(f"Unsupported MIME type for parsing: {mime_type}")
