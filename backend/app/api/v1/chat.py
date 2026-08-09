from fastapi import APIRouter, Depends
from app.api.schemas import APIResponse, ChatRequest
from app.api.deps import get_current_user, CurrentUser

router = APIRouter()

@router.post("", response_model=APIResponse[dict])
async def post_chat(request: ChatRequest, current_user: CurrentUser = Depends(get_current_user)):
    """Procurement Q&A chat endpoint."""
    
    # Very simple mock response logic based on keywords
    msg = request.message.lower()
    answer = "I'm your Procurement Copilot. I can answer questions about the suppliers, cost breakdowns, and extraction logic."
    sources = []

    if "why" in msg or "recommend" in msg:
        answer = "I recommended ABC Industries because their overall Match Score is 94. They meet the ISO 9001 constraint and have a guaranteed lead time of 3 weeks, which aligns perfectly with your critical path."
        sources = [{"title": "Supplier_A_SpecSheet.pdf", "page": 3}, {"title": "Contract_Terms_ABC.pdf", "page": 1}]
    elif "cost" in msg or "price" in msg:
        answer = "The estimated cost for ABC Industries is $125,000, which is slightly higher than Global Tech Machining ($118,000), but ABC provides a faster lead time and higher compliance score."
        sources = [{"title": "Pricing_Matrix.xlsx", "page": 1}]

    return APIResponse(data={
        "answer": answer,
        "sources": sources
    })

@router.get("/{session_id}", response_model=APIResponse[dict])
async def get_chat_history(session_id: str, current_user: CurrentUser = Depends(get_current_user)):
    """Retrieve chat history."""
    return APIResponse(data={"history": []})
