from datetime import datetime
import uuid
from sqlalchemy import String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base

class SupplierQuote(Base):
    __tablename__ = "supplier_quotes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    supplier_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("suppliers.id", ondelete="CASCADE"), index=True)
    currency: Mapped[str] = mapped_column(String(10))
    unit_price: Mapped[float] = mapped_column(Float)
    minimum_order_quantity: Mapped[int | None] = mapped_column(Integer)
    lead_time_days: Mapped[int | None] = mapped_column(Integer)
    payment_terms: Mapped[str | None] = mapped_column(String(255))
    incoterms: Mapped[str | None] = mapped_column(String(50))
    tooling_cost: Mapped[float | None] = mapped_column(Float)
    shipping_cost: Mapped[float | None] = mapped_column(Float)
    quote_date: Mapped[datetime | None] = mapped_column(DateTime)
    source_chunk_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("document_chunks.id", ondelete="SET NULL"))

    # Relationships
    supplier = relationship("Supplier", back_populates="quotes")
