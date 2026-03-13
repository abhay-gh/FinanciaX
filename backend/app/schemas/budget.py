from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.budget import BudgetPeriod


class BudgetBase(BaseModel):
    name: str
    amount: Decimal
    period: BudgetPeriod = BudgetPeriod.MONTHLY
    year: int
    month: int | None = None


class BudgetCreate(BudgetBase):
    category_id: int


class BudgetUpdate(BaseModel):
    name: str | None = None
    amount: Decimal | None = None
    is_active: bool | None = None


class BudgetOut(BudgetBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    category_id: int
    is_active: bool
    spent: Decimal = Decimal("0.00")  # computed
    created_at: datetime
    updated_at: datetime
