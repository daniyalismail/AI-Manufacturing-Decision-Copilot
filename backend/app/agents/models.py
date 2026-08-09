from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class EvidenceRef(BaseModel):
    document: str = Field(description="Name of the document")
    page: Optional[int] = Field(None, description="Page number")
    section: Optional[str] = Field(None, description="Section heading")
    chunk: Optional[int] = Field(None, description="Chunk index")
    reason: Optional[str] = Field(None, description="Reason this evidence supports the claim")

class DocumentClassification(BaseModel):
    document_type: str = Field(description="The type of procurement document (e.g., Requirement Document, Supplier Quote, etc.)")
    confidence: float = Field(description="Confidence score between 0.0 and 1.0")
    reason: str = Field(description="Reason for this classification")

class RequirementItem(BaseModel):
    name: str = Field(description="Name of the requirement (e.g., Material, MOQ)")
    value: str = Field(description="Value of the requirement")
    mandatory: bool = Field(description="Whether this requirement is mandatory")
    confidence: float = Field(description="Confidence score")
    evidence: Optional[EvidenceRef] = None

class RequirementCollection(BaseModel):
    requirements: List[RequirementItem] = Field(default_factory=list)

class SupplierModel(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    currency: Optional[str] = None
    lead_time_days: Optional[int] = None
    minimum_order_quantity: Optional[int] = None
    payment_terms: Optional[str] = None
    incoterms: Optional[str] = None
    website: Optional[str] = None
    confidence: float

class CertificationItem(BaseModel):
    name: str = Field(description="Name of the certification (e.g., ISO 9001, RoHS, etc.)")
    number: Optional[str] = Field(None, description="Certification number if available")
    expiry: Optional[str] = Field(None, description="Expiry date if available")
    confidence: float = Field(description="Confidence score")

class CertificationCollection(BaseModel):
    certifications: List[CertificationItem] = Field(default_factory=list)

class CommercialTerms(BaseModel):
    currency: Optional[str] = None
    unit_price: Optional[float] = None
    moq: Optional[int] = None
    freight: Optional[str] = None
    tooling: Optional[str] = None
    packaging: Optional[str] = None
    incoterms: Optional[str] = None
    payment_terms: Optional[str] = None

class ChunkMetadata(BaseModel):
    supplier: Optional[str] = None
    document_type: Optional[str] = None
    section: Optional[str] = None
    keywords: List[str] = Field(default_factory=list)

class EvidenceCollection(BaseModel):
    evidence: List[EvidenceRef] = Field(default_factory=list)

class RecommendationSummary(BaseModel):
    summary: str
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    recommendation: str
    confidence: float

class ChatResponse(BaseModel):
    answer: str
    sources: List[EvidenceRef] = Field(default_factory=list)

class ScenarioChange(BaseModel):
    change: str

class ScenarioExplanation(BaseModel):
    summary: str
    changes: List[ScenarioChange] = Field(default_factory=list)

class ReportSummary(BaseModel):
    project_summary: str
    recommended_supplier: str
    strengths: List[str]
    risks: List[str]
    constraints: List[str]
    evidence: List[str]
    conclusion: str

class RiskSummary(BaseModel):
    commercial: List[str]
    operational: List[str]
    compliance: List[str]
    data_quality: List[str]
    unknowns: List[str]
