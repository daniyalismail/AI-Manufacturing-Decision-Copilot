from typing import List
from app.agents.client import get_ai_client

# We use the raw AsyncOpenAI client for embeddings, not the patched Instructor one.
# But ai_client is just the patched one, which still has .embeddings available.
ai_client = get_ai_client()

class EmbeddingGenerator:
    """
    Generates vector embeddings using OpenAI.
    """
    def __init__(self, model_name: str = "gemini-embedding-2"):
        self.model_name = model_name

    async def generate(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
            
        # Call OpenAI embedding API
        # We enforce dimensions=768 because our pgvector column is vector(768)
        response = await ai_client.embeddings.create(
            input=texts,
            model=self.model_name,
            dimensions=768
        )
        
        # Extract embeddings and ensure they are 768 dimensions for pgvector
        embeddings = []
        for data in response.data:
            emb = data.embedding
            if len(emb) > 768:
                emb = emb[:768] # Matryoshka truncation
            elif len(emb) < 768:
                # Pad with zeros (shouldn't happen but just in case)
                emb = emb + [0.0] * (768 - len(emb))
            embeddings.append(emb)
            
        return embeddings
