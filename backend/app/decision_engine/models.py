from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid
from enum import Enum
from app.knowledge.models import Requirement, Supplier, Evidence

class ConstraintStatus(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    WARNING = "WARNING"
    UNKNOWN = "UNKNOWN"

class QualificationStatus(str, Enum):
    QUALIFIED = "QUALIFIED"
    CONDITIONALLY_QUALIFIED = "CONDITIONALLY_QUALIFIED"
    REJECTED = "REJECTED"

class ValidationResult(BaseModel):
    supplier_id: uuid.UUID
    requirement_id: uuid.UUID
    status: ConstraintStatus
    expected: Optional[str] = None
    actual: Optional[str] = None
    reason: str
    evidence_ids: List[uuid.UUID] = []

class QualificationResult(BaseModel):
    supplier_id: uuid.UUID
    status: QualificationStatus
    reason: str

class ScoreBreakdown(BaseModel):
    supplier_id: uuid.UUID
    cost_score: float = 0.0
    quality_score: float = 0.0
    lead_time_score: float = 0.0
    risk_score: float = 0.0
    sustainability_score: float = 0.0
    overall_score: float = 0.0

class RankingResult(BaseModel):
    supplier_id: uuid.UUID
    rank: int
    score: ScoreBreakdown
    qualification: QualificationResult
    validations: List[ValidationResult]

class RecommendationExplanation(BaseModel):
    supplier_id: uuid.UUID
    summary: str
    strengths: List[str]
    weaknesses: List[str]

class DecisionResult(BaseModel):
    project_id: uuid.UUID
    recommended_supplier_id: Optional[uuid.UUID] = None
    supplier_rankings: List[RankingResult] = []
    confidence: float = 0.0
    recommendation_summary: Optional[RecommendationExplanation] = None
    evidence_map: Dict[uuid.UUID, Evidence] = {}
    
class ScenarioResult(BaseModel):
    project_id: uuid.UUID
    supplier_rankings: List[RankingResult]
