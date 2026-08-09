import uuid
from sqlalchemy import String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base

class SupplierCapability(Base):
    __tablename__ = "supplier_capabilities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    supplier_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("suppliers.id", ondelete="CASCADE"), index=True)
    capability: Mapped[str] = mapped_column(String(255))
    value: Mapped[str] = mapped_column(String(255))
    confidence: Mapped[float | None] = mapped_column(Float)
    source_chunk_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("document_chunks.id", ondelete="SET NULL"))

    # Relationships
    supplier = relationship("Supplier", back_populates="capabilities")
