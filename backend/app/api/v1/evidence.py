from fastapi import APIRouter, Depends
from app.api.schemas import APIResponse
from app.api.deps import get_current_user, CurrentUser

router = APIRouter()

@router.get("/{project_id}/evidence", response_model=APIResponse[list])
async def get_evidence(project_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get RAG-retrieved evidence for a project."""
    mock_data = [
        {
            "id": "ev-1",
            "document": "Supplier_A_SpecSheet.pdf",
            "page": 3,
            "text": "The motor housing is constructed using aerospace-grade aluminum alloy, ensuring weight reduction while maintaining a structural integrity rating of 500 MPa.",
            "relevance": 0.95
        },
        {
            "id": "ev-2",
            "document": "Contract_Terms_GlobalTech.docx",
            "page": 12,
            "text": "Standard delivery lead time for orders exceeding 5,000 units is guaranteed at 3 weeks from the date of final design approval.",
            "relevance": 0.88
        },
        {
            "id": "ev-3",
            "document": "ISO_Certification_2025.pdf",
            "page": 1,
            "text": "This certifies that ABC Industries operates a Quality Management System which complies with the requirements of ISO 9001:2015.",
            "relevance": 0.99
        }
    ]
    return APIResponse(data=mock_data)
