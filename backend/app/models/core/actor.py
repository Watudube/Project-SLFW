from .entity import Entity
from sqlalchemy import Column, Integer, ForeignKey

class Actor(Entity):
    __tablename__ = "actors"
    __mapper_args__ = {
    "polymorphic_identity": "actor",
    }

    id = Column(Integer, ForeignKey("entities.id"), primary_key=True)
    health = Column(Integer, nullable=False, default=100)
    perception_range = Column(Integer, default=5, nullable=False)
    hunger = Column(Integer, default=0, nullable=False)
    strength = Column(Integer, default=10, nullable=False)
    speed = Column(Integer, default =10, nullable=False)