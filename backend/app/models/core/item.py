from .entity import Entity
from sqlalchemy import Column, Integer, ForeignKey
class Item(Entity):
    __tablename__ = "items"

    id = Column(Integer, ForeignKey("entities.id"), primary_key=True)