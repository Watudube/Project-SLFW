from sqlalchemy import Column, Integer
from ..core.actor import Actor

class Human(Actor):
    __tablename__ = "humans"

    hunger = Column(Integer, nullable=False)
    thirst = Column(Integer, nullable=False)
    strength = Column(Integer, nullable=False)