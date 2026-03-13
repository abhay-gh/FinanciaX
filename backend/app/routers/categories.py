from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.category import Category
from app.models.user import User

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/")
def list_categories(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return list(db.scalars(select(Category).order_by(Category.name)))
