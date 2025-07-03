from ..core.actor import Actor
from sqlalchemy import Column, Integer

class Animal(Actor):
    __abstract__ = True
    
    hunger = Column(Integer, nullable=False)
    thirst = Column(Integer, nullable=False)