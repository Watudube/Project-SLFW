from .entity import Entity
from sqlalchemy import Column, Integer, ForeignKey
class Item(Entity):
    __tablename__ = "items"
    __mapper_args__ = {
    "polymorphic_identity": "item",
    }


    id = Column(Integer, ForeignKey("entities.id"), primary_key=True)