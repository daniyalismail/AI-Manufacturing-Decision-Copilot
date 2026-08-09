from typing import List, Dict
import uuid
from app.knowledge.models import Supplier

class QualityEngine:
    """
    Calculates quality score based on certifications and capabilities.
    """
    @staticmethod
    def score(suppliers: List[Supplier]) -> Dict[uuid.UUID, float]:
        scores: Dict[uuid.UUID, float] = {}
        
        for s in suppliers:
            score = 0.0
            # Base points for having ISO certifications
            if any("iso" in c.name.lower() for c in s.certifications):
                score += 50.0
            else:
                score += len(s.certifications) * 10.0 # 10 pts per cert
                
            # Points for capabilities
            score += min(len(s.capabilities) * 5.0, 50.0) # max 50 pts for capabilities
            
            scores[s.id] = min(round(score, 2), 100.0)
            
        return scores
