import pytest
import uuid
from fastapi import UploadFile
from unittest.mock import AsyncMock, MagicMock, patch
import io
from app.services.upload import UploadService, UploadError

@pytest.fixture
def mock_session():
    return AsyncMock()

@pytest.fixture
def upload_service(mock_session):
    with patch('app.services.upload.SupabaseStorage'):
        return UploadService(mock_session)

@pytest.mark.asyncio
async def test_upload_service_invalid_type(upload_service):
    mock_file = MagicMock(spec=UploadFile)
    mock_file.content_type = "application/json"
    
    with pytest.raises(UploadError, match="Unsupported file type"):
        await upload_service.process_upload(uuid.uuid4(), mock_file)

@pytest.mark.asyncio
async def test_upload_service_file_too_large(upload_service):
    mock_file = AsyncMock(spec=UploadFile)
    mock_file.content_type = "application/pdf"
    mock_file.read.return_value = b"0" * (26 * 1024 * 1024) # 26MB
    
    with pytest.raises(UploadError, match="File exceeds maximum allowed size"):
        await upload_service.process_upload(uuid.uuid4(), mock_file)

@pytest.mark.asyncio
async def test_upload_service_success(upload_service):
    mock_file = AsyncMock(spec=UploadFile)
    mock_file.content_type = "application/pdf"
    mock_file.filename = "test.pdf"
    mock_file.read.return_value = b"dummy pdf content"
    
    upload_service.storage.upload_file.return_value = "mock_path"
    
    mock_document = MagicMock()
    mock_document.id = uuid.uuid4()
    mock_document.file_name = "test.pdf"
    mock_document.processing_status = "PROCESSING"
    
    upload_service.document_repo.create = AsyncMock(return_value=mock_document)
    
    result = await upload_service.process_upload(uuid.uuid4(), mock_file)
    
    assert result["file_name"] == "test.pdf"
    assert result["status"] == "PROCESSING"
    assert "id" in result
