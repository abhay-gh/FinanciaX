from decimal import Decimal
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_
from app.models.transaction import Transaction, TransactionType
from app.models.account import Account
from app.schemas.transaction import TransactionCreate, TransactionUpdate


class TransactionService:
    def __init__(self, db: Session):
        self.db = db

    def list_by_user(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 50,
        account_id: int | None = None,
        category_id: int | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
        transaction_type: TransactionType | None = None,
    ) -> list[Transaction]:
        stmt = (
            select(Transaction)
            .join(Account)
            .where(Account.user_id == user_id)
            .order_by(Transaction.transaction_date.desc())
        )
        if account_id:
            stmt = stmt.where(Transaction.account_id == account_id)
        if category_id:
            stmt = stmt.where(Transaction.category_id == category_id)
        if start_date:
            stmt = stmt.where(Transaction.transaction_date >= start_date)
        if end_date:
            stmt = stmt.where(Transaction.transaction_date <= end_date)
        if transaction_type:
            stmt = stmt.where(Transaction.transaction_type == transaction_type)
        return list(self.db.scalars(stmt.offset(skip).limit(limit)))

    def get(self, tx_id: int, user_id: int) -> Transaction | None:
        return self.db.scalar(
            select(Transaction)
            .join(Account)
            .where(Transaction.id == tx_id, Account.user_id == user_id)
        )

    def create(self, data: TransactionCreate, ai_suggestion: str | None = None) -> Transaction:
        tx = Transaction(**data.model_dump(), ai_category_suggestion=ai_suggestion)
        self.db.add(tx)
        # update account balance
        account = self.db.get(Account, data.account_id)
        if account:
            if data.transaction_type == TransactionType.INCOME:
                account.balance += data.amount
            elif data.transaction_type == TransactionType.EXPENSE:
                account.balance -= data.amount
        self.db.commit()
        self.db.refresh(tx)
        return tx

    def update(self, tx: Transaction, data: TransactionUpdate) -> Transaction:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(tx, field, value)
        self.db.commit()
        self.db.refresh(tx)
        return tx

    def delete(self, tx: Transaction) -> None:
        # reverse balance impact
        account = self.db.get(Account, tx.account_id)
        if account:
            if tx.transaction_type == TransactionType.INCOME:
                account.balance -= tx.amount
            elif tx.transaction_type == TransactionType.EXPENSE:
                account.balance += tx.amount
        self.db.delete(tx)
        self.db.commit()

    def monthly_summary(self, user_id: int, year: int, month: int) -> dict:
        base = (
            select(
                Transaction.transaction_type,
                func.sum(Transaction.amount).label("total"),
            )
            .join(Account)
            .where(
                Account.user_id == user_id,
                func.extract("year", Transaction.transaction_date) == year,
                func.extract("month", Transaction.transaction_date) == month,
            )
            .group_by(Transaction.transaction_type)
        )
        rows = self.db.execute(base).all()
        result = {"income": 0.0, "expense": 0.0, "transfer": 0.0}
        for row in rows:
            result[row.transaction_type.value] = float(row.total)
        result["savings"] = result["income"] - result["expense"]
        return result

    def spending_by_category(self, user_id: int, year: int, month: int) -> list[dict]:
        from app.models.category import Category
        stmt = (
            select(Category.name, Category.color, func.sum(Transaction.amount).label("total"))
            .join(Transaction, Transaction.category_id == Category.id)
            .join(Account, Account.id == Transaction.account_id)
            .where(
                Account.user_id == user_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
                func.extract("year", Transaction.transaction_date) == year,
                func.extract("month", Transaction.transaction_date) == month,
            )
            .group_by(Category.id, Category.name, Category.color)
            .order_by(func.sum(Transaction.amount).desc())
        )
        rows = self.db.execute(stmt).all()
        return [{"category": r.name, "color": r.color, "total": float(r.total)} for r in rows]
