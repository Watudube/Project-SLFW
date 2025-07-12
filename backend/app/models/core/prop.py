from .entity import Entity
from sqlalchemy import Column, Integer, ForeignKey

class Prop(Entity):
    __tablename__ = "props"

    id = Column(Integer, ForeignKey("entities.id"), primary_key=True)