#!/usr/bin/env python3
"""Seed FinanciaX with demo data. Run: python seed.py"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import date, timedelta
from decimal import Decimal
from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import User, Account, Transaction, Budget, Goal, Category
from app.models.transaction import TransactionType
from app.models.budget import BudgetPeriod
from app.models.goal import GoalStatus

db = SessionLocal()

def run():
    print("🌱  Seeding FinanciaX …")

    cats_data = [
        ("Food & Dining","🍽️","#FF6B6B"), ("Groceries","🛒","#FFA07A"),
        ("Transportation","🚗","#4ECDC4"), ("Fuel","⛽","#45B7D1"),
        ("Shopping","🛍️","#96CEB4"), ("Entertainment","🎬","#FFEAA7"),
        ("Utilities","💡","#DDA0DD"), ("Rent","🏠","#98D8C8"),
        ("Healthcare","🏥","#F7DC6F"), ("Insurance","🛡️","#85C1E9"),
        ("Travel","✈️","#82E0AA"), ("Education","📚","#F1948A"),
        ("Subscriptions","📱","#BB8FCE"), ("Personal Care","💅","#FAD7A0"),
        ("Gifts","🎁","#A9CCE3"), ("Income","💰","#58D68D"),
        ("Transfer","🔄","#AEB6BF"), ("Other","📋","#CCD1D1"),
    ]
    cats = {}
    for name, icon, color in cats_data:
        c = Category(name=name, icon=icon, color=color)
        db.add(c); cats[name] = c
    db.flush()

    user = User(email="demo@financiax.app", full_name="Alex Johnson",
                hashed_password=hash_password("demo1234"), is_active=True)
    db.add(user); db.flush()

    checking = Account(user_id=user.id, name="Chase Checking", institution="Chase",
                       account_type="checking", balance=Decimal("4820.50"), mask="4242")
    savings  = Account(user_id=user.id, name="Ally Savings",   institution="Ally",
                       account_type="savings",  balance=Decimal("18350.00"), mask="9001")
    credit   = Account(user_id=user.id, name="Citi Double Cash", institution="Citi",
                       account_type="credit",   balance=Decimal("1240.75"), mask="5678")
    invest   = Account(user_id=user.id, name="Fidelity Brokerage", institution="Fidelity",
                       account_type="investment", balance=Decimal("32600.00"), mask="3333")
    for acc in (checking, savings, credit, invest):
        db.add(acc)
    db.flush()

    today = date.today()
    txs = [
        (checking,"Salary - Acme Corp",   Decimal("5500.00"),TransactionType.INCOME,  -30,cats["Income"]),
        (checking,"Salary - Acme Corp",   Decimal("5500.00"),TransactionType.INCOME,  -60,cats["Income"]),
        (checking,"Freelance payment",    Decimal("800.00"), TransactionType.INCOME,  -15,cats["Income"]),
        (checking,"Rent - Oak Street",    Decimal("1650.00"),TransactionType.EXPENSE,  -1,cats["Rent"]),
        (checking,"Rent - Oak Street",    Decimal("1650.00"),TransactionType.EXPENSE, -31,cats["Rent"]),
        (checking,"Rent - Oak Street",    Decimal("1650.00"),TransactionType.EXPENSE, -61,cats["Rent"]),
        (checking,"PG&E Electric",        Decimal("95.40"), TransactionType.EXPENSE,   -5,cats["Utilities"]),
        (checking,"Comcast Internet",     Decimal("79.99"), TransactionType.EXPENSE,   -8,cats["Utilities"]),
        (credit,  "Whole Foods Market",   Decimal("134.22"),TransactionType.EXPENSE,   -3,cats["Groceries"]),
        (credit,  "Trader Joe's",         Decimal("87.56"), TransactionType.EXPENSE,  -10,cats["Groceries"]),
        (credit,  "Safeway",              Decimal("62.14"), TransactionType.EXPENSE,  -18,cats["Groceries"]),
        (credit,  "Whole Foods Market",   Decimal("119.88"),TransactionType.EXPENSE,  -35,cats["Groceries"]),
        (credit,  "Chipotle",             Decimal("14.50"), TransactionType.EXPENSE,   -2,cats["Food & Dining"]),
        (credit,  "Starbucks",            Decimal("6.75"),  TransactionType.EXPENSE,   -4,cats["Food & Dining"]),
        (credit,  "DoorDash",             Decimal("38.90"), TransactionType.EXPENSE,   -7,cats["Food & Dining"]),
        (credit,  "The Cheesecake Factory",Decimal("82.40"),TransactionType.EXPENSE,  -12,cats["Food & Dining"]),
        (credit,  "Starbucks",            Decimal("7.25"),  TransactionType.EXPENSE,  -14,cats["Food & Dining"]),
        (credit,  "Uber Eats",            Decimal("29.60"), TransactionType.EXPENSE,  -20,cats["Food & Dining"]),
        (credit,  "Uber",                 Decimal("22.10"), TransactionType.EXPENSE,   -3,cats["Transportation"]),
        (credit,  "Shell Gas Station",    Decimal("58.40"), TransactionType.EXPENSE,   -9,cats["Fuel"]),
        (credit,  "Clipper Card",         Decimal("45.00"), TransactionType.EXPENSE,  -16,cats["Transportation"]),
        (credit,  "Netflix",              Decimal("15.49"), TransactionType.EXPENSE,   -6,cats["Subscriptions"]),
        (credit,  "Spotify",              Decimal("10.99"), TransactionType.EXPENSE,   -6,cats["Subscriptions"]),
        (credit,  "Amazon Prime",         Decimal("14.99"), TransactionType.EXPENSE,  -36,cats["Subscriptions"]),
        (credit,  "Adobe Creative Cloud", Decimal("54.99"), TransactionType.EXPENSE,  -36,cats["Subscriptions"]),
        (credit,  "Amazon",               Decimal("145.30"),TransactionType.EXPENSE,  -11,cats["Shopping"]),
        (credit,  "Target",               Decimal("67.85"), TransactionType.EXPENSE,  -22,cats["Shopping"]),
        (credit,  "Nike",                 Decimal("129.00"),TransactionType.EXPENSE,  -40,cats["Shopping"]),
        (checking,"CVS Pharmacy",         Decimal("32.15"), TransactionType.EXPENSE,  -19,cats["Healthcare"]),
        (checking,"Dr. Smith Copay",      Decimal("30.00"), TransactionType.EXPENSE,  -45,cats["Healthcare"]),
        (credit,  "Delta Airlines",       Decimal("387.00"),TransactionType.EXPENSE,  -55,cats["Travel"]),
        (credit,  "Airbnb",               Decimal("245.00"),TransactionType.EXPENSE,  -53,cats["Travel"]),
        (checking,"Transfer to Savings",  Decimal("500.00"),TransactionType.TRANSFER, -30,cats["Transfer"]),
        (checking,"Transfer to Savings",  Decimal("500.00"),TransactionType.TRANSFER, -60,cats["Transfer"]),
    ]
    for acc, desc, amount, tx_type, days_ago, cat in txs:
        db.add(Transaction(
            account_id=acc.id, category_id=cat.id, amount=amount,
            transaction_type=tx_type, description=desc,
            transaction_date=today + timedelta(days=days_ago),
            merchant=desc.split(" - ")[0] if " - " in desc else desc.split()[0],
        ))
    db.flush()

    for name, cat, amount in [
        ("Groceries Budget",  cats["Groceries"],      Decimal("400.00")),
        ("Dining Out",        cats["Food & Dining"],  Decimal("300.00")),
        ("Entertainment",     cats["Entertainment"],  Decimal("150.00")),
        ("Transport",         cats["Transportation"], Decimal("200.00")),
        ("Subscriptions",     cats["Subscriptions"],  Decimal("120.00")),
        ("Shopping",          cats["Shopping"],       Decimal("250.00")),
    ]:
        db.add(Budget(user_id=user.id, category_id=cat.id, name=name,
                      amount=amount, period=BudgetPeriod.MONTHLY,
                      year=today.year, month=today.month))

    for name, desc, target, current, tdate, icon in [
        ("Emergency Fund","6 months expenses",  Decimal("20000"),Decimal("18350"),None,                   "🏦"),
        ("New Car",       "Honda Accord",        Decimal("8000"), Decimal("2500"), date(today.year+1,6,1), "🚗"),
        ("Vacation Fund", "Japan trip",          Decimal("5000"), Decimal("1800"), date(today.year,12,1),  "✈️"),
        ("MacBook Pro",   "M3 Max upgrade",      Decimal("3500"), Decimal("3500"), None,                   "💻"),
    ]:
        status = GoalStatus.COMPLETED if current >= target else GoalStatus.ACTIVE
        db.add(Goal(user_id=user.id, name=name, description=desc,
                    target_amount=target, current_amount=current,
                    target_date=tdate, status=status, icon=icon))

    db.commit()
    print("✅  Seed complete!")
    print("   📧  demo@financiax.app  /  🔑  demo1234")

if __name__ == "__main__":
    run()
    db.close()
