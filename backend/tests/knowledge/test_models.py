import uuid
from app.knowledge.models import Requirement, Supplier, Quote, ProcurementProject, Evidence

def test_evidence_creation():
    ev = Evidence(document_id=uuid.uuid4(), text="Some text", page=1)
    assert ev.id is not None
    assert ev.text == "Some text"
    assert ev.page == 1

def test_requirement_creation():
    req = Requirement(name="MOQ", operator=">=", expected_value="1000", mandatory=True)
    assert req.id is not None
    assert req.name == "MOQ"
    assert req.mandatory is True

def test_supplier_creation():
    sup = Supplier(name="Supplier A", country="USA")
    assert sup.id is not None
    assert sup.name == "Supplier A"
    assert sup.quotes == []

def test_procurement_project_creation():
    proj = ProcurementProject(title="Project Alpha")
    assert proj.id is not None
    assert proj.title == "Project Alpha"
    assert proj.metadata.version == "1.0"
