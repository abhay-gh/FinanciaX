from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.account import AccountType


class AccountBase(BaseModel):
    name: str
    institution: str | None = None
    account_type: AccountType
    currency: str = "USD"
    mask: str | None = None


class AccountCreate(AccountBase):
    balance: Decimal = Decimal("0.00")


class AccountUpdate(BaseModel):
    name: str | None = None
    institution: str | None = None
    balance: Decimal | None = None
    is_active: bool | None = None


class AccountOut(AccountBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    balance: Decimal
    is_active: bool
    created_at: datetime
    updated_at: datetime
