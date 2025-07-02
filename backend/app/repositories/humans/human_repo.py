from sqlalchemy.orm import Session
from typing import TypeVar, Type
from app.models.humans.human import Human
from ..core.actor_repo import ActorRepository

M = TypeVar("M", bound=Human)

class HumanRepository(ActorRepository[M]):
    def __init__(self, db: Session, model: Type[M] = Human):
        super().__init__(db, model)