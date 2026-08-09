from typing import List, Dict
import uuid
from app.knowledge.models import Supplier

class RiskEngine:
    """
    Calculates risk score based on missing data and geographic footprint.
    Lower risk = Higher Score.
    """
    @staticmethod
    def score(suppliers: List[Supplier]) -> Dict[uuid.UUID, float]:
        scores: Dict[uuid.UUID, float] = {}
        
        for s in suppliers:
            # Base perfect score, deduct for risk
            score = 100.0
            
            if not s.country:
                score -= 20.0
                
            if not s.certifications:
                score -= 30.0
                
            if not s.quotes:
                score -= 50.0
            elif not s.quotes[0].payment_terms:
                score -= 10.0
                
            scores[s.id] = max(round(score, 2), 0.0)
            
        return scores
