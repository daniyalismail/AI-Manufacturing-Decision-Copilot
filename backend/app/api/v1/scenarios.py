from fastapi import APIRouter, Depends
from app.api.schemas import APIResponse, ScenarioRequest
from app.api.deps import get_current_user, CurrentUser

from app.core.supabase import supabase

router = APIRouter()

@router.post("/{project_id}/scenario", response_model=APIResponse[dict])
async def run_scenario(project_id: str, request: ScenarioRequest, current_user: CurrentUser = Depends(get_current_user)):
    """Run scenario analysis with custom weights."""
    weights = request.weights
    
    # Weights from frontend are 0-100, we need to normalize them
    total_w = sum(weights.values()) or 1.0
    cost_w = weights.get("cost", 20) / total_w
    quality_w = weights.get("quality", 20) / total_w
    speed_w = weights.get("leadTime", 20) / total_w
    risk_w = weights.get("risk", 20) / total_w
    esg_w = weights.get("sustainability", 20) / total_w

    try:
        suppliers_res = supabase.table("suppliers").select("*").eq("project_id", project_id).execute()
        suppliers = suppliers_res.data
    except Exception as e:
        return APIResponse(data={"ranking": []})

    ranking = []
    for s in suppliers:
        scores = s.get("scores", {})
        
        q_score = scores.get("quality", 0)
        c_score = scores.get("commercial", 0)
        d_score = scores.get("delivery", 0)
        r_score = scores.get("risk", 0)
        e_score = scores.get("esg", 0)
        
        simulated_score = int(
            (q_score * quality_w) +
            (c_score * cost_w) +
            (d_score * speed_w) +
            (r_score * risk_w) +
            (e_score * esg_w)
        )
        
        ranking.append({
            "id": s["id"],
            "name": s["name"],
            "calculatedScore": simulated_score,
            "rawCost": s.get("raw_cost"),
            "rawTime": s.get("raw_time"),
            "status": s.get("status")
        })

    # Sort descending by calculated score
    ranking.sort(key=lambda x: x["calculatedScore"], reverse=True)

    return APIResponse(data={"ranking": ranking})
