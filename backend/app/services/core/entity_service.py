from sqlalchemy.orm import Session
from typing import TypeVar, Generic
from .base_service import BaseService
from app.models.core.entity import Entity
from app.repositories.core.entity_repo import EntityRepository

M = TypeVar("M", bound=Entity)
R = TypeVar("R", bound=EntityRepository)

class EntityService(BaseService[M, R], Generic[M, R]):
    def __init__(self, db: Session, model: type[M], repo_class: type[R]):
        super().__init__(db, model, repo_class)

    def get_position(self, entity_id: int) -> tuple[int, int]:
        position = self.repo.get_position(entity_id)
        if not position:
            raise ValueError(f"Model instance with id:{entity_id} not found")
        return position

    def get_name(self, entity_id: int) -> str:
        return self.get(entity_id).name
    
    def get_label(self, entity_id: int) -> str:
        return self.get(entity_id).label
    
    def get_description(self, entity_id: int) -> str:
        return self.get(entity_id).description