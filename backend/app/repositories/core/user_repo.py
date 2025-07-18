from .base_repo import BaseRepository
from sqlalchemy.orm import Session
from typing import TypeVar, Type
from app.models.core.user import User

M = TypeVar("M", bound=User)

class UserRepository(BaseRepository[M]):
    def __init__(self, db: Session, model: Type[M] = User):
        super().__init__(db, model)

    def get_user(self, username: str) -> M | None:
        return self.db.query(self.model).filter(self.model.username == username).first()