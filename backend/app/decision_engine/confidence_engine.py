from typing import List, Dict
import uuid
from app.decision_engine.models import RankingResult, ValidationResult

class ConfidenceEngine:
    """
    Calculates deterministic confidence based on data completeness and constraints.
    """
    @staticmethod
    def calculate(rankings: List[RankingResult], validations: List[ValidationResult]) -> float:
        if not rankings:
            return 0.0
            
        top_supplier = rankings[0]
        
        # 30% Evidence (Assume all present for MVP deterministic)
        evidence_score = 30.0
        
        # 30% Completeness
        completeness = 30.0
        if top_supplier.score.risk_score < 50:
            completeness -= 15.0 # penalty for missing data which lowers risk score
            
        # 20% Validation
        validation = 20.0
        unknowns = sum(1 for v in top_supplier.validations if v.status == "UNKNOWN")
        if unknowns > 0:
            validation -= min(unknowns * 5.0, 20.0)
            
        # 20% Consistency
        consistency = 20.0
        
        confidence = evidence_score + completeness + validation + consistency
        return round(confidence, 2)
