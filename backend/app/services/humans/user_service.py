from typing import Generic, Type, TypeVar, cast
from app.repositories.humans.user_repo import UserRepository
from .human_service import HumanService
from sqlalchemy.orm import Session
from app.models.humans.user import User
from app.models.core.level import Level
from app.services.core.tile_service import TileService
from app.services.core.level_service import LevelService
from app.models.core.tile import Tile

M = TypeVar("M", bound=User)
R = TypeVar("R", bound=UserRepository)

class UserService(HumanService[M, R], Generic[M, R]):
    def __init__(self, db: Session, model: Type[M] = User, repo_class: Type[R] = UserRepository):
        super().__init__(db, model, repo_class)
    
    def get_user(self, user_id: int) -> User:
        return self.get(user_id)
    
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

    def get_user_perception(self, user_id: int) -> Level:
        user = self.get_user(user_id)
        tile = TileService(self.db).get_empty_tile(user.tile_id)
        user_perception = LevelService(self.db).get_subsection(
            tile.level_id,
            tile.x_coord,
            tile.y_coord,
            user.perception_range
        )
        return user_perception