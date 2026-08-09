import uuid
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text, cast
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from pgvector.sqlalchemy import Vector
from app.rag.models import Chunk, ChunkMetadata, RetrievedEvidence

Base = declarative_base()

class VectorDocument(Base):
    __tablename__ = "vector_documents"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    text: Mapped[str] = mapped_column(nullable=False)
    embedding: Mapped[List[float]] = mapped_column(Vector(768)) # gemini-embedding-2 dimension is 768
    metadata_: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, name="metadata")
    
class VectorStore:
    """
    Handles upserting and retrieving chunks using SQLAlchemy and pgvector.
    """
    def __init__(self, session: AsyncSession):
        self.session = session
        
    async def upsert_chunks(self, chunks: List[Chunk]):
        for chunk in chunks:
            if not chunk.embedding:
                continue
                
            doc = VectorDocument(
                id=chunk.id,
                text=chunk.text,
                embedding=chunk.embedding,
                metadata_=chunk.metadata.model_dump(mode="json")
            )
            self.session.add(doc)
            
        await self.session.commit()
        
    async def search(
        self, 
        query_embedding: List[float], 
        top_k: int = 8, 
        filters: Optional[Dict[str, Any]] = None
    ) -> List[RetrievedEvidence]:
        """
        Hybrid search using pgvector cosine distance `<=>` and JSONB filtering.
        """
        stmt = select(VectorDocument)
        
        # Metadata Filtering
        if filters:
            for k, v in filters.items():
                stmt = stmt.where(VectorDocument.metadata_[k].astext == str(v))
                
        # Vector Similarity
        # We order by cosine distance
        distance_col = VectorDocument.embedding.cosine_distance(query_embedding).label('distance')
        stmt = stmt.add_columns(distance_col).order_by(distance_col).limit(top_k)
        
        results = await self.session.execute(stmt)
        
        evidences = []
        for row in results:
            doc = row[0]
            distance = row[1]
            similarity = 1.0 - distance # Convert distance to similarity
            
            meta = ChunkMetadata(**doc.metadata_)
            chunk = Chunk(id=doc.id, text=doc.text, metadata=meta, embedding=None)
            
            evidences.append(RetrievedEvidence(
                chunk=chunk,
                similarity=similarity
            ))
            
        return evidences
