import pytest
import uuid
from typing import List, Dict, Any
from app.rag.chunker import SemanticChunker
from app.rag.models import Chunk, ChunkMetadata, RetrievedEvidence
from app.parser.models import ParsedDocument, ParsedPage

@pytest.fixture
def mock_parsed_document():
    text = (
        "This is a sample document about aluminum procurement. " * 50 +  # ~250 tokens
        "The MOQ is 1000 units. " * 50 # ~250 tokens
    )
    pages = [ParsedPage(page_number=1, text=text)]
    return ParsedDocument(pages=pages, metadata={}, full_text=text)

def test_semantic_chunker(mock_parsed_document):
    chunker = SemanticChunker(target_tokens=100, overlap_tokens=20, model="text-embedding-3-small")
    
    project_id = uuid.uuid4()
    doc_id = uuid.uuid4()
    
    chunks = chunker.chunk_document(
        project_id=project_id,
        document_id=doc_id,
        doc_name="test.pdf",
        doc_type="Requirement Document",
        supplier=None,
        parsed_doc=mock_parsed_document
    )
    
    # We should have multiple chunks since the total tokens > target_tokens
    assert len(chunks) > 1
    
    # Check metadata preservation
    assert chunks[0].metadata.document_name == "test.pdf"
    assert chunks[0].metadata.page == 1
    assert chunks[0].metadata.chunk_index == 0
    assert chunks[1].metadata.chunk_index == 1

def test_context_builder():
    from app.rag.retriever import ContextBuilder
    
    meta1 = ChunkMetadata(
        project_id=uuid.uuid4(),
        document_id=uuid.uuid4(),
        document_name="Quote.pdf",
        page=4,
        chunk_index=1
    )
    c1 = Chunk(text="Pricing is $10.", metadata=meta1)
    ev1 = RetrievedEvidence(chunk=c1, similarity=0.9)
    
    context = ContextBuilder.build([ev1])
    
    assert "--- Source 1: Quote.pdf Page 4 ---" in context
    assert "Pricing is $10." in context

# In a real async integration test, we'd mock the database session and OpenAI
# But for the purpose of verifying the deterministic pipeline structure, these unit tests suffice.
