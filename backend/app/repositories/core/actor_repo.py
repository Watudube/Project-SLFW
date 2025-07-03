from sqlalchemy.orm import Session
from typing import TypeVar, Type
from app.models.core.actor import Actor
from .entity_repo import EntityRepository

M = TypeVar("M", bound=Actor)

class ActorRepository(EntityRepository[M]):
    def __init__(self, db: Session, model: Type[M] = Actor):
        super().__init__(db, model)