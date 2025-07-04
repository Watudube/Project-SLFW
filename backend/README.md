# Backend Development Guide

This directory contains the FastAPI backend application with WebSocket support, PostgreSQL database integration, and Redis caching.

## Architecture

- **FastAPI**: Modern Python web framework with automatic API documentation.
- **SQLAlchemy**: ORM for database operations with repository pattern.
- **Alembic**: Database migration management.
- **Pydantic**: Data validation and settings management.
- **WebSockets**: Real-time game communication.
- **Redis**: Session and cache management.

## Local Development Setup

### Prerequisites

- Python 3.11 or higher.

## TODO: EVERYING BELOW NEEDS TO BE VARIFIED WITH MARSHALL (WAS NOT ABLE TO SPIN UP APPLICATION LOCALLY):

### 1. Create and Activate Virtual Environment

```bash
# Create virtual environment (if you haven't yet).
python -m venv .venv

# Activate virtual environment (Windows).
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.venv\Scripts\activate

# Activate virtual environment (macOS/Linux).
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
# Install all required packages.
pip install -r requirements.txt
```

```bash
# To exit virtual environment (if necessary).
deactivate
```

### 3. Environment Configuration (if you haven't yet)

Create a `.env` file in the backend directory:

```env
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=slfw_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
REDIS_URL=redis://localhost:6379
```

### 4. Database Setup

```bash
# Run database migrations
alembic upgrade head

# Create new migration (after model changes)
alembic revision --autogenerate -m "description of changes"
```

### 5. Run the Application

```bash
# Start development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Access the application
# API: http://localhost:8000
# WebSocket: ws://localhost:8000/ws/game
# API Documentation: http://localhost:8000/docs
```

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

## Development Workflow

### Database Migrations

```bash
# Create migration after model changes
alembic revision --autogenerate -m "add new field to human model"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# View migration history
alembic history
```

### Testing Database Operations

```bash
# Connect to local PostgreSQL
psql -U your_username -d slfw_db

# Useful psql commands
\dt          # List all tables
\d humans    # Describe humans table
\q           # Quit psql
```

## Useful Commands

### Virtual Environment Management

```bash
# Deactivate virtual environment
deactivate

# Reinstall dependencies (if requirements.txt changes)
pip install -r requirements.txt

# Update requirements file
pip freeze > requirements.txt
```

### Development Server Options

```bash
# Basic server start
uvicorn app.main:app

# Development mode with auto-reload
uvicorn app.main:app --reload

# Custom host and port
uvicorn app.main:app --host 0.0.0.0 --port 8080

# With detailed logging
uvicorn app.main:app --reload --log-level debug
```
