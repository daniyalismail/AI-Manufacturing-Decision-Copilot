import pytest
from unittest.mock import AsyncMock, patch
from app.agents import (
    DocumentClassifierAgent, 
    RequirementExtractionAgent, 
    ExplanationAgent
)
from app.agents.models import (
    DocumentClassification,
    RequirementCollection,
    RequirementItem,
    RecommendationSummary
)

@pytest.fixture
def mock_instructor_client():
    with patch("app.agents.base.ai_client") as mock_client:
        yield mock_client

@pytest.mark.asyncio
async def test_document_classifier_agent(mock_instructor_client):
    # Setup mock response
    mock_response = DocumentClassification(
        document_type="Requirement Document",
        confidence=0.98,
        reason="It contains technical specs"
    )
    mock_instructor_client.chat.completions.create = AsyncMock(return_value=mock_response)

    agent = DocumentClassifierAgent()
    result = await agent.run(document_text="This is a technical requirement for aluminum pipes.")
    
    assert result.document_type == "Requirement Document"
    assert result.confidence == 0.98
    
    # Verify the mocked client was called with correct parameters
    mock_instructor_client.chat.completions.create.assert_called_once()
    kwargs = mock_instructor_client.chat.completions.create.call_args.kwargs
    assert kwargs["model"] == "gpt-4-turbo-preview"
    assert kwargs["response_model"] == DocumentClassification
    assert kwargs["temperature"] == 0.0

@pytest.mark.asyncio
async def test_requirement_extraction_agent(mock_instructor_client):
    mock_response = RequirementCollection(
        requirements=[
            RequirementItem(
                name="Material",
                value="Aluminum",
                mandatory=True,
                confidence=0.99,
                evidence=None
            )
        ]
    )
    mock_instructor_client.chat.completions.create = AsyncMock(return_value=mock_response)

    agent = RequirementExtractionAgent()
    result = await agent.run(text="We need Aluminum.")
    
    assert len(result.requirements) == 1
    assert result.requirements[0].name == "Material"
    assert result.requirements[0].value == "Aluminum"

@pytest.mark.asyncio
async def test_explanation_agent(mock_instructor_client):
    mock_response = RecommendationSummary(
        summary="Good supplier",
        strengths=["Cheap"],
        weaknesses=["Slow"],
        recommendation="Proceed with caution",
        confidence=0.85
    )
    mock_instructor_client.chat.completions.create = AsyncMock(return_value=mock_response)

    agent = ExplanationAgent()
    result = await agent.run(decision_json="{}", evidence="[]")
    
    assert result.summary == "Good supplier"
    assert result.confidence == 0.85
