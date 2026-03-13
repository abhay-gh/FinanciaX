from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate


class AccountService:
    def __init__(self, db: Session):
        self.db = db

    def list_by_user(self, user_id: int) -> list[Account]:
        return list(self.db.scalars(select(Account).where(Account.user_id == user_id)))

    def get(self, account_id: int, user_id: int) -> Account | None:
        return self.db.scalar(
            select(Account).where(Account.id == account_id, Account.user_id == user_id)
        )

    def create(self, user_id: int, data: AccountCreate) -> Account:
        account = Account(user_id=user_id, **data.model_dump())
        self.db.add(account)
        self.db.commit()
        self.db.refresh(account)
        return account

    def update(self, account: Account, data: AccountUpdate) -> Account:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(account, field, value)
        self.db.commit()
        self.db.refresh(account)
        return account

    def delete(self, account: Account) -> None:
        self.db.delete(account)
        self.db.commit()

    def net_worth(self, user_id: int) -> dict:
        accounts = self.list_by_user(user_id)
        total_assets = sum(a.balance for a in accounts if a.account_type.value in ("checking", "savings", "investment", "cash"))
        total_liabilities = sum(a.balance for a in accounts if a.account_type.value == "credit")
        return {
            "total_assets": float(total_assets),
            "total_liabilities": float(total_liabilities),
            "net_worth": float(total_assets - total_liabilities),
        }
