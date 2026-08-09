import asyncio
import os
import sys
import uuid

sys.path.append("/media/daniyalismail19/backup1/softica-hackathon/backend")

from app.database.session import AsyncSessionLocal
from app.rag.vector_store import VectorStore
from app.rag.models import Chunk, ChunkMetadata

async def test_upsert():
    async with AsyncSessionLocal() as session:
        store = VectorStore(session)
        meta = ChunkMetadata(
            project_id=uuid.uuid4(),
            document_id=uuid.uuid4(),
            document_name="test.pdf",
            chunk_index=0
        )
        chunk = Chunk(text="test text", metadata=meta, embedding=[0.0]*1536) # fake embedding
        
        try:
            await store.upsert_chunks([chunk])
            print("Upsert successful")
        except Exception as e:
            print(f"Upsert failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_upsert())
