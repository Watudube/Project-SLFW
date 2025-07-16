from .base_model import BaseModel
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

class Entity(BaseModel):
    __tablename__ = "entities"

    tile_id = Column(Integer, ForeignKey("tiles.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)
    label = Column(String, nullable=False)
    description = Column(String, nullable=False)
    sprite = Column(String, nullable=False)
    
    tile = relationship(
        "app.models.core.tile.Tile",
        back_populates="entities",
        lazy="joined"
    )

    __mapper_args__ = {
        "polymorphic_on": type,
        "polymorphic_identity": "entity",
        "with_polymorphic": "*"
    }