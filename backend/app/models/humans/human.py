from sqlalchemy import Column, Integer, String, ForeignKey
from ..core.actor import Actor

class Human(Actor):
    __tablename__ = "humans"
    __mapper_args__ = {
    "polymorphic_identity": "human",
    }

    id = Column(Integer, ForeignKey("actors.id"), primary_key=True)