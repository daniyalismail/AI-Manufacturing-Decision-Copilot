import os
import uuid
import structlog
from supabase import create_client, Client
from app.config.settings import settings
from app.api.exceptions import APIException

logger = structlog.get_logger()

class StorageError(APIException):
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(code="STORAGE_ERROR", message=message, status_code=status_code)

class SupabaseStorage:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_SERVICE_KEY
        self.bucket = settings.SUPABASE_STORAGE_BUCKET
        self.client: Client = create_client(self.url, self.key)

    def upload_file(self, project_id: uuid.UUID, file_name: str, file_bytes: bytes, content_type: str) -> str:
        """
        Uploads a file to Supabase storage.
        Returns the storage path: {project_id}/{file_name}
        """
        path = f"{project_id}/{file_name}"
        try:
            # Upsert ensures we overwrite if it exists
            res = self.client.storage.from_(self.bucket).upload(
                path=path,
                file=file_bytes,
                file_options={"content-type": content_type, "upsert": "true"}
            )
            return path
        except Exception as e:
            raise StorageError(f"Failed to upload file to Supabase: {str(e)}")

    def get_public_url(self, path: str) -> str:
        """Returns the public URL for the file"""
        try:
            res = self.client.storage.from_(self.bucket).get_public_url(path)
            return res
        except Exception as e:
            raise StorageError(f"Failed to get public URL: {str(e)}")
