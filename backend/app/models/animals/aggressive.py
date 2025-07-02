from .animal import Animal
from sqlalchemy import Column, Integer

class Aggressive(Animal):
    __abstract__ = True

    strength = Column(Integer, nullable=False)