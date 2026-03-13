from decimal import Decimal
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict
from app.models.transaction import TransactionType


class TransactionBase(BaseModel):
    amount: Decimal
    transaction_type: TransactionType
    description: str
    notes: str | None = None
    transaction_date: date
    merchant: str | None = None
    is_recurring: bool = False


class TransactionCreate(TransactionBase):
    account_id: int
    category_id: int | None = None


class TransactionUpdate(BaseModel):
    category_id: int | None = None
    description: str | None = None
    notes: str | None = None
    merchant: str | None = None
    is_recurring: bool | None = None
    amount: Decimal | None = None


class TransactionOut(TransactionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    account_id: int
    category_id: int | None
    ai_category_suggestion: str | None
    created_at: datetime
    updated_at: datetime
