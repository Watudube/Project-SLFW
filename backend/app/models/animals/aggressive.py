from .animal import Animal
from sqlalchemy import Column, Integer, ForeignKey

class Aggressive(Animal):
    __tablename__ = "aggressive_animals"

    id = Column(Integer, ForeignKey("animals.id"), primary_key=True)
    strength = Column(Integer, nullable=False)