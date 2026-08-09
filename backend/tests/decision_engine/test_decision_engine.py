import pytest
import uuid
from app.knowledge.models import ProcurementProject, Supplier, Requirement, Quote, Certification
from app.decision_engine.engine import DecisionEngine
from app.decision_engine.models import QualificationStatus, ConstraintStatus

def create_mock_project():
    project = ProcurementProject(title="Aluminum Pipes")
    
    # Requirements
    req1 = Requirement(id=uuid.uuid4(), name="Material", expected_value="Aluminum", mandatory=True)
    req2 = Requirement(id=uuid.uuid4(), name="MOQ", expected_value="1000", mandatory=True)
    req3 = Requirement(id=uuid.uuid4(), name="ISO9001", expected_value="ISO9001", mandatory=False)
    project.requirements = [req1, req2, req3]
    
    # Supplier 1: Perfect supplier
    s1 = Supplier(id=uuid.uuid4(), name="Acme Corp", country="USA")
    s1.quotes.append(Quote(unit_price=10.0, currency="USD", moq=500, lead_time=15))
    s1.certifications.append(Certification(name="ISO9001"))
    s1.capabilities.append(type('Capability', (object,), {"value": "Aluminum", "name": "Material"})())
    
    # Supplier 2: Failed mandatory MOQ
    s2 = Supplier(id=uuid.uuid4(), name="Globex", country="China")
    s2.quotes.append(Quote(unit_price=5.0, currency="USD", moq=5000, lead_time=30))
    s2.capabilities.append(type('Capability', (object,), {"value": "Aluminum", "name": "Material"})())
    
    # Supplier 3: Missing optional cert, but qualified
    s3 = Supplier(id=uuid.uuid4(), name="Initech", country="UK")
    s3.quotes.append(Quote(unit_price=12.0, currency="USD", moq=1000, lead_time=10))
    s3.capabilities.append(type('Capability', (object,), {"value": "Aluminum", "name": "Material"})())
    
    project.suppliers = [s1, s2, s3]
    return project, s1, s2, s3

def test_decision_engine_deterministic():
    project, s1, s2, s3 = create_mock_project()
    result = DecisionEngine.evaluate(project)
    
    # Supplier 2 should be REJECTED because MOQ is 5000 (req <= 1000)
    s2_rank = next(r for r in result.supplier_rankings if r.supplier_id == s2.id)
    assert s2_rank.qualification.status == QualificationStatus.REJECTED
    
    # Supplier 1 and 3 should be QUALIFIED
    s1_rank = next(r for r in result.supplier_rankings if r.supplier_id == s1.id)
    assert s1_rank.qualification.status == QualificationStatus.QUALIFIED
    
    s3_rank = next(r for r in result.supplier_rankings if r.supplier_id == s3.id)
    assert s3_rank.qualification.status == QualificationStatus.QUALIFIED
    
    # Top recommendation should be one of the qualified ones
    assert result.recommended_supplier_id in [s1.id, s3.id]
    
    # Cost engine check (s2 has min price 5.0, s3 has max 12.0)
    assert s3_rank.score.cost_score == 0.0 # max price
    assert s2_rank.score.cost_score == 100.0 # min price
    
def test_scenario_engine():
    from app.decision_engine.scenario_engine import ScenarioEngine
    project, s1, s2, s3 = create_mock_project()
    
    # Run with default weights
    res1 = DecisionEngine.evaluate(project)
    s1_rank1 = next(r for r in res1.supplier_rankings if r.supplier_id == s1.id)
    
    # Run with extreme cost weight
    custom_weights = {
        "cost": 1.0,
        "quality": 0.0,
        "lead_time": 0.0,
        "risk": 0.0,
        "sustainability": 0.0
    }
    res2 = ScenarioEngine.analyze(project, custom_weights)
    s1_rank2 = next(r for r in res2.supplier_rankings if r.supplier_id == s1.id)
    
    # The overall scores should change based on weights
    assert s1_rank1.score.overall_score != s1_rank2.score.overall_score
