from typing import Dict
from app.knowledge.models import ProcurementProject
from app.decision_engine.models import ScenarioResult
from app.decision_engine.engine import DecisionEngine

class ScenarioEngine:
    """
    Recalculates decisions based on custom weights without re-running parsing/AI.
    """
    @staticmethod
    def analyze(project: ProcurementProject, new_weights: Dict[str, float]) -> ScenarioResult:
        # We can just re-run the deterministic evaluation pipeline
        # Since it's fast (target <500ms), we just re-evaluate.
        decision = DecisionEngine.evaluate(project, custom_weights=new_weights)
        return ScenarioResult(
            project_id=project.id,
            supplier_rankings=decision.supplier_rankings
        )
