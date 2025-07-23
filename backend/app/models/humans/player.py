from .human import Human
from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship

class Player(Human):
    __tablename__ = "players"
    __table_args__ = (
        CheckConstraint("id > 0", name = "check_id_positive"),
    )
    __mapper_args__ = {"polymorphic_identity": "player"}

    id = Column(Integer, ForeignKey("humans.id"), primary_key=True)
    username = Column(String, ForeignKey("users.username"), nullable=False)

    user = relationship(
        "app.models.core.user.User",
        back_populates="player",
        uselist=False
    )