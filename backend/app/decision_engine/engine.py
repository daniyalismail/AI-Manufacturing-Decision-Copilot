from typing import Dict
from app.knowledge.models import ProcurementProject
from app.decision_engine.models import DecisionResult, ScenarioResult
from app.decision_engine.config import DEFAULT_WEIGHTS
from app.decision_engine.constraint_validator import ConstraintValidator
from app.decision_engine.qualification_engine import QualificationEngine
from app.decision_engine.cost_engine import CostEngine
from app.decision_engine.lead_time_engine import LeadTimeEngine
from app.decision_engine.quality_engine import QualityEngine
from app.decision_engine.risk_engine import RiskEngine
from app.decision_engine.sustainability_engine import SustainabilityEngine
from app.decision_engine.score_engine import ScoreEngine
from app.decision_engine.ranking_engine import RankingEngine
from app.decision_engine.recommendation_engine import RecommendationEngine
from app.decision_engine.confidence_engine import ConfidenceEngine
from app.decision_engine.evidence_binder import EvidenceBinder

class DecisionEngine:
    """
    Master facade for the deterministic decision pipeline.
    """
    @staticmethod
    def evaluate(project: ProcurementProject, custom_weights: Dict[str, float] = None) -> DecisionResult:
        weights = custom_weights or DEFAULT_WEIGHTS
        
        # 1. Validate Constraints
        validations = ConstraintValidator.validate(project)
        mandatory_reqs = {r.id for r in project.requirements if r.mandatory}
        
        # 2. Qualification
        supplier_ids = [s.id for s in project.suppliers]
        qualifications = QualificationEngine.evaluate(validations, mandatory_reqs, supplier_ids)
        
        # 3. Category Scoring
        cost_scores = CostEngine.score(project.suppliers)
        quality_scores = QualityEngine.score(project.suppliers)
        lead_time_scores = LeadTimeEngine.score(project.suppliers)
        risk_scores = RiskEngine.score(project.suppliers)
        sustainability_scores = SustainabilityEngine.score(project.suppliers)
        
        # 4. Overall Scoring
        score_breakdowns = ScoreEngine.calculate_overall(
            supplier_ids, cost_scores, quality_scores, lead_time_scores, risk_scores, sustainability_scores, weights
        )
        
        # 5. Ranking
        rankings = RankingEngine.rank(score_breakdowns, qualifications, validations)
        
        # 6. Recommendation
        rec_id, rec_explanation = RecommendationEngine.recommend(rankings)
        
        # 7. Confidence & Evidence
        confidence = ConfidenceEngine.calculate(rankings, validations)
        evidence_map = EvidenceBinder.bind(project)
        
        return DecisionResult(
            project_id=project.id,
            recommended_supplier_id=rec_id,
            supplier_rankings=rankings,
            confidence=confidence,
            recommendation_summary=rec_explanation,
            evidence_map=evidence_map
        )
