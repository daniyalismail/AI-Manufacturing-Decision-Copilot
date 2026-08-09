from typing import List, Dict, Any, Optional
from app.rag.models import RetrievedEvidence
from app.rag.embeddings import EmbeddingGenerator
from app.rag.vector_store import VectorStore

class ContextBuilder:
    """
    Formats RetrievedEvidence into structured context for LLMs with citations.
    """
    @staticmethod
    def build(evidences: List[RetrievedEvidence]) -> str:
        if not evidences:
            return "No relevant evidence found."
            
        parts = []
        for i, ev in enumerate(evidences):
            meta = ev.chunk.metadata
            
            # Build Citation
            citation = f"Source {i+1}: {meta.document_name}"
            if meta.page is not None:
                citation += f" Page {meta.page}"
            if meta.section:
                citation += f" Section {meta.section}"
                
            context_block = f"--- {citation} ---\n{ev.chunk.text}\n"
            parts.append(context_block)
            
        return "\n".join(parts)


class RAGRetriever:
    """
    High-level orchestrator for embedding queries, searching, filtering, and re-ranking.
    """
    def __init__(self, vector_store: VectorStore, embedding_generator: EmbeddingGenerator):
        self.vector_store = vector_store
        self.embedding_generator = embedding_generator
        
    async def retrieve(self, query: str, top_k: int = 8, filters: Optional[Dict[str, Any]] = None) -> List[RetrievedEvidence]:
        # Generate Embedding
        embeddings = await self.embedding_generator.generate([query])
        if not embeddings:
            return []
            
        query_embedding = embeddings[0]
        
        # We fetch more than top_k to allow re-ranking (e.g. 1.5x)
        fetch_k = int(top_k * 1.5)
        
        # Search pgvector
        results = await self.vector_store.search(
            query_embedding=query_embedding,
            top_k=fetch_k,
            filters=filters
        )
        
        # Simple Re-Ranking (for MVP we just ensure we didn't fetch junk, keep top_k)
        # Advanced: Cross-Encoder model.
        # Here we just deduplicate and enforce a similarity threshold (e.g., >0.5)
        reranked = []
        seen_texts = set()
        
        for res in results:
            if res.similarity > 0.0 and res.chunk.text not in seen_texts:
                reranked.append(res)
                seen_texts.add(res.chunk.text)
                
            if len(reranked) >= top_k:
                break
                
        return reranked
