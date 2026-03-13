from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import (
    auth_router, accounts_router, transactions_router,
    budgets_router, goals_router, ai_router, categories_router,
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PREFIX = "/api"
app.include_router(auth_router,         prefix=PREFIX)
app.include_router(accounts_router,     prefix=PREFIX)
app.include_router(transactions_router, prefix=PREFIX)
app.include_router(budgets_router,      prefix=PREFIX)
app.include_router(goals_router,        prefix=PREFIX)
app.include_router(ai_router,           prefix=PREFIX)
app.include_router(categories_router,   prefix=PREFIX)


@app.get("/health")
def health():
    return {"status": "ok", "version": settings.APP_VERSION}
