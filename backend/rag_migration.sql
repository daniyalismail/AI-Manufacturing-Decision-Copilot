-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Drop the old table if it exists to fix dimensions
DROP TABLE IF EXISTS public.vector_documents;

-- 3. Create the vector_documents table
CREATE TABLE public.vector_documents (
    id UUID PRIMARY KEY,
    text TEXT NOT NULL,
    embedding VECTOR(3072), -- Dimension for gemini-embedding-2
    metadata JSONB NOT NULL
);

-- 4. Optional: Create an index for faster similarity search
CREATE INDEX IF NOT EXISTS vector_documents_embedding_idx 
ON public.vector_documents USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);
