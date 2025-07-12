from sqlalchemy import Column, Integer
from sqlalchemy.orm import relationship
from .base_model import BaseModel

class Gameboard(BaseModel):
    __tablename__ = "gameboard"

    num_levels = Column(Integer)
    
    levels = relationship(
        "app.models.core.level.Level",
        back_populates="gameboard",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
