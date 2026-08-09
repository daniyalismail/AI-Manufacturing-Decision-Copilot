import pytesseract
from PIL import Image
import io
from app.parser.models import ParsedDocument, ParsedPage
from app.parser.pdf_parser import ParsingError

class OCRService:
    @staticmethod
    def parse_image(file_bytes: bytes) -> ParsedDocument:
        try:
            image = Image.open(io.BytesIO(file_bytes))
            text = pytesseract.image_to_string(image).strip()
            
            parsed_doc = ParsedDocument()
            if text:
                parsed_doc.pages.append(ParsedPage(
                    page_number=1,
                    text=text
                ))
            else:
                raise ParsingError("OCR failed to extract text from image.")
                
            return parsed_doc
            
        except Exception as e:
            if isinstance(e, ParsingError):
                raise
            raise ParsingError(f"Failed to process image with OCR: {str(e)}")
