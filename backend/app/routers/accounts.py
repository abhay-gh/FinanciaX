from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.services.account_service import AccountService
from app.schemas.account import AccountCreate, AccountUpdate, AccountOut
from app.models.user import User

router = APIRouter(prefix="/accounts", tags=["accounts"])


def _svc(db: Session = Depends(get_db)) -> AccountService:
    return AccountService(db)


@router.get("/", response_model=list[AccountOut])
def list_accounts(current_user: User = Depends(get_current_user), svc: AccountService = Depends(_svc)):
    return svc.list_by_user(current_user.id)


@router.post("/", response_model=AccountOut, status_code=201)
def create_account(data: AccountCreate, current_user: User = Depends(get_current_user), svc: AccountService = Depends(_svc)):
    return svc.create(current_user.id, data)


@router.get("/net-worth")
def net_worth(current_user: User = Depends(get_current_user), svc: AccountService = Depends(_svc)):
    return svc.net_worth(current_user.id)


@router.get("/{account_id}", response_model=AccountOut)
def get_account(account_id: int, current_user: User = Depends(get_current_user), svc: AccountService = Depends(_svc)):
    acc = svc.get(account_id, current_user.id)
    if not acc:
        raise HTTPException(404, "Account not found")
    return acc


@router.patch("/{account_id}", response_model=AccountOut)
def update_account(account_id: int, data: AccountUpdate, current_user: User = Depends(get_current_user), svc: AccountService = Depends(_svc)):
    acc = svc.get(account_id, current_user.id)
    if not acc:
        raise HTTPException(404, "Account not found")
    return svc.update(acc, data)


@router.delete("/{account_id}", status_code=204)
def delete_account(account_id: int, current_user: User = Depends(get_current_user), svc: AccountService = Depends(_svc)):
    acc = svc.get(account_id, current_user.id)
    if not acc:
        raise HTTPException(404, "Account not found")
    svc.delete(acc)
