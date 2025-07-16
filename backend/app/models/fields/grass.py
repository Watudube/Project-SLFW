from .field import Field
from sqlalchemy import Column, Integer, ForeignKey

class Grass(Field):
    __tablename__ = "grass_fields"
    __mapper_args__ = {
    "polymorphic_identity": "grass",
    }

    id = Column(Integer, ForeignKey("fields.id"), primary_key=True)