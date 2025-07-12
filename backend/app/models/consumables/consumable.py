from ..core.item import Item
from sqlalchemy import Column, Integer, ForeignKey

class Consumable(Item):
    __tablename__ = "consumable"

    id = Column(Integer, ForeignKey("items.id"), primary_key=True)
    health_gain = Column(Integer)