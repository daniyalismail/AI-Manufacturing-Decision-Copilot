import asyncio
import os
import sys
import uuid

sys.path.append("/media/daniyalismail19/backup1/softica-hackathon/backend")

from app.database.session import AsyncSessionLocal
from app.rag.vector_store import VectorStore
from app.rag.models import Chunk, ChunkMetadata
from app.rag.embeddings import EmbeddingGenerator

async def test_real_upsert():
    async with AsyncSessionLocal() as session:
        store = VectorStore(session)
        gen = EmbeddingGenerator()
        
        meta = ChunkMetadata(
            project_id=uuid.uuid4(),
            document_id=uuid.uuid4(),
            document_name="test.pdf",
            chunk_index=0
        )
        
        # generate actual embedding
        emb = await gen.generate(["This is a test of real embeddings"])
        
        chunk = Chunk(text="This is a test of real embeddings", metadata=meta, embedding=emb[0])
        
        try:
            await store.upsert_chunks([chunk])
            print("Upsert successful")
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"Upsert failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_real_upsert())
