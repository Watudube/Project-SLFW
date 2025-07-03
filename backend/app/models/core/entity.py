from .base_model import BaseModel
from sqlalchemy import Column, String, Integer

class Entity(BaseModel):
    __abstract__ = True

    name = Column(String, nullable=False)
    label = Column(String, nullable=False)
    description = Column(String, nullable=False)
    x_coord = Column(Integer, nullable=False)
    y_coord = Column(Integer, nullable=False)