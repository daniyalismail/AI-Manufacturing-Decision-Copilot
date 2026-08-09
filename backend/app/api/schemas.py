from typing import Generic, TypeVar, Optional, Any, Dict, List
from pydantic import BaseModel, Field

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: str = "Operation completed."

class APIErrorDetail(BaseModel):
    code: str
    message: str

class APIErrorResponse(BaseModel):
    success: bool = False
    error: APIErrorDetail

# Some common request/response schemas
class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    target_budget: Optional[float] = None

class ScenarioRequest(BaseModel):
    weights: Dict[str, float]

class ChatRequest(BaseModel):
    project_id: str
    message: str
    history: Optional[List[Dict[str, str]]] = None

class CompareRequest(BaseModel):
    supplier_ids: List[str]
