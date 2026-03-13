from decimal import Decimal
from datetime import date
from sqlalchemy import String, Numeric, ForeignKey, Date, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from .base import Base, TimestampMixin


class GoalStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"


class Goal(Base, TimestampMixin):
    __tablename__ = "goals"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    target_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    current_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), default=Decimal("0.00"))
    target_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[GoalStatus] = mapped_column(Enum(GoalStatus, values_callable=lambda x: [e.value for e in x]), default=GoalStatus.ACTIVE)
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)

    user = relationship("User", back_populates="goals")
