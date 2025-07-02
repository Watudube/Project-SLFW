# Use official Python image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Install system dependencies for psycopg2 and SQLAlchemy
RUN apt-get update && apt-get install -y gcc libpq-dev

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of backend source code
COPY . .

# Run FastAPI using Uvicorn (development server)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]