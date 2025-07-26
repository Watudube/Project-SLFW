from .human import Human
from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

class Player(Human):
    __tablename__ = "players"
    __mapper_args__ = {"polymorphic_identity": "player"}

    id = Column(Integer, ForeignKey("humans.id"), primary_key=True)
    username = Column(String, ForeignKey("users.username"), nullable=False)
    relog_tile_id = Column(Integer, default=None, nullable=True)

    user = relationship(
        "app.models.core.user.User",
        back_populates="player",
        uselist=False
    )