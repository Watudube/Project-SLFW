from sqlalchemy import Column, Integer, String, ForeignKey
from ..core.actor import Actor

class Human(Actor):
    __tablename__ = "humans"

    id = Column(Integer, ForeignKey("actors.id"), primary_key=True)
    name = Column(String)
    hunger = Column(Integer, nullable=False)
    strength = Column(Integer, nullable=False)