from ..core.item import Item
from sqlalchemy import Column, Integer

class Consumable(Item):
    __tablename__ = "consumable"

    health_gain = Column(Integer)