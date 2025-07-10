from ..core.prop import Prop
from sqlalchemy import Column, Integer

class Field(Prop):
    __abstract__ = True

    spread_factor = Column(Integer, nullable=False)