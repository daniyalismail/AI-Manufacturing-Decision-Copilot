import asyncio
from app.rag.embeddings import EmbeddingGenerator

async def main():
    print("Testing Gemini embedding model...")
    embedder = EmbeddingGenerator()
    try:
        res = await embedder.generate(["Test sentence"])
        print("Success! Dimensions:", len(res[0]))
    except Exception as e:
        print("Failed!", str(e))

asyncio.run(main())
