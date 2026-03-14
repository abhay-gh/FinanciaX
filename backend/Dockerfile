FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
<<<<<<< HEAD
RUN pip install --no-cache-dir -r requirements.txt && pip install "bcrypt==4.0.1"
COPY . .
=======
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install "bcrypt==4.0.1"
COPY . .
EXPOSE 8000
>>>>>>> 313cbc4260ac0a51afb8e3bc262b56202cd79808
CMD alembic upgrade head && python seed.py && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
