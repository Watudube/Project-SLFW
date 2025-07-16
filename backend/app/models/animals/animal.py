from ..core.actor import Actor
from sqlalchemy import Column, Integer, ForeignKey

class Animal(Actor):
    __tablename__ = "animals"
    __mapper_args__ = {
    "polymorphic_identity": "animal",
    }

    id = Column(Integer, ForeignKey("actors.id"), primary_key=True)
    hunger = Column(Integer, nullable=False)