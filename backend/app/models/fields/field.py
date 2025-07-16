from ..core.prop import Prop
from sqlalchemy import Column, Integer, ForeignKey

class Field(Prop):
    __tablename__ = "fields"
    __mapper_args__ = {
    "polymorphic_identity": "field",
    }

    id = Column(Integer, ForeignKey("props.id"), primary_key=True)
    spread_factor = Column(Integer, nullable=False)