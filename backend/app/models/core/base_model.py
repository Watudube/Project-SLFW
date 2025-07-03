from app.db.base import Base
from sqlalchemy import Column, Integer

# Base model for all types of 
class BaseModel(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True)