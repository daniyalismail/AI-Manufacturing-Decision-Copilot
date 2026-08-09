from fastapi import APIRouter, Depends
from app.api.schemas import APIResponse
from app.api.deps import get_current_user, CurrentUser

router = APIRouter()

@router.get("/{project_id}/requirements", response_model=APIResponse[list])
async def get_requirements(project_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get extracted procurement requirements."""
    return APIResponse(data=[])

@router.get("/{project_id}/constraints", response_model=APIResponse[dict])
async def get_constraints(project_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get constraint validation statuses."""
    return APIResponse(data={"status": "Passed"})

@router.get("/{project_id}/recommendation", response_model=APIResponse[dict])
async def get_recommendation(project_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get the final recommended supplier and explanation."""
    return APIResponse(data={
        "supplier": "ABC Industries",
        "score": 94,
        "confidence": 0.91,
        "summary": "ABC Industries emerged as the optimal choice. While GlobalTech offered a lower baseline price ($1,150), they failed the strict acoustics constraint and the 4-week lead time requirement. ABC Industries meets all technical parameters and includes native IoT nodes out-of-the-box."
    })
