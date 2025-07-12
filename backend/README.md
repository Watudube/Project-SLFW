# 🧰 Project Setup Guide

This guide walks you through setting up the backend environment for the project.

---

## Architecture

- **FastAPI**: Modern Python web framework with automatic API documentation.
- **SQLAlchemy**: ORM for database operations with repository pattern.
- **Alembic**: Database migration management.
- **Pydantic**: Data validation and settings management.
- **WebSockets**: Real-time game communication.
- **Redis**: Session and cache management.

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── apis/routers/        # API route definitions
│   ├── db/                  # Database configuration
│   ├── models/              # SQLAlchemy ORM models
│   ├── repositories/        # Data access layer
│   ├── schemas/             # Pydantic schemas for validation
│   ├── services/            # Business logic layer
│   └── websockets/          # WebSocket handlers
├── alembic/                 # Database migration files
├── requirements.txt         # Python dependencies
└── Dockerfile               # Container configuration
```

---

## 📦 Prerequisites

Ensure the following are installed:

- **Python 3.11+**
- **PostgreSQL**
  - [Download here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
  - Recommended:
    - Accept default settings during installation.
    - Remember your **host**, **username**, **password**, and **port**.
    - Install **pgAgent** under "Add-ons, tools and utilities."
- **Redis** (optional, not currently implemented)

---

## ✅ Verify Installations

Open a terminal and run:

```bash
python --version
psql --version
redis-server --version
```

> If any command fails (e.g. `'psql' is not recognized...`), PostgreSQL or Redis may not be installed correctly or is missing from your system PATH.

---

## 📂 Backend Environment Setup

1. Open a terminal in the `backend` directory.
2. Create a virtual environment:

   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:

   ```bash
    # (Not required if execution is not blocked)
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

   .venv\Scripts\Activate
   ```

4. Install required Python packages:

   ```bash
   pip install -r requirements.txt

   # If you want to deactivate the virtual environment
   deactivate
   ```

---

## 🧠 PostgreSQL Setup

1. Open the PostgreSQL shell:

   ```bash
   psql -U postgres
   ```

   > Enter the password you created during installation.

2. If no database exists yet:

   ```sql
   CREATE DATABASE your_database_name;
   ```

3. Confirm it was created:

   ```sql
   \l
   ```

3. Exit PostgreSQL shell (if necessary):

   ```sql
   exit
   ```

> 💡 Remember your database name — you’ll need it in your `.env`.

---

## 🧪 Redis Setup

_This is not implemented yet, so no action required for now._

---

## 🔐 Environment Configuration

1. In the **project root**, create a `.env` file (if it doesn't exist).
2. Copy from `.env.example` as a starting template:

   ```bash
   cp .env.example .env
   ```

3. Set all necessary variables:
   - PostgreSQL: host, username, password, port, database name
   - Redis (if applicable)

---

## 🧬 Alembic Migrations

1. Make sure you’re in the `backend` directory.
2. Run the following command:

   ```bash
   alembic upgrade head
   ```

3. If it fails and `alembic/versions/` is empty, create a migration:

   ```bash
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

---

## 🚀 Run the Backend Server

From the `backend` folder, run:

```bash
# Basic server start
uvicorn app.main:app

# Development mode with auto-reload (recommended unless debugging or require custom)
uvicorn app.main:app --reload

# Custom host and port
uvicorn app.main:app --host 0.0.0.0 --port 8080

# With detailed logging
uvicorn app.main:app --reload --log-level debug
```