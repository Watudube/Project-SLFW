from .animal import Animal
from sqlalchemy import Column, Integer

class Aggressive(Animal):
    __tablename__ = "aggressive_animals"

    strength = Column(Integer, nullable=False)