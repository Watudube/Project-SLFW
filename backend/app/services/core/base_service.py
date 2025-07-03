from sqlalchemy.orm import Session
from typing import TypeVar, Generic, Type
from app.models.core.base_model import BaseModel
from app.repositories.core.base_repo import BaseRepository

M = TypeVar("M", bound=BaseModel)
R = TypeVar("R", bound=BaseRepository)

class BaseService(Generic[M, R]):
    def __init__(self, db: Session, model: Type[M], repo_class: Type[R]):
        self.repo: R = repo_class(db, model)

    def create(self, instance: dict) -> M:

        # What happens if we create an overlapping pk, what handles?

        return self.repo.create(instance)
    
    def delete(self, instance_id: int) -> None:
        model = self.repo.get(instance_id)
        if not model:
            raise ValueError(f"Model instance with id:{instance_id} not found")
        self.repo.delete(model)

    def get(self, instance_id: int) -> M:
        instance = self.repo.get(instance_id)
        if not instance:
            raise ValueError(f"Model instance with id:{instance_id} not found")
        return instance
    
    def list(self) -> list[M]:
        return self.repo.get_all()
