import asyncio
from app.rag.embeddings import EmbeddingGenerator

async def main():
    print("Testing text-embedding-004 ...")
    embedder = EmbeddingGenerator(model_name="text-embedding-004")
    try:
        res = await embedder.generate(["Test sentence"])
        print("Success! Dimensions:", len(res[0]))
    except Exception as e:
        print("Failed!", str(e))

asyncio.run(main())
