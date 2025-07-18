from typing import TypeVar, Generic, Type, cast
from app.models.core.user import User
from app.repositories.core.user_repo import UserRepository
from .base_service import BaseService
from sqlalchemy.orm import Session

M = TypeVar("M", bound=User)
R = TypeVar("R", bound=UserRepository)

class UserService(BaseService[M, R], Generic[M, R]):
    def __init__(self, db: Session, model: Type[M] = User, repo_class: Type[R] = UserRepository):
        super().__init__(db, model, repo_class)

    def get_user(self, username: str) -> User:
        user = self.get_user(username)
        if not user:
            raise ValueError(f"User: {username} not found")
        return user
    
    def create_user(self, user_in: dict) -> User:
        return self.create(user_in)
    
    def check_username_exists(self, username: str) -> bool:
        # Don't want to return the user here if true, just bool
        if self.repo.get_user(username):
            return True
        return False
    
    def validate_credentials(self, username: str, password: str) -> User | None:
        user = self.repo.get_user(username)
        if (user and password == cast(User, user).password):
            return User
        return