import asyncio
import os
import sys

sys.path.append("/media/daniyalismail19/backup1/softica-hackathon/backend")
from app.rag.embeddings import EmbeddingGenerator

async def test_embed():
    gen = EmbeddingGenerator()
    res = await gen.generate(["Hello world"])
    print(f"Embedding length: {len(res[0]) if res else 0}")
    print(f"Embeddings: {res}")

if __name__ == "__main__":
    asyncio.run(test_embed())
