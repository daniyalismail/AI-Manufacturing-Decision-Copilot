from fastapi import APIRouter, Depends, BackgroundTasks
import uuid
from app.api.schemas import APIResponse
from app.api.deps import get_current_user, CurrentUser

router = APIRouter()
import os
import uuid
from typing import Dict, Any

from app.orchestration.graph import orchestrator
from app.orchestration.state import GraphState

# In-memory storage for hackathon decision results
DECISION_STORE: Dict[str, Any] = {}

async def run_analysis_pipeline(project_id: str):
    print(f"Starting analysis for project {project_id}")
    upload_dir = f"data/uploads/{project_id}"
    
    if not os.path.exists(upload_dir):
        print("No documents found.")
        return
        
    combined_content = b""
    for filename in os.listdir(upload_dir):
        with open(os.path.join(upload_dir, filename), "rb") as f:
            combined_content += b"\n\n--- Document: " + filename.encode() + b" ---\n\n"
            combined_content += f.read()
            
    initial_state = GraphState(
        project_id=uuid.UUID(project_id),
        file_bytes=combined_content,
        mime_type="text/plain",
        filename="aggregated_documents.txt"
    )
    
    try:
        final_state = await orchestrator.ainvoke(initial_state)
        
        if "errors" in final_state and final_state["errors"]:
            print("Orchestrator finished with errors:", final_state["errors"])
            
        decision = final_state.get("decision_result")
        explanation = final_state.get("explanation")
        
        if decision:
            DECISION_STORE[project_id] = {
                "decision": decision.model_dump(),
                "explanation": explanation
            }
            print(f"Analysis complete. Recommended: {decision.recommended_supplier_id}")
        else:
            print("Analysis complete, but no decision result found.")
            
    except Exception as e:
        print(f"Pipeline failed: {e}")

@router.post("/{project_id}/analyze", response_model=APIResponse[dict])
async def analyze_project(
    project_id: str, 
    background_tasks: BackgroundTasks,
    current_user: CurrentUser = Depends(get_current_user)
):
    """Trigger AI pipeline orchestration."""
    analysis_id = str(uuid.uuid4())
    
    # In a real app, this triggers LangGraph
    background_tasks.add_task(run_analysis_pipeline, project_id)
    
    return APIResponse(
        data={"analysis_id": analysis_id, "status": "processing"},
        message="Analysis queued"
    )

@router.get("/{analysis_id}", response_model=APIResponse[dict])
async def get_analysis_status(analysis_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get status of an analysis job."""
    return APIResponse(
        data={"status": "processing", "progress": 65}
    )

@router.get("/{analysis_id}/result", response_model=APIResponse[dict])
async def get_analysis_result(analysis_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get final recommendation and ranking result."""
    # Since analysis_id is a random uuid, but we want the project result, we use project_id in the script
    # We will just fetch from the in-memory store for demo purposes.
    result = DECISION_STORE.get(analysis_id)
    if not result:
        return APIResponse(data={}, success=False, message="Result not ready or project not found")
        
    decision = result["decision"]
    explanation = result["explanation"]
    
    return APIResponse(
        data={
            "recommended_supplier": decision.get("recommended_supplier_id"),
            "confidence": decision.get("confidence_score"),
            "explanation": explanation,
            "ranking": decision.get("ranking", [])
        }
    )
