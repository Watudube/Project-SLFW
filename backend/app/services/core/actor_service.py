from sqlalchemy.orm import Session
from typing import TypeVar, Generic
from .entity_service import EntityService
from app.models.core.actor import Actor
from app.repositories.core.actor_repo import ActorRepository

M = TypeVar("M", bound=Actor)
R = TypeVar("R", bound=ActorRepository)

class ActorService(EntityService[M, R], Generic[M, R]):
    def __init__(self, db: Session, model: type[M], repo_class: type[R]):
        super().__init__(db, model, repo_class)
    
    def get_health(self, actor_id: int) -> int:
        return self.get(actor_id).health