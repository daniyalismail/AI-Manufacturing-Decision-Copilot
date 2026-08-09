from langgraph.graph import StateGraph, END
from app.orchestration.state import GraphState
from app.orchestration.nodes import (
    parse_document_node,
    classify_document_node,
    extract_requirements_node,
    extract_supplier_node,
    combined_extraction_node,
    build_knowledge_node,
    validate_knowledge_node,
    decision_engine_node,
    rag_indexing_node,
    evidence_retrieval_node,
    explanation_node
)

def build_workflow() -> StateGraph:
    """
    Constructs the LangGraph orchestrator representing the master workflow.
    """
    workflow = StateGraph(GraphState)

    # Add Nodes
    workflow.add_node("parser", parse_document_node)
    workflow.add_node("classifier", classify_document_node)
    workflow.add_node("requirement_extractor", extract_requirements_node)
    workflow.add_node("supplier_extractor", extract_supplier_node)
    workflow.add_node("combined_extractor", combined_extraction_node)
    workflow.add_node("knowledge_builder", build_knowledge_node)
    workflow.add_node("knowledge_validator", validate_knowledge_node)
    workflow.add_node("decision_engine", decision_engine_node)
    workflow.add_node("rag_indexing", rag_indexing_node)
    workflow.add_node("evidence_retrieval", evidence_retrieval_node)
    workflow.add_node("explanation", explanation_node)

    # Set Entry Point
    workflow.set_entry_point("parser")

    # Linear flow to classifier
    workflow.add_edge("parser", "classifier")

    # Conditional Router based on classification
    def route_classification(state: GraphState) -> list[str] | str:
        if "errors" in state and state["errors"]:
            return "end" # Fast fail if errors exist
            
        classification = state.get("classification")
        if not classification:
            return "end"
            
        # For the hackathon E2E test, we combine all docs so we need both extractors
        if state.get("filename") == "aggregated_documents.txt":
            return "combined_extractor"
            
        doc_type = classification.document_type.lower()
        if "requirement" in doc_type or "bom" in doc_type:
            return "requirement_extractor"
        elif "supplier" in doc_type or "quote" in doc_type:
            return "supplier_extractor"
        else:
            return "knowledge_builder" # bypass extraction if unknown/unsupported for now

    workflow.add_conditional_edges(
        "classifier",
        route_classification,
        {
            "requirement_extractor": "requirement_extractor",
            "supplier_extractor": "supplier_extractor",
            "combined_extractor": "combined_extractor",
            "knowledge_builder": "knowledge_builder",
            "end": END
        }
    )

    # Both parallel extractors feed into the knowledge builder
    workflow.add_edge("requirement_extractor", "knowledge_builder")
    workflow.add_edge("supplier_extractor", "knowledge_builder")
    workflow.add_edge("combined_extractor", "knowledge_builder")
    
    # Linear flow from knowledge builder to explanation
    workflow.add_edge("knowledge_builder", "knowledge_validator")
    
    def route_validation(state: GraphState) -> str:
        if state.get("validation_report", {}).get("status") == "FAILED":
            return "end"
        if "errors" in state and state["errors"]:
            return "end"
        return "decision_engine"
        
    workflow.add_conditional_edges(
        "knowledge_validator",
        route_validation,
        {
            "decision_engine": "decision_engine",
            "end": END
        }
    )
    
    workflow.add_edge("decision_engine", "rag_indexing")
    workflow.add_edge("rag_indexing", "evidence_retrieval")
    workflow.add_edge("evidence_retrieval", "explanation")
    
    # End node
    workflow.add_edge("explanation", END)

    return workflow.compile()

# Global Compiled Workflow
orchestrator = build_workflow()
