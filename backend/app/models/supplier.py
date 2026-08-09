import uuid
from sqlalchemy import String, Float, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    supplier_name: Mapped[str] = mapped_column(String(255))
    country: Mapped[str | None] = mapped_column(String(100))
    website: Mapped[str | None] = mapped_column(String(255))
    currency: Mapped[str | None] = mapped_column(String(10))
    overall_score: Mapped[float | None] = mapped_column(Float)
    recommendation_rank: Mapped[int | None] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(50), default="Pending")

    # Relationships
    project = relationship("Project", back_populates="suppliers")
    quotes = relationship("SupplierQuote", back_populates="supplier", cascade="all, delete-orphan")
    certifications = relationship("SupplierCertification", back_populates="supplier", cascade="all, delete-orphan")
    capabilities = relationship("SupplierCapability", back_populates="supplier", cascade="all, delete-orphan")
    scores = relationship("SupplierScore", back_populates="supplier", cascade="all, delete-orphan")
    validations = relationship("ConstraintValidation", back_populates="supplier", cascade="all, delete-orphan")
