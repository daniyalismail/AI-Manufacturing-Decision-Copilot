from typing import List, Optional
import uuid
from app.knowledge.models import ProcurementProject, Supplier, Requirement, Relationship

class KnowledgeQuery:
    """
    Query helpers for the Decision Engine to traverse the PKM without SQL.
    """
    
    @staticmethod
    def get_supplier_by_id(project: ProcurementProject, supplier_id: uuid.UUID) -> Optional[Supplier]:
        return next((s for s in project.suppliers if s.id == supplier_id), None)

    @staticmethod
    def get_requirement_by_id(project: ProcurementProject, req_id: uuid.UUID) -> Optional[Requirement]:
        return next((r for r in project.requirements if r.id == req_id), None)

    @staticmethod
    def get_relationships_for_supplier(project: ProcurementProject, supplier_id: uuid.UUID) -> List[Relationship]:
        return [r for r in project.relationships if r.supplier_id == supplier_id]

    @staticmethod
    def get_failed_constraints_for_supplier(project: ProcurementProject, supplier_id: uuid.UUID) -> List[Relationship]:
        rels = KnowledgeQuery.get_relationships_for_supplier(project, supplier_id)
        return [r for r in rels if r.status.upper() == "FAIL"]
    
    @staticmethod
    def get_passed_constraints_for_supplier(project: ProcurementProject, supplier_id: uuid.UUID) -> List[Relationship]:
        rels = KnowledgeQuery.get_relationships_for_supplier(project, supplier_id)
        return [r for r in rels if r.status.upper() == "PASS"]
