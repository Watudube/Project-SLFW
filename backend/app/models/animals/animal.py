from ..core.actor import Actor
from sqlalchemy import Column, Integer, ForeignKey

class Animal(Actor):
    __tablename__ = "animals"

    id = Column(Integer, ForeignKey("actors.id"), primary_key=True)
    hunger = Column(Integer, nullable=False)