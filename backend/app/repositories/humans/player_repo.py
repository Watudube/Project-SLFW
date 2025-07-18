from .human_repo import HumanRepository
from sqlalchemy.orm import Session
from typing import TypeVar, Type
from app.models.humans.player import Player

M = TypeVar("M", bound=Player)

class PlayerRepository(HumanRepository[M]):
    def __init__(self, db: Session, model: Type[M] = Player):
        super().__init__(db, model)
    
    def get_player(self, username: str) -> Player | None:
        return self.db.query(self.model).filter(self.model.username == username).first()