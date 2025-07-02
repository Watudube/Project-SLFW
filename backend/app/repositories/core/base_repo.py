from sqlalchemy.orm import Session
from typing import TypeVar, Generic, Type
from app.models.core.base_model import BaseModel

M = TypeVar("M", bound=BaseModel)

class BaseRepository(Generic[M]):
    def __init__(self, db: Session, model: Type[M] = BaseModel):
        self.db = db
        self.model = model

    def create(self, instance: dict) -> M:
        instance = self.model(**instance)
        self.db.add(instance)
        self.db.commit()
        self.db.refresh(instance)
        return instance

    def delete(self, instance: M) -> None:
        self.db.delete(instance)
        self.db.commit()

    def get(self, instance_id: int) -> M | None:
        return self.db.query(self.model).filter(self.model.id == instance_id).first()
    
    def get_all(self) -> list[M]:
        return self.db.query(self.model).all()