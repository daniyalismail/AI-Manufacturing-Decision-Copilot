from typing import List, Dict
import uuid
from app.knowledge.models import Supplier

class CostEngine:
    """
    Calculates normalized cost score. (Lower cost = Higher Score)
    """
    @staticmethod
    def score(suppliers: List[Supplier]) -> Dict[uuid.UUID, float]:
        scores: Dict[uuid.UUID, float] = {}
        costs = {}
        for s in suppliers:
            # Simplistic: grab first quote unit price
            if s.quotes and s.quotes[0].unit_price is not None:
                costs[s.id] = s.quotes[0].unit_price
                
        if not costs:
            return {s.id: 0.0 for s in suppliers}
            
        max_price = max(costs.values())
        min_price = min(costs.values())
        
        for s in suppliers:
            if s.id not in costs:
                scores[s.id] = 0.0
                continue
            
            price = costs[s.id]
            if max_price == min_price:
                scores[s.id] = 100.0
            else:
                score = ((max_price - price) / (max_price - min_price)) * 100.0
                scores[s.id] = round(score, 2)
                
        return scores
