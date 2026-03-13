from decimal import Decimal
from sqlalchemy import String, Numeric, ForeignKey, Enum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from .base import Base, TimestampMixin


class BudgetPeriod(str, enum.Enum):
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"


class Budget(Base, TimestampMixin):
    __tablename__ = "budgets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    period: Mapped[BudgetPeriod] = mapped_column(Enum(BudgetPeriod, values_callable=lambda x: [e.value for e in x]), default=BudgetPeriod.MONTHLY)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    month: Mapped[int | None] = mapped_column(Integer, nullable=True)  # null for yearly
    is_active: Mapped[bool] = mapped_column(default=True)

    user = relationship("User", back_populates="budgets")
    category = relationship("Category", back_populates="budgets")
