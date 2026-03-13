from .auth import router as auth_router
from .accounts import router as accounts_router
from .transactions import router as transactions_router
from .budgets import router as budgets_router
from .goals import router as goals_router
from .ai import router as ai_router
from .categories import router as categories_router

__all__ = [
    "auth_router", "accounts_router", "transactions_router",
    "budgets_router", "goals_router", "ai_router", "categories_router",
]
