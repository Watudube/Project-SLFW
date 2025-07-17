from sqlalchemy.orm import Session
from typing import TypeVar, Generic, Type
from app.models.core.base_model import BaseModel
from app.repositories.core.base_repo import BaseRepository

M = TypeVar("M", bound=BaseModel)
R = TypeVar("R", bound=BaseRepository)

class BaseService(Generic[M, R]):
    def __init__(self, db: Session, model: Type[M], repo_class: Type[R]):
        self.db = db
        self.model = model
        self.repo: R = repo_class(db, model)

    def create(self, instance: dict) -> M:
        try:
            instance = self.model(**instance)
        except TypeError as e:
            raise ValueError(f"Data: {instance}\ndoes not match model: {self.model.__name__}\n{e}")
        try:
            return self.repo.create(instance)
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Schema failed to validate: {e}")
    
    def delete(self, instance: M) -> None:
        try:
            self.repo.delete(instance)
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Failed to delete instance: {e}")

    def get(self, instance_id: int) -> M:
        instance = self.repo.get(instance_id)
        if not instance:
            raise ValueError(f"Model instance with id:{instance_id} not found")
        return instance
    
    def list(self) -> list[M]:
        return self.repo.get_all()
