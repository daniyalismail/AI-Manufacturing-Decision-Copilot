from typing import List, Tuple, Optional
import uuid
from app.decision_engine.models import RankingResult, QualificationStatus, RecommendationExplanation

class RecommendationEngine:
    """
    Selects the best qualified supplier from the rankings.
    """
    @staticmethod
    def recommend(rankings: List[RankingResult]) -> Tuple[Optional[uuid.UUID], Optional[RecommendationExplanation]]:
        for rank in rankings:
            if rank.qualification.status == QualificationStatus.QUALIFIED:
                
                # Basic string generation without LLM
                strengths = []
                if rank.score.cost_score > 80:
                    strengths.append("Highly competitive cost")
                if rank.score.lead_time_score > 80:
                    strengths.append("Excellent lead time")
                if rank.score.quality_score > 80:
                    strengths.append("Strong quality indicators")
                    
                weaknesses = []
                if rank.score.risk_score < 50:
                    weaknesses.append("High risk profile")
                if rank.score.sustainability_score < 50:
                    weaknesses.append("Poor sustainability metrics")
                    
                summary = "Recommended based on highest overall score among qualified suppliers."
                
                explanation = RecommendationExplanation(
                    supplier_id=rank.supplier_id,
                    summary=summary,
                    strengths=strengths,
                    weaknesses=weaknesses
                )
                
                return rank.supplier_id, explanation
                
        return None, None
