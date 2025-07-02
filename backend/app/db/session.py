from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from app.db.settings import get_settings

# Load settings from .env
settings = get_settings()

# Create the SQLAlchemy engine (manages connections to the db)
# Add echo=False for more detailed outputs
engine = create_engine(settings.DATABASE_URL)

# sessionmaker: a session factory
# SessionLocal is configured to use connections provided by the engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Yields session to caller and ensures session closes after caller finishes
def get_session() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()