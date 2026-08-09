from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import uuid

class ChunkMetadata(BaseModel):
    project_id: uuid.UUID
    document_id: uuid.UUID
    document_name: str
    document_type: Optional[str] = None
    page: Optional[int] = None
    section: Optional[str] = None
    supplier: Optional[str] = None
    chunk_index: int

class Chunk(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    text: str
    metadata: ChunkMetadata
    embedding: Optional[List[float]] = None

class RetrievedEvidence(BaseModel):
    chunk: Chunk
    similarity: float
    relevance_score: Optional[float] = None
