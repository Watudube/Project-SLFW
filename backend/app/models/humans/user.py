from .human import Human
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, CheckConstraint

class User(Human):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("username", name="unique_username"),
        CheckConstraint("id > 0", name = "check_id_positive"),
    )
    __mapper_args__ = {
        "polymorphic_identity": "user"
    }

    id = Column(Integer, ForeignKey("humans.id"), primary_key=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    description = None