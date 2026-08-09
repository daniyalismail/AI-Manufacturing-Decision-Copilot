import uuid
from app.knowledge.builder import KnowledgeBuilder
from app.knowledge.models import ProcurementProject, Supplier, Requirement

def test_build_from_extraction():
    project_id = uuid.uuid4()
    
    extraction_data = {
        "evidence": [{"ref_id": "ev1", "document_id": str(uuid.uuid4()), "text": "Evidence text"}],
        "requirements": [{"name": "MOQ", "evidence_refs": ["ev1"]}],
        "suppliers": [{"name": "Supplier A", "quotes": [{"unit_price": 10.5, "currency": "USD"}]}],
        "relationships": [{"supplier_id": str(uuid.uuid4()), "requirement_id": str(uuid.uuid4()), "status": "PASS", "evidence_refs": ["ev1"]}]
    }
    
    project = KnowledgeBuilder.build_from_extraction(project_id, "Test Proj", extraction_data)
    
    assert project.id == project_id
    assert project.title == "Test Proj"
    assert len(project.evidence) == 1
    assert project.evidence[0].text == "Evidence text"
    
    assert len(project.requirements) == 1
    assert project.requirements[0].name == "MOQ"
    # Ensure evidence was linked
    assert project.requirements[0].evidence_ids[0] == project.evidence[0].id
    
    assert len(project.suppliers) == 1
    assert project.suppliers[0].name == "Supplier A"
    assert len(project.suppliers[0].quotes) == 1
    assert project.suppliers[0].quotes[0].unit_price == 10.5

def test_add_supplier_deduplication():
    project = ProcurementProject(title="Test")
    sup1 = Supplier(name="Acme Corp")
    sup2 = Supplier(name="acme corp") # Duplicate case-insensitive
    
    KnowledgeBuilder.add_supplier(project, sup1)
    KnowledgeBuilder.add_supplier(project, sup2)
    
    assert len(project.suppliers) == 1
