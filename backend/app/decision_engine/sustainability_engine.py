from typing import List, Dict
import uuid
from app.knowledge.models import Supplier

class SustainabilityEngine:
    """
    Calculates sustainability score based on ESG, Green manufacturing, etc.
    """
    @staticmethod
    def score(suppliers: List[Supplier]) -> Dict[uuid.UUID, float]:
        scores: Dict[uuid.UUID, float] = {}
        
        for s in suppliers:
            score = 0.0
            certs = [c.name.lower() for c in s.certifications]
            
            if "iso14001" in certs or "iso 14001" in certs:
                score += 40.0
            if "rohs" in certs:
                score += 30.0
            if "reach" in certs:
                score += 30.0
                
            scores[s.id] = min(round(score, 2), 100.0)
            
        return scores
