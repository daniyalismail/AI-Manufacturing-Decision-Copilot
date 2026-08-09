import pytest
import uuid
from app.knowledge.models import ProcurementProject, Supplier, Requirement, Relationship
from app.knowledge.validator import KnowledgeValidator
from app.exceptions.errors import KnowledgeError

def test_validator_duplicate_supplier():
    project = ProcurementProject(title="Test")
    project.suppliers.append(Supplier(name="Acme"))
    project.suppliers.append(Supplier(name="acme"))
    
    with pytest.raises(KnowledgeError, match="Duplicate supplier detected"):
        KnowledgeValidator.validate(project)

def test_validator_duplicate_requirement():
    project = ProcurementProject(title="Test")
    project.requirements.append(Requirement(name="MOQ"))
    project.requirements.append(Requirement(name="moq"))
    
    with pytest.raises(KnowledgeError, match="Duplicate requirement detected"):
        KnowledgeValidator.validate(project)

def test_validator_broken_relationship_reference():
    project = ProcurementProject(title="Test")
    project.suppliers.append(Supplier(id=uuid.uuid4(), name="Acme"))
    
    # Missing requirement ID in relationship
    rel = Relationship(supplier_id=project.suppliers[0].id, requirement_id=uuid.uuid4(), status="PASS")
    project.relationships.append(rel)
    
    with pytest.raises(KnowledgeError, match="Relationship references missing requirement"):
        KnowledgeValidator.validate(project)
