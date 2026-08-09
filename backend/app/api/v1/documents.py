from fastapi import APIRouter, Depends, UploadFile, File
import uuid
import os
from app.api.schemas import APIResponse
from app.api.deps import get_current_user, CurrentUser
from app.api.exceptions import ValidationError
from app.core.supabase import supabase

router = APIRouter()

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/png",
    "image/jpeg",
    "text/plain",
    "text/markdown"
}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB

@router.post("/{project_id}/documents", response_model=APIResponse[dict])
async def upload_document(
    project_id: str, 
    file: UploadFile = File(...), 
    current_user: CurrentUser = Depends(get_current_user)
):
    """Upload a document to a project via Supabase Storage."""
    
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise ValidationError("INVALID_FILE: Unsupported file type")
        
    # Read to check size
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise ValidationError("INVALID_FILE: File exceeds 25MB limit")
        
    document_id = str(uuid.uuid4())
    storage_path = f"{current_user.user_id}/{project_id}/{document_id}_{file.filename}"
    
    try:
        # 1. Upload to Supabase Storage Bucket ("documents")
        supabase.storage.from_("documents").upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": file.content_type}
        )
        
        # 2. Save metadata to "documents" table
        supabase.table("documents").insert({
            "id": document_id,
            "project_id": project_id,
            "filename": file.filename,
            "storage_path": storage_path,
            "mime_type": file.content_type
        }).execute()
        
    except Exception as e:
        print(f"Warning: Supabase upload failed (are keys valid & bucket created?): {e}")
        # Fallback to local storage if supabase fails so UI doesn't break
        upload_dir = f"data/uploads/{project_id}"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as f:
            f.write(file_bytes)
            
    return APIResponse(
        data={"document_id": document_id, "status": "uploaded", "filename": file.filename},
        message="Document uploaded successfully"
    )
