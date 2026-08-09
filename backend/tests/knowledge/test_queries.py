import uuid
from app.knowledge.models import ProcurementProject, Supplier, Requirement, Relationship
from app.knowledge.queries import KnowledgeQuery

def test_get_supplier_by_id():
    project = ProcurementProject(title="Test")
    sup_id = uuid.uuid4()
    project.suppliers.append(Supplier(id=sup_id, name="Supplier X"))
    
    assert KnowledgeQuery.get_supplier_by_id(project, sup_id) is not None
    assert KnowledgeQuery.get_supplier_by_id(project, uuid.uuid4()) is None

def test_get_failed_constraints():
    project = ProcurementProject(title="Test")
    sup_id = uuid.uuid4()
    req_id = uuid.uuid4()
    
    project.suppliers.append(Supplier(id=sup_id, name="Test Supp"))
    project.requirements.append(Requirement(id=req_id, name="MOQ"))
    
    project.relationships.append(Relationship(supplier_id=sup_id, requirement_id=req_id, status="FAIL"))
    project.relationships.append(Relationship(supplier_id=sup_id, requirement_id=uuid.uuid4(), status="PASS"))
    
    failed = KnowledgeQuery.get_failed_constraints_for_supplier(project, sup_id)
    assert len(failed) == 1
    assert failed[0].requirement_id == req_id
