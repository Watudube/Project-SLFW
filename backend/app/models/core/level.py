from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base_model import BaseModel
from .tile import Tile

class Level(BaseModel):
    __tablename__ = "levels"

    gameboard_id = Column(Integer, ForeignKey("gameboard.id"), nullable=False)
    length = Column(Integer, nullable=False)
    width = Column(Integer, nullable=False)

    gameboard = relationship(
        "Gameboard",
        back_populates="levels"
    )

    tiles = relationship(
        "app.models.core.tile.Tile",
        back_populates="level",
        cascade="all, delete-orphan",
        lazy="selectin",
        order_by=lambda: (Tile.y_coord, Tile.x_coord)
    )