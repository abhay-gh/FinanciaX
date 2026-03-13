from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models.budget import Budget
from app.models.transaction import Transaction, TransactionType
from app.models.account import Account
from app.schemas.budget import BudgetCreate, BudgetUpdate


class BudgetService:
    def __init__(self, db: Session):
        self.db = db

    def list_by_user(self, user_id: int, year: int, month: int | None = None) -> list[dict]:
        stmt = select(Budget).where(
            Budget.user_id == user_id,
            Budget.year == year,
            Budget.is_active == True,
        )
        if month:
            stmt = stmt.where(Budget.month == month)
        budgets = list(self.db.scalars(stmt))
        result = []
        for b in budgets:
            spent = self._spent(b, user_id)
            d = {
                "id": b.id, "name": b.name, "amount": float(b.amount),
                "period": b.period, "year": b.year, "month": b.month,
                "category_id": b.category_id, "is_active": b.is_active,
                "user_id": b.user_id, "spent": float(spent),
                "created_at": b.created_at, "updated_at": b.updated_at,
            }
            result.append(d)
        return result

    def _spent(self, budget: Budget, user_id: int) -> Decimal:
        stmt = (
            select(func.coalesce(func.sum(Transaction.amount), 0))
            .join(Account)
            .where(
                Account.user_id == user_id,
                Transaction.category_id == budget.category_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
                func.extract("year", Transaction.transaction_date) == budget.year,
            )
        )
        if budget.month:
            stmt = stmt.where(func.extract("month", Transaction.transaction_date) == budget.month)
        return self.db.scalar(stmt) or Decimal("0")

    def get(self, budget_id: int, user_id: int) -> Budget | None:
        return self.db.scalar(
            select(Budget).where(Budget.id == budget_id, Budget.user_id == user_id)
        )

    def create(self, user_id: int, data: BudgetCreate) -> Budget:
        budget = Budget(user_id=user_id, **data.model_dump())
        self.db.add(budget)
        self.db.commit()
        self.db.refresh(budget)
        return budget

    def update(self, budget: Budget, data: BudgetUpdate) -> Budget:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(budget, field, value)
        self.db.commit()
        self.db.refresh(budget)
        return budget

    def delete(self, budget: Budget) -> None:
        self.db.delete(budget)
        self.db.commit()
