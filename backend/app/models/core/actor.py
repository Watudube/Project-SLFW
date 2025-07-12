from .entity import Entity
from sqlalchemy import Column, Integer, ForeignKey

class Actor(Entity):
    __tablename__ = "actors"

    id = Column(Integer, ForeignKey("entities.id"), primary_key=True)
    health = Column(Integer, nullable=False, default=100)
    speed = Column(Integer, nullable=False)
    perception_range = Column(Integer, nullable=False)