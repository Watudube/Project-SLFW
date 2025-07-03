from sqlalchemy.orm import Session
from typing import TypeVar, Generic
from ..core.actor_service import ActorService
from app.models.humans.human import Human
from app.repositories.humans.human_repo import HumanRepository

M = TypeVar("M", bound=Human)
R = TypeVar("R", bound=HumanRepository)

class HumanService(ActorService[M, R], Generic[M, R]):
    def __init__(self, db: Session, model: type[M] = Human, repo_class: type[R] = HumanRepository):
        super().__init__(db, model, repo_class)

    def get_strength(self, human_id: int) -> int:
        return self.get(human_id).strength