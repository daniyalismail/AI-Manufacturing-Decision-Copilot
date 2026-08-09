import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from app.models.document import Document

class DocumentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, doc_data: dict) -> Document:
        doc = Document(**doc_data)
        self.session.add(doc)
        await self.session.flush()
        await self.session.refresh(doc)
        return doc

    async def update_status(self, document_id: uuid.UUID, status: str) -> Document:
        stmt = update(Document).where(Document.id == document_id).values(processing_status=status).returning(Document)
        result = await self.session.execute(stmt)
        doc = result.scalar_one_or_none()
        await self.session.flush()
        return doc

    async def get_by_id(self, document_id: uuid.UUID) -> Optional[Document]:
        stmt = select(Document).where(Document.id == document_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
