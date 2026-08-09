from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime, timezone

class Evidence(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    document_id: uuid.UUID
    page: Optional[int] = None
    chunk: Optional[int] = None
    text: str
    confidence: Optional[float] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class Requirement(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: str
    operator: Optional[str] = None
    expected_value: Optional[str] = None
    unit: Optional[str] = None
    mandatory: bool = False
    priority: Optional[str] = None
    category: Optional[str] = None
    confidence: Optional[float] = None
    evidence_ids: List[uuid.UUID] = Field(default_factory=list)

class Quote(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    unit_price: float
    currency: str
    moq: Optional[int] = None
    lead_time: Optional[int] = None
    payment_terms: Optional[str] = None
    incoterms: Optional[str] = None
    tooling: Optional[float] = None
    shipping: Optional[float] = None
    evidence_ids: List[uuid.UUID] = Field(default_factory=list)

class Certification(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: str
    number: Optional[str] = None
    expiry: Optional[datetime] = None
    issuer: Optional[str] = None
    verified: bool = False
    confidence: Optional[float] = None
    evidence_ids: List[uuid.UUID] = Field(default_factory=list)

class Capability(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: str
    value: str
    unit: Optional[str] = None
    confidence: Optional[float] = None
    evidence_ids: List[uuid.UUID] = Field(default_factory=list)

class SupplierScore(BaseModel):
    cost: Optional[float] = None
    quality: Optional[float] = None
    risk: Optional[float] = None
    lead_time: Optional[float] = None
    sustainability: Optional[float] = None
    overall: Optional[float] = None
    confidence: Optional[float] = None

class Supplier(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    name: str
    country: Optional[str] = None
    currency: Optional[str] = None
    quotes: List[Quote] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)
    capabilities: List[Capability] = Field(default_factory=list)
    scores: Optional[SupplierScore] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    evidence_ids: List[uuid.UUID] = Field(default_factory=list)

class Relationship(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    supplier_id: uuid.UUID
    requirement_id: uuid.UUID
    status: str
    reason: Optional[str] = None
    evidence_ids: List[uuid.UUID] = Field(default_factory=list)
    confidence: Optional[float] = None

class Recommendation(BaseModel):
    supplier_id: uuid.UUID
    rank: int
    summary: str
    confidence: Optional[float] = None
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)

class ProjectMetadata(BaseModel):
    version: str = "1.0"
    model: str = "PKM"
    extraction_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    additional_data: Dict[str, Any] = Field(default_factory=dict)

class ProcurementProject(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    title: str
    documents: List[dict] = Field(default_factory=list) # Raw document refs if needed, or simplified model
    requirements: List[Requirement] = Field(default_factory=list)
    suppliers: List[Supplier] = Field(default_factory=list)
    relationships: List[Relationship] = Field(default_factory=list)
    evidence: List[Evidence] = Field(default_factory=list)
    recommendations: List[Recommendation] = Field(default_factory=list)
    metadata: ProjectMetadata = Field(default_factory=ProjectMetadata)
