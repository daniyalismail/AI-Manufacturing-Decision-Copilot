from fastapi import APIRouter, Depends, HTTPException
from app.api.schemas import APIResponse, ChatRequest
from app.api.deps import get_current_user, CurrentUser

from app.rag.embeddings import EmbeddingGenerator
from app.database.session import AsyncSessionLocal
from app.rag.vector_store import VectorStore
from app.rag.retriever import RAGRetriever, ContextBuilder
from app.agents.explainers import ChatAgent
import traceback

router = APIRouter()

@router.post("", response_model=APIResponse[dict])
async def post_chat(request: ChatRequest, current_user: CurrentUser = Depends(get_current_user)):
    """Procurement Q&A chat endpoint using RAG."""
    
    try:
        async with AsyncSessionLocal() as session:
            store = VectorStore(session)
            generator = EmbeddingGenerator()
            retriever = RAGRetriever(store, generator)
            
            filters = {"project_id": request.project_id}
            
            # Retrieve Evidence
            evidence = await retriever.retrieve(query=request.message, top_k=5, filters=filters)
            print(f"DEBUG RAG: Found {len(evidence)} chunks for query '{request.message}'")
            
            # Build Context
            context_text = ContextBuilder.build(evidence)
            print(f"DEBUG RAG: Context string length: {len(context_text)}")
            
            # Append history if available
            history_text = ""
            if request.history:
                history_text = "Chat History:\n"
                for h in request.history[-5:]: # Last 5 messages
                    history_text += f"{h['role']}: {h['text']}\n"
                context_text = history_text + "\n" + context_text
            
            # Run Chat Agent
            agent = ChatAgent()
            chat_response = await agent.run(question=request.message, retrieved_context=context_text)
            print(f"DEBUG RAG: LLM Response:\n{chat_response.model_dump_json(indent=2)}")
            
            # Format Citations for frontend
            citations = []
            for i, ref in enumerate(chat_response.sources):
                matching_ev = None
                for ev in evidence:
                    if ev.chunk.metadata.document_name == ref.document and (ref.page is None or ev.chunk.metadata.page == ref.page):
                        matching_ev = ev
                        break
                
                if matching_ev:
                    meta = matching_ev.chunk.metadata
                    citations.append({
                        "id": f"src-{i}",
                        "supplierId": "chat",
                        "supplierName": meta.supplier or "RAG Engine",
                        "docName": meta.document_name,
                        "pageNumber": meta.page or 1,
                        "sectionTitle": meta.section or "Context",
                        "extractedText": matching_ev.chunk.text,
                        "confidenceScore": round(matching_ev.similarity * 100, 1),
                        "evidenceType": "Technical"
                    })
                else:
                    citations.append({
                        "id": f"src-{i}",
                        "supplierId": "chat",
                        "supplierName": "RAG Engine",
                        "docName": ref.document,
                        "pageNumber": ref.page or 1,
                        "sectionTitle": "Context",
                        "extractedText": ref.reason or "Information extracted from document.",
                        "confidenceScore": 95.0,
                        "evidenceType": "Technical"
                    })
                
            return APIResponse(data={
                "answer": chat_response.answer,
                "sources": citations,
                "suggestedQuestions": chat_response.suggested_questions
            })
            
    except Exception as e:
        print(f"Chat error: {traceback.format_exc()}")
        return APIResponse(data={
            "answer": "I'm sorry, I encountered an error connecting to the intelligence engine.",
            "sources": []
        })

@router.get("/{session_id}", response_model=APIResponse[dict])
async def get_chat_history(session_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Retrieve chat history."""
    return APIResponse(data={"history": []})
