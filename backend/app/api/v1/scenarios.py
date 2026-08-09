from fastapi import APIRouter, Depends
from app.api.schemas import APIResponse, ScenarioRequest
from app.api.deps import get_current_user, CurrentUser

router = APIRouter()

@router.post("/{project_id}/scenario", response_model=APIResponse[dict])
async def run_scenario(project_id: str, request: ScenarioRequest, current_user: CurrentUser = Depends(get_current_user)):
    """Run scenario analysis with custom weights."""
    weights = request.weights
    cost_w = weights.get("cost", 0.3)
    quality_w = weights.get("quality", 0.4)
    speed_w = weights.get("speed", 0.3)

    # Mock reactive logic
    # Supplier A: good quality, high cost
    # Supplier B: low cost, medium quality
    # Supplier C: high speed, low cost

    score_a = int((quality_w * 95) + (cost_w * 60) + (speed_w * 80))
    score_b = int((quality_w * 75) + (cost_w * 95) + (speed_w * 70))
    score_c = int((quality_w * 70) + (cost_w * 90) + (speed_w * 95))

    ranking = [
        {"id": "sup-1", "name": "ABC Industries", "score": score_a},
        {"id": "sup-2", "name": "Global Tech Machining", "score": score_b},
        {"id": "sup-3", "name": "FastTrack Manufacturing", "score": score_c},
    ]

    # Sort descending by score
    ranking.sort(key=lambda x: x["score"], reverse=True)

    return APIResponse(data={"ranking": ranking})
