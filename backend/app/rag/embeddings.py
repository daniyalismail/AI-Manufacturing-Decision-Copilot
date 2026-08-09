from typing import List
from app.agents.client import get_ai_client

# We use the raw AsyncOpenAI client for embeddings, not the patched Instructor one.
# But ai_client is just the patched one, which still has .embeddings available.
ai_client = get_ai_client()

class EmbeddingGenerator:
    """
    Generates vector embeddings using OpenAI.
    """
    def __init__(self, model_name: str = "text-embedding-3-large"):
        self.model_name = model_name

    async def generate(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
            
        # Call OpenAI embedding API
        response = await ai_client.embeddings.create(
            input=texts,
            model=self.model_name
        )
        
        # Extract embeddings
        embeddings = [data.embedding for data in response.data]
        return embeddings
