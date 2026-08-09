from app.knowledge.models import ProcurementProject
from app.exceptions.errors import KnowledgeError

class KnowledgeValidator:
    """
    Executes pre-scoring integrity checks on the PKM.
    Ensures that all references are valid and there are no duplicates.
    """
    
    @staticmethod
    def validate(project: ProcurementProject) -> None:
        KnowledgeValidator._check_duplicate_suppliers(project)
        KnowledgeValidator._check_duplicate_requirements(project)
        KnowledgeValidator._check_broken_references(project)

    @staticmethod
    def _check_duplicate_suppliers(project: ProcurementProject) -> None:
        seen = set()
        for supplier in project.suppliers:
            name_lower = supplier.name.lower()
            if name_lower in seen:
                raise KnowledgeError(f"Duplicate supplier detected: {supplier.name}")
            seen.add(name_lower)

    @staticmethod
    def _check_duplicate_requirements(project: ProcurementProject) -> None:
        seen = set()
        for req in project.requirements:
            name_lower = req.name.lower()
            if name_lower in seen:
                raise KnowledgeError(f"Duplicate requirement detected: {req.name}")
            seen.add(name_lower)

    @staticmethod
    def _check_broken_references(project: ProcurementProject) -> None:
        evidence_ids = {ev.id for ev in project.evidence}
        supplier_ids = {sup.id for sup in project.suppliers}
        requirement_ids = {req.id for req in project.requirements}

        for rel in project.relationships:
            if rel.supplier_id not in supplier_ids:
                raise KnowledgeError(f"Relationship references missing supplier: {rel.supplier_id}")
            if rel.requirement_id not in requirement_ids:
                raise KnowledgeError(f"Relationship references missing requirement: {rel.requirement_id}")
            for ev_id in rel.evidence_ids:
                if ev_id not in evidence_ids:
                    raise KnowledgeError(f"Relationship references missing evidence: {ev_id}")

        for req in project.requirements:
            for ev_id in req.evidence_ids:
                if ev_id not in evidence_ids:
                    raise KnowledgeError(f"Requirement references missing evidence: {ev_id}")
