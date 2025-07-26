from .base_model import Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    username = Column(String, primary_key=True, unique=True)
    password = Column(String, nullable=False)

    player = relationship(
        "app.models.humans.player.Player",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )