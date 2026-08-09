from typing import List, Dict
import uuid
from app.decision_engine.models import RankingResult, ScoreBreakdown, QualificationResult, ValidationResult, ConstraintStatus

class RankingEngine:
    """
    Sorts suppliers based on overall score DESC, using defined tie-breakers.
    Tie breakers:
    1. Constraint Pass Count
    2. Quality Score
    3. Risk Score
    4. Lead Time Score
    5. Cost Score
    """
    @staticmethod
    def rank(
        scores: Dict[uuid.UUID, ScoreBreakdown],
        qualifications: Dict[uuid.UUID, QualificationResult],
        validations: List[ValidationResult]
    ) -> List[RankingResult]:
        
        # Precompute constraint pass counts
        pass_counts = {}
        for v in validations:
            if v.status == ConstraintStatus.PASS:
                pass_counts[v.supplier_id] = pass_counts.get(v.supplier_id, 0) + 1
                
        unsorted_results = []
        for sid, score in scores.items():
            unsorted_results.append({
                "supplier_id": sid,
                "overall": score.overall_score,
                "pass_count": pass_counts.get(sid, 0),
                "quality": score.quality_score,
                "risk": score.risk_score,
                "lead_time": score.lead_time_score,
                "cost": score.cost_score,
                "score_obj": score,
                "qual_obj": qualifications[sid],
                "validations": [v for v in validations if v.supplier_id == sid]
            })
            
        # Sort using tuple unpacking for tie-breakers
        sorted_results = sorted(
            unsorted_results,
            key=lambda x: (
                x["overall"],
                x["pass_count"],
                x["quality"],
                x["risk"],
                x["lead_time"],
                x["cost"]
            ),
            reverse=True
        )
        
        rankings = []
        for i, res in enumerate(sorted_results):
            rankings.append(RankingResult(
                supplier_id=res["supplier_id"],
                rank=i + 1,
                score=res["score_obj"],
                qualification=res["qual_obj"],
                validations=res["validations"]
            ))
            
        return rankings
