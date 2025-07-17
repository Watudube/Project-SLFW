from .human_repo import HumanRepository
from sqlalchemy.orm import Session
from typing import TypeVar, Type
from app.models.humans.user import User

M = TypeVar("M", bound=User)

class UserRepository(HumanRepository[M]):
    def __init__(self, db: Session, model: Type[M] = User):
        super().__init__(db, model)

    def get_user(self, username: str) -> M | None:
        return self.db.query(self.model).filter(self.model.username == username).first()