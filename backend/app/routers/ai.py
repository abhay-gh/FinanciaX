from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.services.account_service import AccountService
from app.services.transaction_service import TransactionService
from app.services.budget_service import BudgetService
from app.services.goal_service import GoalService
from app.ai import generate_insights, chat

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/insights")
def insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now = datetime.now()
    tx_svc = TransactionService(db)
    acc_svc = AccountService(db)
    bud_svc = BudgetService(db)
    summary = tx_svc.monthly_summary(current_user.id, now.year, now.month)
    by_cat = tx_svc.spending_by_category(current_user.id, now.year, now.month)
    budgets = bud_svc.list_by_user(current_user.id, now.year, now.month)
    net_worth = acc_svc.net_worth(current_user.id)
    text = generate_insights(summary, by_cat, budgets, net_worth)
    return {"insights": text}


class ChatRequest(BaseModel):
    messages: list[dict]  # [{"role": "user"|"assistant", "content": str}]


@router.post("/chat")
def chat_endpoint(
    body: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    acc_svc = AccountService(db)
    user_context = acc_svc.net_worth(current_user.id)
    reply = chat(body.messages, user_context)
    return {"reply": reply}
