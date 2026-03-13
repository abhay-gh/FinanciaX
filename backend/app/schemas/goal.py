from decimal import Decimal
from datetime import date, datetime
from pydantic import BaseModel, ConfigDict
from app.models.goal import GoalStatus


class GoalBase(BaseModel):
    name: str
    description: str | None = None
    target_amount: Decimal
    target_date: date | None = None
    icon: str | None = None


class GoalCreate(GoalBase):
    current_amount: Decimal = Decimal("0.00")


class GoalUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    target_amount: Decimal | None = None
    current_amount: Decimal | None = None
    target_date: date | None = None
    status: GoalStatus | None = None
    icon: str | None = None


class GoalOut(GoalBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    current_amount: Decimal
    status: GoalStatus
    progress_pct: float = 0.0  # computed
    created_at: datetime
    updated_at: datetime
