"""
AI layer powered by Anthropic claude-sonnet-4.
Provides:
  - auto-categorisation of transactions
  - personalised financial insights
  - chat-based financial assistant
"""
from __future__ import annotations
import json
import anthropic
from app.core.config import settings

_client: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    return _client


# ── Category suggestion ───────────────────────────────────────────────────────

CATEGORIES = [
    "Food & Dining", "Groceries", "Transportation", "Fuel",
    "Shopping", "Entertainment", "Utilities", "Rent & Mortgage",
    "Healthcare", "Insurance", "Travel", "Education",
    "Subscriptions", "Personal Care", "Gifts & Donations",
    "Investments", "Income", "Transfer", "Other",
]


def suggest_category(description: str, merchant: str | None = None) -> str:
    """Return a best-guess category name for a transaction."""
    if not settings.ANTHROPIC_API_KEY:
        return "Other"
    prompt = (
        f"Classify this bank transaction into exactly one of these categories:\n"
        f"{json.dumps(CATEGORIES)}\n\n"
        f"Transaction description: {description}\n"
        f"Merchant: {merchant or 'unknown'}\n\n"
        f"Reply with ONLY the category name, nothing else."
    )
    try:
        msg = _get_client().messages.create(
            model=settings.AI_MODEL,
            max_tokens=20,
            messages=[{"role": "user", "content": prompt}],
        )
        suggestion = msg.content[0].text.strip()
        return suggestion if suggestion in CATEGORIES else "Other"
    except Exception:
        return "Other"


# ── Financial insights ────────────────────────────────────────────────────────

def generate_insights(
    monthly_summary: dict,
    spending_by_category: list[dict],
    budgets: list[dict],
    net_worth: dict,
) -> str:
    """Generate 3-5 bullet-point financial insights for the current month."""
    if not settings.ANTHROPIC_API_KEY:
        return "Enable AI insights by adding your ANTHROPIC_API_KEY to .env."

    context = json.dumps(
        {
            "monthly_summary": monthly_summary,
            "spending_by_category": spending_by_category,
            "budgets": budgets,
            "net_worth": net_worth,
        },
        default=str,
    )
    prompt = (
        "You are a friendly personal finance advisor. "
        "Given the following financial data for the current month, "
        "provide 3-5 concise, actionable bullet-point insights. "
        "Be encouraging but honest. Format each bullet starting with an emoji.\n\n"
        f"Data:\n{context}"
    )
    try:
        msg = _get_client().messages.create(
            model=settings.AI_MODEL,
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}],
        )
        return msg.content[0].text.strip()
    except Exception as e:
        return f"Could not generate insights: {e}"


# ── Chat assistant ────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are FinanciaX Assistant, a knowledgeable and friendly personal finance AI.
You help users understand their spending, plan budgets, set savings goals, and make better financial decisions.
Be concise, practical, and supportive. Never provide specific investment advice or act as a licensed advisor.
When discussing numbers, always clarify the currency (default USD)."""


def chat(messages: list[dict], user_context: dict | None = None) -> str:
    """
    Multi-turn chat with the financial assistant.
    `messages` should be a list of {"role": "user"|"assistant", "content": str}.
    """
    if not settings.ANTHROPIC_API_KEY:
        return "AI chat is disabled. Add ANTHROPIC_API_KEY to .env to enable it."

    system = SYSTEM_PROMPT
    if user_context:
        system += f"\n\nUser's current financial snapshot:\n{json.dumps(user_context, default=str)}"

    try:
        msg = _get_client().messages.create(
            model=settings.AI_MODEL,
            max_tokens=1024,
            system=system,
            messages=messages,
        )
        return msg.content[0].text.strip()
    except Exception as e:
        return f"AI error: {e}"
