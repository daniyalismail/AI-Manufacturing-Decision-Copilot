from typing import TypedDict, Optional, List, Dict, Any
import uuid
from app.parser.models import ParsedDocument
from app.agents.models import DocumentClassification
from app.knowledge.models import ProcurementProject

class GraphState(TypedDict):
    """
    Represents the shared state of the LangGraph workflow.
    """
    project_id: uuid.UUID
    file_bytes: bytes
    mime_type: str
    filename: str
    
    # State populated by nodes
    parsed_document: Optional[ParsedDocument]
    classification: Optional[DocumentClassification]
    
    # Extracted entity data (raw JSON dicts ready for KnowledgeBuilder)
    extracted_data: Dict[str, Any]
    
    # Final Output
    procurement_project: Optional[ProcurementProject]
    decision_result: Optional[Any] # Will hold DecisionResult
    validation_report: Optional[Dict[str, Any]]
    
    # RAG
    chunks: Optional[List[Any]]
    retrieved_evidence: Optional[List[Any]]
    
    # Explanations
    explanation: Optional[str]
    
    # Errors
    errors: List[str]
