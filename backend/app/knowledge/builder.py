from typing import Dict, Any, List
import uuid
from app.knowledge.models import (
    ProcurementProject, Supplier, Requirement, Evidence, Quote,
    Certification, Capability, SupplierScore, Relationship, Recommendation, ProjectMetadata
)

class KnowledgeBuilder:
    """
    Constructs the Procurement Knowledge Model from raw extraction JSON dictionaries.
    Responsible for normalization, deduplication, and linking evidence.
    """
    
    @staticmethod
    def build_from_extraction(project_id: uuid.UUID, title: str, extraction_data: Dict[str, Any]) -> ProcurementProject:
        project = ProcurementProject(id=project_id, title=title)
        
        # Build evidence first so we can link it
        evidence_map: Dict[str, uuid.UUID] = {}
        raw_evidence = extraction_data.get("evidence", [])
        for ev_data in raw_evidence:
            evidence = Evidence(**ev_data)
            project.evidence.append(evidence)
            # Assuming raw data provides some sort of local ref id to map back
            if "ref_id" in ev_data:
                evidence_map[ev_data["ref_id"]] = evidence.id

        # Build requirements
        raw_requirements = extraction_data.get("requirements", [])
        for req_data in raw_requirements:
            evidence_refs = req_data.pop("evidence_refs", [])
            req = Requirement(**req_data)
            req.evidence_ids = [evidence_map[ref] for ref in evidence_refs if ref in evidence_map]
            project.requirements.append(req)

        # Build suppliers
        raw_suppliers = extraction_data.get("suppliers", [])
        for supp_data in raw_suppliers:
            quotes_data = supp_data.pop("quotes", [])
            certs_data = supp_data.pop("certifications", [])
            caps_data = supp_data.pop("capabilities", [])
            scores_data = supp_data.pop("scores", None)
            
            supplier = Supplier(**supp_data)
            
            for q in quotes_data:
                supplier.quotes.append(Quote(**q))
            for c in certs_data:
                supplier.certifications.append(Certification(**c))
            for c in caps_data:
                supplier.capabilities.append(Capability(**c))
                
            if scores_data:
                supplier.scores = SupplierScore(**scores_data)
                
            project.suppliers.append(supplier)

        # Build relationships
        raw_relationships = extraction_data.get("relationships", [])
        for rel_data in raw_relationships:
            evidence_refs = rel_data.pop("evidence_refs", [])
            rel = Relationship(**rel_data)
            rel.evidence_ids = [evidence_map[ref] for ref in evidence_refs if ref in evidence_map]
            project.relationships.append(rel)

        # Build recommendations if any exist yet
        raw_recs = extraction_data.get("recommendations", [])
        for rec_data in raw_recs:
            project.recommendations.append(Recommendation(**rec_data))

        return project

    @staticmethod
    def add_supplier(project: ProcurementProject, supplier: Supplier) -> ProcurementProject:
        """Add a supplier avoiding duplicates by name."""
        if not any(s.name.lower() == supplier.name.lower() for s in project.suppliers):
            project.suppliers.append(supplier)
        return project

    @staticmethod
    def add_requirement(project: ProcurementProject, requirement: Requirement) -> ProcurementProject:
        """Add a requirement avoiding duplicates by name."""
        if not any(r.name.lower() == requirement.name.lower() for r in project.requirements):
            project.requirements.append(requirement)
        return project
