from .field import Field
from sqlalchemy import Column, Integer, ForeignKey

class Grass(Field):
    __tablename__ = "grass_field"

    id = Column(Integer, ForeignKey("fields.id"), primary_key=True)