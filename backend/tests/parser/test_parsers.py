from app.parser.factory import ParserFactory
from app.parser.pdf_parser import ParsingError
import pytest
from unittest.mock import patch, MagicMock

def test_parser_factory_unsupported_mime():
    with pytest.raises(ParsingError, match="Unsupported MIME type"):
        ParserFactory.parse(b"dummy", "application/json", "test.json")

@patch('app.parser.pdf_parser.fitz.open')
def test_pdf_parser(mock_fitz_open):
    # Mocking PyMuPDF
    mock_doc = MagicMock()
    mock_doc.__len__.return_value = 1
    
    mock_page = MagicMock()
    mock_page.get_text.return_value = "Test PDF Content"
    mock_doc.load_page.return_value = mock_page
    
    mock_fitz_open.return_value = mock_doc
    
    parsed_doc = ParserFactory.parse(b"dummy pdf", "application/pdf", "test.pdf")
    assert len(parsed_doc.pages) == 1
    assert parsed_doc.pages[0].text == "Test PDF Content"
    
@patch('app.ocr.tesseract.Image.open')
@patch('app.ocr.tesseract.pytesseract.image_to_string')
def test_image_parser(mock_tesseract, mock_image_open):
    mock_tesseract.return_value = "Extracted Image Text"
    
    parsed_doc = ParserFactory.parse(b"dummy img", "image/png", "test.png")
    assert len(parsed_doc.pages) == 1
    assert parsed_doc.pages[0].text == "Extracted Image Text"
    
@patch('app.parser.docling_parser.docx.Document')
def test_office_parser_docx(mock_doc_cls):
    mock_doc = MagicMock()
    mock_para = MagicMock()
    mock_para.text = "Mocked DOCX Content"
    mock_doc.paragraphs = [mock_para]
    
    mock_doc_cls.return_value = mock_doc
    
    parsed_doc = ParserFactory.parse(b"dummy docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "test.docx")
    
    assert len(parsed_doc.pages) == 1
    assert parsed_doc.pages[0].text == "Mocked DOCX Content"
