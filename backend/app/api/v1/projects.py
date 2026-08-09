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
    
    try:
        supabase.table("projects").insert({
            "id": project_id,
            "user_id": current_user.user_id,
            "title": project.title,
            "description": project.description,
            "category": project.category,
            "target_budget": project.target_budget,
            "status": "Draft"
        }).execute()
    except Exception as e:
        print(f"Warning: Supabase insert failed: {e}")
        raise HTTPException(status_code=500, detail="Database error. Did you run the SQL migration script?")
        
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
        raise HTTPException(status_code=500, detail="Database error. Did you run the SQL migration script?")

@router.get("/{project_id}/status", response_model=APIResponse[dict])
async def get_project_status(project_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get just the project status to avoid heavy polling."""
    try:
        project_res = supabase.table("projects").select("status").eq("id", project_id).eq("user_id", current_user.user_id).single().execute()
        return APIResponse(
            data={"status": project_res.data["status"]},
            message="Status retrieved"
        )
    except Exception as e:
        print(f"Warning: Supabase query failed: {e}")
        raise HTTPException(status_code=500, detail="Database error.")

@router.get("/{project_id}", response_model=APIResponse[dict])
def get_project(project_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Get project details with nested relationships."""
    try:
        project_res = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", current_user.user_id).single().execute()
        project = project_res.data
        
        # Fetch documents
        docs_res = supabase.table("documents").select("*").eq("project_id", project_id).execute()
        
        # Fetch suppliers
        suppliers_res = supabase.table("suppliers").select("*").eq("project_id", project_id).execute()
        
        # Fetch requirements
        reqs_res = supabase.table("requirements").select("*").eq("project_id", project_id).execute()
        
        # Fetch evidence
        evidence_res = supabase.table("evidence").select("*").eq("project_id", project_id).execute()
        
        # Fetch constraint results
        constraints_res = supabase.table("constraint_results").select("*").eq("project_id", project_id).execute()
        
        # Format documents
        documents = []
        for d in docs_res.data:
            documents.append({
                "id": d["id"],
                "name": d["filename"],
                "size": d.get("size", "0 MB"),
                "type": (d["mime_type"].split("/")[-1].upper() if "/" in (d.get("mime_type") or "") else d.get("mime_type", "UNKNOWN")),
                "uploadedAt": d["created_at"].split("T")[0] if d.get("created_at") else "",
                "status": d.get("status", "Ready"),
                "pagesCount": d.get("pages_count")
            })
            
        # Format evidence map for easy lookup
        evidence_map = {e["id"]: {
            "id": e["id"],
            "supplierId": e["supplier_id"],
            "supplierName": next((s["name"] for s in suppliers_res.data if s["id"] == e["supplier_id"]), ""),
            "docName": e["doc_name"],
            "pageNumber": e["page_number"],
            "sectionTitle": e["section_title"],
            "extractedText": e["extracted_text"],
            "confidenceScore": e["confidence_score"],
            "evidenceType": e["evidence_type"]
        } for e in evidence_res.data}
        
        # Format suppliers
        suppliers = []
        for s in suppliers_res.data:
            primary_evidence = evidence_map.get(s["primary_evidence_id"]) if s.get("primary_evidence_id") else None
            suppliers.append({
                "id": s["id"],
                "name": s["name"],
                "location": s["location"],
                "status": s["status"],
                "rawCost": s["raw_cost"],
                "rawMoq": s["raw_moq"],
                "rawTime": s["raw_time"],
                "isoCertified": s["iso_certified"],
                "scores": s.get("scores", {}),
                "strengths": s.get("strengths", []),
                "weaknesses": s.get("weaknesses", []),
                "primaryEvidence": primary_evidence,
                "riskDetails": s.get("risk_details"),
                "contactEmail": s.get("contact_email")
            })
            
        # Format requirements
        requirements = []
        req_map = {}
        for r in reqs_res.data:
            req_obj = {
                "id": r["id"],
                "category": r["category"],
                "name": r["name"],
                "expected": r["expected"],
                "unit": r.get("unit"),
                "priority": r["priority"],
                "description": r.get("description")
            }
            requirements.append(req_obj)
            req_map[r["id"]] = req_obj
            
        # Format constraint results
        constraints_by_req = {}
        for c in constraints_res.data:
            req_id = c["requirement_id"]
            if req_id not in constraints_by_req:
                constraints_by_req[req_id] = {
                    "requirementId": req_id,
                    "requirementName": req_map.get(req_id, {}).get("name", ""),
                    "expected": req_map.get(req_id, {}).get("expected", ""),
                    "supplierResults": {}
                }
            constraints_by_req[req_id]["supplierResults"][c["supplier_id"]] = {
                "status": c["status"],
                "actualValue": c["actual_value"],
                "notes": c.get("notes", "")
            }
        
        constraints = list(constraints_by_req.values())

        # Combine into project
        project_data = {
            "id": project["id"],
            "name": project["title"],
            "description": project.get("description", ""),
            "category": project.get("category", "Uncategorized"),
            "status": project.get("status", "Draft"),
            "date": project["created_at"].split("T")[0] if project.get("created_at") else "",
            "targetBudget": project.get("target_budget"),
            "documents": documents,
            "suppliers": suppliers,
            "requirements": requirements,
            "constraints": constraints
        }
        
        return APIResponse(
            data=project_data,
            message="Project retrieved"
        )
    except Exception as e:
        print(f"Warning: Supabase query failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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
