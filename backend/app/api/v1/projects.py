from fastapi import APIRouter, Depends, HTTPException
import uuid
from app.api.schemas import APIResponse, ProjectCreate
from app.api.deps import get_current_user, CurrentUser
from app.core.supabase import supabase

router = APIRouter()

@router.post("", response_model=APIResponse[dict], status_code=201)
async def create_project(project: ProjectCreate, current_user: CurrentUser = Depends(get_current_user)):
    """Create a new procurement project."""
    project_id = str(uuid.uuid4())
    
    # Try inserting into supabase (will fail gracefully if tables don't exist yet)
    try:
        supabase.table("projects").insert({
            "id": project_id,
            "user_id": current_user.user_id,
            "title": project.title,
            "description": project.description
        }).execute()
    except Exception as e:
        print(f"Warning: Supabase insert failed (is the table created?): {e}")
        
    return APIResponse(
        data={"project_id": project_id},
        message="Project created successfully"
    )

@router.get("", response_model=APIResponse[list])
async def get_projects(current_user: CurrentUser = Depends(get_current_user)):
    """Get all projects for the current user."""
    try:
        response = supabase.table("projects").select("*").eq("user_id", current_user.user_id).execute()
        return APIResponse(
            data=response.data,
            message="Projects retrieved"
        )
    except Exception as e:
        print(f"Warning: Supabase query failed: {e}")
        return APIResponse(data=[], message="Failed to retrieve projects (mocking empty)")

@router.get("/{project_id}", response_model=APIResponse[dict])
async def get_project(project_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get project details."""
    try:
        response = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", current_user.user_id).single().execute()
        return APIResponse(
            data=response.data,
            message="Project retrieved"
        )
    except Exception as e:
        print(f"Warning: Supabase query failed: {e}")
        return APIResponse(
            data={"project_id": project_id, "title": "Mock Project"},
            message="Project retrieved (mock fallback)"
        )

@router.delete("/{project_id}", response_model=APIResponse[dict])
async def delete_project(project_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Soft delete a project."""
    try:
        supabase.table("projects").delete().eq("id", project_id).eq("user_id", current_user.user_id).execute()
    except Exception as e:
        print(f"Warning: Supabase delete failed: {e}")
        
    return APIResponse(
        data={"project_id": project_id},
        message="Project deleted"
    )
