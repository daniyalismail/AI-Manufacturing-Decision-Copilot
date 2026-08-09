from fastapi import APIRouter, Depends
from app.api.schemas import APIResponse, CompareRequest
from app.api.deps import get_current_user, CurrentUser

router = APIRouter()

@router.get("/projects/{project_id}/suppliers", response_model=APIResponse[list])
async def get_project_suppliers(project_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get all suppliers for a project."""
    mock_data = [
        {
            "id": "sup-1",
            "name": "ABC Industries",
            "score": 94,
            "cost": 125000,
            "lead_time": "3 weeks",
            "qualified": True,
            "recommended": True
        },
        {
            "id": "sup-2",
            "name": "Global Tech Machining",
            "score": 88,
            "cost": 118000,
            "lead_time": "5 weeks",
            "qualified": True,
            "recommended": False
        },
        {
            "id": "sup-3",
            "name": "FastTrack Manufacturing",
            "score": 72,
            "cost": 95000,
            "lead_time": "2 weeks",
            "qualified": False,
            "recommended": False
        },
        {
            "id": "sup-4",
            "name": "Premium Components Ltd",
            "score": 91,
            "cost": 142000,
            "lead_time": "3 weeks",
            "qualified": True,
            "recommended": False
        }
    ]
    return APIResponse(data=mock_data)

@router.get("/suppliers/{supplier_id}", response_model=APIResponse[dict])
async def get_supplier(supplier_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get supplier profile and quote details."""
    return APIResponse(data={"supplier_id": supplier_id})

@router.post("/projects/{project_id}/compare", response_model=APIResponse[dict])
async def compare_suppliers(project_id: str, request: CompareRequest, current_user: CurrentUser = Depends(get_current_user)):
    """Compare multiple suppliers."""
    return APIResponse(data={"comparison": {}})
