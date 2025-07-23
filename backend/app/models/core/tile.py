from .base_model import BaseModel
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, UniqueConstraint, Index, CheckConstraint
from sqlalchemy.orm import relationship

class Tile(BaseModel):
    __tablename__ = "tiles"
    __table_args__ = (
        UniqueConstraint("level_id", "x_coord", "y_coord", name="unique_coordinates"),
        Index("tile_order", "level_id", "y_coord", "x_coord"),
        CheckConstraint("x_coord >= 0", name = "check_x_nonneg"),
        CheckConstraint("y_coord >= 0", name = "check_y_nonneg")
    )

    level_id = Column(Integer, ForeignKey("levels.id"), nullable=False)
    type = Column(String, nullable=False)
    x_coord = Column(Integer, nullable=False)
    y_coord = Column(Integer, nullable=False)
    is_wall = Column(Boolean, nullable=False)
    sprite = Column(String, nullable=False)
    speed = Column(Integer, nullable=False)

    level = relationship(
        "Level",
        back_populates="tiles"
    )

    entities = relationship(
        "app.models.core.entity.Entity",
        back_populates="tile",
        cascade="all, delete-orphan",
        lazy="selectin",
    )