from ..core.item import Item
from sqlalchemy import Column, Integer, ForeignKey

class Consumable(Item):
    __tablename__ = "consumables"
    __mapper_args__ = {
    "polymorphic_identity": "consumable",
    }

    id = Column(Integer, ForeignKey("items.id"), primary_key=True)
    health_gain = Column(Integer)