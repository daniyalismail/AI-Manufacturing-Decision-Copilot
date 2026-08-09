import uuid
import structlog
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.document import DocumentRepository
from app.repositories.chunk import DocumentChunkRepository
from app.storage.supabase import SupabaseStorage
from app.parser.factory import ParserFactory
from app.parser.pdf_parser import ParsingError
from app.api.exceptions import APIException

logger = structlog.get_logger()

class UploadError(APIException):
    def __init__(self, message: str):
        super().__init__(code="UPLOAD_ERROR", message=message, status_code=400)

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/png",
    "image/jpeg"
}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB

class UploadService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.document_repo = DocumentRepository(session)
        self.chunk_repo = DocumentChunkRepository(session)
        self.storage = SupabaseStorage()

    async def process_upload(self, project_id: uuid.UUID, file: UploadFile) -> dict:
        """
        Validates, uploads, and schedules parsing for a document.
        """
        # 1. Validate
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise UploadError(f"Unsupported file type: {file.content_type}")
            
        file_bytes = await file.read()
        file_size = len(file_bytes)
        if file_size > MAX_FILE_SIZE:
            raise UploadError("File exceeds maximum allowed size of 25MB.")
            
        # 2. Upload to Supabase Storage
        path = self.storage.upload_file(project_id, file.filename, file_bytes, file.content_type)
        
        # 3. Create Document Record
        doc_data = {
            "project_id": project_id,
            "file_name": file.filename,
            "document_type": "source",
            "storage_path": path,
            "mime_type": file.content_type,
            "file_size": file_size,
            "processing_status": "PROCESSING",
        }
        document = await self.document_repo.create(doc_data)
        
        # We'll return the document info so the API can respond quickly.
        # The background parsing is delegated.
        return {
            "id": document.id,
            "file_name": document.file_name,
            "status": document.processing_status,
            "message": "Document uploaded successfully and is being processed."
        }

    async def parse_document_background(self, document_id: uuid.UUID, file_bytes: bytes, mime_type: str, filename: str):
        """
        Runs the parsing pipeline. Called by FastAPI BackgroundTasks.
        """
        logger.info(f"Starting background parsing for document {document_id}")
        try:
            parsed_doc = ParserFactory.parse(file_bytes, mime_type, filename)
            
            # Save chunks
            chunks_data = []
            chunk_index = 0
            for page in parsed_doc.pages:
                chunks_data.append({
                    "document_id": document_id,
                    "page_number": page.page_number,
                    "chunk_index": chunk_index,
                    "chunk_text": page.text,
                    "token_count": len(page.text.split()), # Rough estimation
                })
                chunk_index += 1
                
            await self.chunk_repo.create_many(chunks_data)
            
            # Update Document status
            await self.document_repo.update_status(document_id, "COMPLETED")
            await self.session.commit()
            logger.info(f"Parsing completed for document {document_id}")
            
        except Exception as e:
            logger.error(f"Parsing failed for document {document_id}: {str(e)}")
            await self.document_repo.update_status(document_id, "FAILED")
            await self.session.commit()
