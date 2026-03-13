# 💹 FinanciaX — Beat Your Financial Biases

A full-stack gamified personal finance app with AI-powered bias detection, investment simulator, fraud shield training, and a Claude-powered AI mentor.

**Pages:** Landing · Dashboard · Bias Report · Investment Simulator · Fraud Shield · AI Mentor · Leaderboard · Profile

---

## What you need

| Tool | Check if installed |
|------|--------------------|
| Python 3.10+ | `python3 --version` |
| Node.js 20+ | `node --version` |
| PostgreSQL 14+ | `psql --version` |

---

## One-time setup (do this once ever)

### 1. Install Node.js (if missing)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install PostgreSQL (if missing)
```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql && sudo systemctl enable postgresql
```

### 3. Create the database
```bash
sudo -u postgres psql -c "CREATE USER financiax WITH PASSWORD 'secret';"
sudo -u postgres psql -c "CREATE DATABASE financiax OWNER financiax;"
```

### 4. Unzip and enter the project
```bash
cd ~/Downloads
unzip -o financiax.zip
cd financiax/backend
```

### 5. Set up the Python environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install "bcrypt==4.0.1"
```

### 6. Configure environment
```bash
cp .env.example .env
```
Open `.env` with `nano .env` — it already has the right defaults. Optionally add your Anthropic API key for real AI responses in the Mentor chat (the app works without it using built-in replies):
```
ANTHROPIC_API_KEY=sk-ant-...
```
Save: **Ctrl+O → Enter → Ctrl+X**

### 7. Create tables and load demo data
```bash
alembic upgrade head
python seed.py
```
You'll see: `✅ Seed complete! 📧 demo@financiax.app / 🔑 demo1234`

### 8. Install frontend packages
```bash
cd ../frontend
npm install
```

---

## Every time you want to run the app

Open **two terminal windows** side by side.

**Terminal 1 — Backend:**
```bash
cd ~/Downloads/financiax/backend
source .venv/bin/activate
uvicorn app.main:app --reload
```
Wait for: `INFO: Uvicorn running on http://127.0.0.1:8000`

**Terminal 2 — Frontend:**
```bash
cd ~/Downloads/financiax/frontend
npm run dev
```
Wait for: `➜ Local: http://localhost:5173/`

**Then open:** http://localhost:5173

**Login:** demo@financiax.app / demo1234

---

## Troubleshooting

**"psycopg2 error" / can't connect to database**
```bash
sudo systemctl start postgresql
```

**"bcrypt" error during seed**
```bash
pip install "bcrypt==4.0.1"
python seed.py
```

**"alembic: command not found"**
```bash
source .venv/bin/activate   # activate virtual env first
```

**Port already in use**
```bash
sudo fuser -k 8000/tcp   # kills backend port
sudo fuser -k 5173/tcp   # kills frontend port
```

**Want to reset all data and start fresh**
```bash
sudo -u postgres psql -c "DROP DATABASE financiax;"
sudo -u postgres psql -c "CREATE DATABASE financiax OWNER financiax;"
alembic upgrade head
python seed.py
```

---

## App features

| Page | What it does |
|------|-------------|
| **Landing** | Hero, animated orbs, feature overview, live ticker |
| **Dashboard** | Health score gauge, XP tasks, bias radar, streak calendar, live market |
| **Bias Report** | 6 cognitive bias scores with radar chart and AI analysis |
| **Simulator** | Trade NSE stocks & crypto with ₹1L virtual cash |
| **Fraud Shield** | Daily scam scenarios — SMS, WhatsApp, Investment fraud |
| **AI Mentor** | Claude-powered chat with missions and quick questions |
| **Leaderboard** | Weekly rankings by XP, return, and health score |
| **Profile** | Level, XP bar, achievements, financial snapshot |

---

## API docs (when backend is running)
http://localhost:8000/api/docs

