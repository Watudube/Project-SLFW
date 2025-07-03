from .base_model import BaseModel
from sqlalchemy import Column, String

class UserModel(BaseModel):
    __tablename__ = "users"

    username = Column(String, unique=True)
    password = Column(String, nullable=False)
    user_token = Column(String, unique=True)