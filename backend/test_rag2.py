import asyncio
from app.rag.embeddings import EmbeddingGenerator

async def main():
    print("Testing gemini-embedding-2 ...")
    embedder = EmbeddingGenerator(model_name="gemini-embedding-2")
    try:
        res = await embedder.generate(["Test sentence"])
        print("Success! Dimensions:", len(res[0]))
    except Exception as e:
        print("Failed!", str(e))

asyncio.run(main())
