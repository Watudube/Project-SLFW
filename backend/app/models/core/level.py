from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .base_model import BaseModel
from .tile import Tile

class Level(BaseModel):
    __tablename__ = "levels"
    __table_args__ = (
        UniqueConstraint("z_index", name="unique_level_heights"),
    )

    gameboard_id = Column(Integer, ForeignKey("gameboard.id"), nullable=False)
    z_index = Column(Integer, nullable=False)
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