from typing import List, Dict
import uuid
from app.knowledge.models import Supplier

class LeadTimeEngine:
    """
    Calculates normalized lead time score. (Lower lead time = Higher Score)
    """
    @staticmethod
    def score(suppliers: List[Supplier]) -> Dict[uuid.UUID, float]:
        scores: Dict[uuid.UUID, float] = {}
        times = {}
        for s in suppliers:
            if s.quotes and s.quotes[0].lead_time is not None:
                times[s.id] = s.quotes[0].lead_time
                
        if not times:
            return {s.id: 0.0 for s in suppliers}
            
        max_time = max(times.values())
        min_time = min(times.values())
        
        for s in suppliers:
            if s.id not in times:
                scores[s.id] = 0.0
                continue
            
            time = times[s.id]
            if max_time == min_time:
                scores[s.id] = 100.0
            else:
                score = ((max_time - time) / (max_time - min_time)) * 100.0
                scores[s.id] = round(score, 2)
                
        return scores
