from datetime import datetime
import uuid
from sqlalchemy import String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base

class SupplierCertification(Base):
    __tablename__ = "supplier_certifications"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    supplier_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("suppliers.id", ondelete="CASCADE"), index=True)
    certification_name: Mapped[str] = mapped_column(String(255))
    certification_number: Mapped[str | None] = mapped_column(String(100))
    valid_until: Mapped[datetime | None] = mapped_column(DateTime)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    source_chunk_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("document_chunks.id", ondelete="SET NULL"))

    # Relationships
    supplier = relationship("Supplier", back_populates="certifications")
