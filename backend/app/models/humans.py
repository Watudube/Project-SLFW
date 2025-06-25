from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Human(Base):
    __tablename__ = "humans"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    
