# Project Summary

At its largest scale, the Simulated Living Fantasy World (SLFW) game will simulate, a living fantasy world, where all NPC entities and players can mutually affect and interact one another. There would be a persistent sandbox and framework for NPCs to have their own motivations and objectives, and the game world itself simulates ecology and an economy. Economies and other systems will follow the principles of supply and demand, where there will be "no free lunch". Consequently, player actions will have a direct effect on the state of the world and can shape it based on the established systems of that world. State changes in the game world will occur and be reflected to the player in real-time.

## Architecture

- **Frontend**: React application using Phaser3 for GUI functionality, served by nginx.
- **Backend**: FastAPI application with WebSocket support.
- **Database**: PostgreSQL for cold data, with Alembic migrations.
- **Cache**: Redis for hot data.
- **Deployment**: Docker Compose with multi-stage builds.

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed.
- `.env` file in project root with required environment variables.

### Environment Setup

Create a `.env` file in the project root (remember to change the user and password details):

```env
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=slfw_db
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
REDIS_URL=redis://redis:6379
```

### Build and Run

```bash
# Build and start all services
docker compose up --build

# Run in background
docker compose up --build -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### Access the Application

- **Frontend**: http://localhost (served through nginx, port 80)
- **Backend API**: http://localhost/api (port 8000)
- **WebSocket**: ws://localhost/ws/game (port 8000)
- **Database**: localhost:5433 (external access)
- **Redis**: localhost:6380 (external access)

## TODO: EVERYING BELOW NEEDS TO BE VARIFIED WITH MARSHALL:

### Database Migrations

<b>TODO: IMPORTANT!!! Test the migration commands work!!!</b>

```bash
# Run migrations in the backend container
docker compose exec backend alembic upgrade head

# Create new migration
docker compose exec backend alembic revision --autogenerate -m "migration message"
```

## Development

For local development without Docker, see:

- Backend Development Guide (backend/README.md)
- Frontend Development Instructions (frontend/README.md)

## Troubleshooting

### Common Issues

- **Port conflicts**: Ensure ports 80, 8000, 5433, 6380 are available
- **Environment variables**: Check `.env` file is properly configured
- **Database connection**: Wait for postgres container to be ready before backend starts

### Useful Commands (Examples)

```bash
# Rebuild specific service (repalce 'nginx' with other service)
docker compose build nginx

# View container status
docker compose ps

# Execute commands in containers (repalce 'your_username')
docker compose exec backend bash
docker compose exec postgres psql -U your_username -d slfw_db

# Clean up everything
docker compose down -v --remove-orphans
```
