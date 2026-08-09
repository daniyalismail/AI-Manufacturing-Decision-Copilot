import tiktoken
import uuid
from typing import List, Optional
from app.rag.models import Chunk, ChunkMetadata
from app.parser.models import ParsedDocument

class SemanticChunker:
    """
    Chunks a parsed document using tiktoken to enforce token limits.
    Target: 400-700 tokens, Overlap: 100 tokens.
    """
    def __init__(self, target_tokens: int = 500, overlap_tokens: int = 100, model: str = "text-embedding-3-large"):
        self.target_tokens = target_tokens
        self.overlap_tokens = overlap_tokens
        self.encoding = tiktoken.encoding_for_model(model)

    def _split_text(self, text: str) -> List[str]:
        tokens = self.encoding.encode(text)
        chunks = []
        start = 0
        while start < len(tokens):
            end = min(start + self.target_tokens, len(tokens))
            
            # Find a good boundary (newline or period) if possible within the last 50 tokens
            # For simplicity, we just chunk by tokens and decode
            chunk_tokens = tokens[start:end]
            chunk_text = self.encoding.decode(chunk_tokens)
            chunks.append(chunk_text)
            
            if end == len(tokens):
                break
                
            start += self.target_tokens - self.overlap_tokens
            
        return chunks

    def chunk_document(
        self, 
        project_id: uuid.UUID, 
        document_id: uuid.UUID, 
        doc_name: str, 
        doc_type: Optional[str],
        supplier: Optional[str],
        parsed_doc: ParsedDocument
    ) -> List[Chunk]:
        
        all_chunks = []
        chunk_idx = 0
        
        # We chunk per page to retain page metadata accurately
        for page in parsed_doc.pages:
            text_splits = self._split_text(page.text)
            
            for split_text in text_splits:
                if not split_text.strip():
                    continue
                    
                meta = ChunkMetadata(
                    project_id=project_id,
                    document_id=document_id,
                    document_name=doc_name,
                    document_type=doc_type,
                    page=page.page_number,
                    section=None, # In a more complex parser, we'd pass sections
                    supplier=supplier,
                    chunk_index=chunk_idx
                )
                
                chunk = Chunk(text=split_text, metadata=meta)
                all_chunks.append(chunk)
                chunk_idx += 1
                
        return all_chunks
