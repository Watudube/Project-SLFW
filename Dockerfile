# Assumptions:
## Backend: /backend/app/main.py is the FastAPI entrypoint
## Frontend: React+Phaser app, served as a built static site (npm run build)
## Nginx config: Reverse proxies API/WebSocket traffic to FastAPI

# ---- Stage 1: Build Frontend ----
FROM node:20 AS frontend-builder
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend ./
RUN npm run build

# ---- Stage 2: Main Image ----
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    postgresql \
    redis-server \
    supervisor \
    gcc \
    libpq-dev \
    && apt-get clean

# Set working directory
WORKDIR /app

# Install Python deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install uvicorn[standard]

# Copy project code and config
COPY backend /app/backend
COPY --from=frontend-builder /frontend/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY run.sh /run.sh
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN chmod +x /run.sh

# Create PostgreSQL data directory
RUN mkdir -p /var/lib/postgresql/data

# Expose ports
EXPOSE 80 8000 5432 6379

CMD ["/run.sh"]
