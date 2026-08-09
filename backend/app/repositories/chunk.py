import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.chunk import DocumentChunk

class DocumentChunkRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_many(self, chunks_data: List[dict]) -> List[DocumentChunk]:
        chunks = [DocumentChunk(**data) for data in chunks_data]
        self.session.add_all(chunks)
        await self.session.flush()
        return chunks
