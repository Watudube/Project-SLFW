from sqlalchemy.orm import Session
from typing import TypeVar, Type
from app.models.core.entity import Entity
from .base_repo import BaseRepository

M = TypeVar("M", bound=Entity)

class EntityRepository(BaseRepository[M]):
    def __init__(self, db: Session, model: Type[M] = Entity):
        super().__init__(db, model)