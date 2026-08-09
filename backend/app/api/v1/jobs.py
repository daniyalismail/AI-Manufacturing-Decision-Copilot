from fastapi import APIRouter, Depends
from app.api.schemas import APIResponse
from app.api.deps import get_current_user, CurrentUser

router = APIRouter()

@router.get("/{job_id}", response_model=APIResponse[dict])
async def get_job_status(job_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get status of a background job."""
    return APIResponse(
        data={"status": "processing", "progress": 72}
    )

@router.post("/{job_id}/retry", response_model=APIResponse[dict])
async def retry_job(job_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Retry a failed job."""
    return APIResponse(
        data={"status": "queued"}
    )
