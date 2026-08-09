from typing import Dict
import uuid
from app.decision_engine.models import ScoreBreakdown

class ScoreEngine:
    """
    Combines individual scores using configurable weights.
    """
    @staticmethod
    def calculate_overall(
        supplier_ids: list[uuid.UUID],
        cost_scores: Dict[uuid.UUID, float],
        quality_scores: Dict[uuid.UUID, float],
        lead_time_scores: Dict[uuid.UUID, float],
        risk_scores: Dict[uuid.UUID, float],
        sustainability_scores: Dict[uuid.UUID, float],
        weights: Dict[str, float]
    ) -> Dict[uuid.UUID, ScoreBreakdown]:
        
        breakdowns: Dict[uuid.UUID, ScoreBreakdown] = {}
        
        for sid in supplier_ids:
            c = cost_scores.get(sid, 0.0)
            q = quality_scores.get(sid, 0.0)
            l = lead_time_scores.get(sid, 0.0)
            r = risk_scores.get(sid, 0.0)
            s = sustainability_scores.get(sid, 0.0)
            
            overall = (
                c * weights["cost"] +
                q * weights["quality"] +
                l * weights["lead_time"] +
                r * weights["risk"] +
                s * weights["sustainability"]
            )
            
            breakdowns[sid] = ScoreBreakdown(
                supplier_id=sid,
                cost_score=c,
                quality_score=q,
                lead_time_score=l,
                risk_score=r,
                sustainability_score=s,
                overall_score=round(overall, 2)
            )
            
        return breakdowns
