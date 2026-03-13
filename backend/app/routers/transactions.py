from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.transaction_service import TransactionService
from app.schemas.transaction import TransactionCreate, TransactionUpdate, TransactionOut
from app.models.transaction import TransactionType
from app.models.user import User
from app.ai import suggest_category

router = APIRouter(prefix="/transactions", tags=["transactions"])


def _svc(db: Session = Depends(get_db)) -> TransactionService:
    return TransactionService(db)


@router.get("/", response_model=list[TransactionOut])
def list_transactions(
    skip: int = 0, limit: int = Query(50, le=200),
    account_id: int | None = None,
    category_id: int | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    transaction_type: TransactionType | None = None,
    current_user: User = Depends(get_current_user),
    svc: TransactionService = Depends(_svc),
):
    return svc.list_by_user(
        current_user.id, skip, limit,
        account_id, category_id, start_date, end_date, transaction_type,
    )


@router.post("/", response_model=TransactionOut, status_code=201)
def create_transaction(
    data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    svc: TransactionService = Depends(_svc),
):
    ai_suggestion = suggest_category(data.description, data.merchant)
    return svc.create(data, ai_suggestion=ai_suggestion)


@router.get("/summary")
def monthly_summary(
    year: int = Query(...), month: int = Query(...),
    current_user: User = Depends(get_current_user),
    svc: TransactionService = Depends(_svc),
):
    return svc.monthly_summary(current_user.id, year, month)


@router.get("/spending-by-category")
def spending_by_category(
    year: int = Query(...), month: int = Query(...),
    current_user: User = Depends(get_current_user),
    svc: TransactionService = Depends(_svc),
):
    return svc.spending_by_category(current_user.id, year, month)


@router.get("/{tx_id}", response_model=TransactionOut)
def get_transaction(tx_id: int, current_user: User = Depends(get_current_user), svc: TransactionService = Depends(_svc)):
    tx = svc.get(tx_id, current_user.id)
    if not tx:
        raise HTTPException(404, "Transaction not found")
    return tx


@router.patch("/{tx_id}", response_model=TransactionOut)
def update_transaction(tx_id: int, data: TransactionUpdate, current_user: User = Depends(get_current_user), svc: TransactionService = Depends(_svc)):
    tx = svc.get(tx_id, current_user.id)
    if not tx:
        raise HTTPException(404, "Transaction not found")
    return svc.update(tx, data)


@router.delete("/{tx_id}", status_code=204)
def delete_transaction(tx_id: int, current_user: User = Depends(get_current_user), svc: TransactionService = Depends(_svc)):
    tx = svc.get(tx_id, current_user.id)
    if not tx:
        raise HTTPException(404, "Transaction not found")
    svc.delete(tx)
