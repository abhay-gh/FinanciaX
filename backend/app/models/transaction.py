from decimal import Decimal
from datetime import date
from sqlalchemy import String, Numeric, ForeignKey, Date, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from .base import Base, TimestampMixin


class TransactionType(str, enum.Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"


class Transaction(Base, TimestampMixin):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"), nullable=False)
    category_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id"), nullable=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    transaction_type: Mapped[TransactionType] = mapped_column(Enum(TransactionType, values_callable=lambda x: [e.value for e in x]), nullable=False)
    description: Mapped[str] = mapped_column(String(512), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    transaction_date: Mapped[date] = mapped_column(Date, nullable=False)
    merchant: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_recurring: Mapped[bool] = mapped_column(default=False)
    ai_category_suggestion: Mapped[str | None] = mapped_column(String(100), nullable=True)

    account = relationship("Account", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
