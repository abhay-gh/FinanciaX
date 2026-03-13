from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.budget_service import BudgetService
from app.schemas.budget import BudgetCreate, BudgetUpdate
from app.models.user import User

router = APIRouter(prefix="/budgets", tags=["budgets"])


def _svc(db: Session = Depends(get_db)) -> BudgetService:
    return BudgetService(db)


@router.get("/")
def list_budgets(
    year: int = Query(...), month: int | None = None,
    current_user: User = Depends(get_current_user),
    svc: BudgetService = Depends(_svc),
):
    return svc.list_by_user(current_user.id, year, month)


@router.post("/", status_code=201)
def create_budget(data: BudgetCreate, current_user: User = Depends(get_current_user), svc: BudgetService = Depends(_svc)):
    return svc.create(current_user.id, data)


@router.patch("/{budget_id}")
def update_budget(budget_id: int, data: BudgetUpdate, current_user: User = Depends(get_current_user), svc: BudgetService = Depends(_svc)):
    b = svc.get(budget_id, current_user.id)
    if not b:
        raise HTTPException(404, "Budget not found")
    return svc.update(b, data)


@router.delete("/{budget_id}", status_code=204)
def delete_budget(budget_id: int, current_user: User = Depends(get_current_user), svc: BudgetService = Depends(_svc)):
    b = svc.get(budget_id, current_user.id)
    if not b:
        raise HTTPException(404, "Budget not found")
    svc.delete(b)
