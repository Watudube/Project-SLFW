from .entity import Entity
from sqlalchemy import Column, Integer

class Actor(Entity):
    __abstract__ = True

    health = Column(Integer, nullable=False, default=100)
    speed = Column(Integer, nullable=False)
    perception_range = Column(Integer, nullable=False)