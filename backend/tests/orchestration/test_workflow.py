import pytest
import uuid
from unittest.mock import AsyncMock, patch
from app.orchestration.state import GraphState
from app.orchestration.graph import orchestrator
from app.agents.models import DocumentClassification, RequirementCollection, RequirementItem, SupplierModel, RecommendationSummary

@pytest.fixture
def mock_instructor_client():
    with patch("app.agents.base.ai_client") as mock_client:
        yield mock_client

@pytest.mark.asyncio
async def test_end_to_end_orchestration_requirements(mock_instructor_client):
    # Mock Document Classification
    mock_class_response = DocumentClassification(
        document_type="Requirement Document",
        confidence=0.99,
        reason="Has specs"
    )
    
    # Mock Requirement Extraction
    mock_req_response = RequirementCollection(
        requirements=[
            RequirementItem(
                name="Voltage",
                value="220V",
                mandatory=True,
                confidence=0.99,
                evidence=None
            )
        ]
    )
    
    # Mock Explanation
    mock_exp_response = RecommendationSummary(
        summary="Summary of rec",
        recommendation="Recommended",
        strengths=[],
        weaknesses=[],
        confidence=0.9
    )
    
    # Setup mock to return classification on first call, extraction on second, explanation on third
    mock_instructor_client.chat.completions.create = AsyncMock(side_effect=[
        mock_class_response,
        mock_req_response,
        mock_exp_response
    ])

    initial_state = GraphState(
        project_id=uuid.uuid4(),
        file_bytes=b"We need 220V voltage.",
        mime_type="application/pdf",
        filename="specs.pdf",
        parsed_document=None,
        classification=None,
        extracted_data={},
        procurement_project=None,
        decision_result=None,
        validation_report=None,
        chunks=None,
        retrieved_evidence=None,
        explanation=None,
        errors=[]
    )

    # In tests involving fitz/PyMuPDF we might need to mock fitz.open if we don't pass a real PDF.
    # Let's mock the parser so it just returns some text
    with patch("app.orchestration.nodes.ParserFactory.parse") as mock_parser, \
         patch("app.rag.embeddings.EmbeddingGenerator.generate") as mock_embed:
        from app.parser.models import ParsedDocument, ParsedPage
        mock_parser.return_value = ParsedDocument(pages=[ParsedPage(page_number=1, text="We need 220V voltage.")])
        mock_embed.return_value = [[0.1, 0.2, 0.3]]

        # Run the workflow
        final_state = await orchestrator.ainvoke(initial_state)
        
        # Assertions
        assert "errors" not in final_state or not final_state["errors"]
        assert final_state["classification"].document_type == "Requirement Document"
        assert len(final_state["extracted_data"]["requirements"]) == 1
        
        # Verify PKM
        project = final_state["procurement_project"]
        assert project is not None
        assert len(project.requirements) == 1
        assert project.requirements[0].name == "Voltage"
        assert project.requirements[0].expected_value == "220V"
        
        # Verify orchestration advanced states
        assert final_state.get("validation_report") is not None
        assert final_state.get("decision_result") is not None
        assert final_state.get("chunks") is not None
        assert len(final_state["chunks"]) > 0
        
        # Verify explanation was triggered (although decision result may lack recommendation for single req document)
        if final_state["decision_result"].recommended_supplier_id:
            assert final_state.get("explanation") == "Summary of rec"

@pytest.mark.asyncio
async def test_end_to_end_orchestration_supplier(mock_instructor_client):
    # Mock Document Classification
    mock_class_response = DocumentClassification(
        document_type="Supplier Quote",
        confidence=0.99,
        reason="Has pricing"
    )
    
    # Mock Supplier Extraction
    mock_sup_response = SupplierModel(
        name="Acme Corp",
        country="USA",
        currency="USD",
        lead_time_days=10,
        minimum_order_quantity=100,
        confidence=0.99
    )
    
    # Mock Explanation
    mock_exp_response = RecommendationSummary(
        summary="Summary of rec",
        recommendation="Recommended",
        strengths=[],
        weaknesses=[],
        confidence=0.9
    )
    
    mock_instructor_client.chat.completions.create = AsyncMock(side_effect=[
        mock_class_response,
        mock_sup_response,
        mock_exp_response
    ])

    initial_state = GraphState(
        project_id=uuid.uuid4(),
        file_bytes=b"Acme Corp Quote",
        mime_type="application/pdf",
        filename="quote.pdf",
        parsed_document=None,
        classification=None,
        extracted_data={},
        procurement_project=None,
        decision_result=None,
        validation_report=None,
        chunks=None,
        retrieved_evidence=None,
        explanation=None,
        errors=[]
    )

    with patch("app.orchestration.nodes.ParserFactory.parse") as mock_parser, \
         patch("app.rag.embeddings.EmbeddingGenerator.generate") as mock_embed:
        from app.parser.models import ParsedDocument, ParsedPage
        mock_parser.return_value = ParsedDocument(pages=[ParsedPage(page_number=1, text="Acme Corp Quote")])
        mock_embed.return_value = [[0.1, 0.2, 0.3]]

        # Run the workflow
        final_state = await orchestrator.ainvoke(initial_state)
        
        assert "errors" not in final_state or not final_state["errors"]
        assert final_state["classification"].document_type == "Supplier Quote"
        
        project = final_state["procurement_project"]
        assert project is not None
        assert len(project.suppliers) == 1
        assert project.suppliers[0].name == "Acme Corp"
        assert project.suppliers[0].country == "USA"
