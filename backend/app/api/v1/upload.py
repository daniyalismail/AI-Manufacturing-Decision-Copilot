import uuid
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.upload import UploadService

router = APIRouter(prefix="/projects", tags=["Upload"])

@router.post("/{project_id}/documents/upload")
async def upload_document(
    project_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_db)
):
    upload_service = UploadService(session)
    
    # Run the synchronous part (validate, upload, db record)
    result = await upload_service.process_upload(project_id, file)
    
    # We must rewind the file to pass bytes to the background task, 
    # since we already read it in process_upload. Actually, we read it and the file pointer is at EOF.
    # We can either pass the bytes back from process_upload, or read it again.
    # It's cleaner if process_upload returns the bytes, but since we didn't, let's just seek(0).
    await file.seek(0)
    file_bytes = await file.read()
    
    # Schedule the parsing in background
    # Note: background tasks run after the response is returned. 
    # Because session might be closed by dependency injection after response,
    # it's usually better to spawn a new session inside the background task.
    # To keep this simple for the hackathon, we'll use a new session block inside the background task wrapper.
    background_tasks.add_task(run_background_parsing, result["id"], file_bytes, file.content_type, file.filename)
    
    return result

async def run_background_parsing(document_id: uuid.UUID, file_bytes: bytes, mime_type: str, filename: str):
    from app.database.session import AsyncSessionLocal
    async with AsyncSessionLocal() as session:
        upload_service = UploadService(session)
        await upload_service.parse_document_background(document_id, file_bytes, mime_type, filename)
