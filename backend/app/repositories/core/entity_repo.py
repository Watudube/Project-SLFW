from sqlalchemy.orm import Session
from typing import TypeVar, Type
from app.models.core.entity import Entity
from .base_repo import BaseRepository

M = TypeVar("M", bound=Entity)

class EntityRepository(BaseRepository[M]):
    def __init__(self, db: Session, model: Type[M] = Entity):
        super().__init__(db, model)

    def get_position(self, instance_id: int) -> tuple[int, int] | None:
        return self.db.query(self.model.x_coord, self.model.y_coord).filter(self.model.id == instance_id).first()


    # Should I have this here or should I have this in the tiles area? I think conceptually in tiles but here seems quicker?
    # Actually I don't think this will be quicker because tiles have position as a primary key whereas multiple entities can
    # have the same position. But still its making a comparison on the primary key of every tile vs every entity?
    # def find_in_area(self, x_min: int, x_max: int, y_min: int, y_max: int) -> list[Entity]:
    #     return (
    #         self.db.query(self.model)
    #         .filter(
    #             self.model.x_coord >= x_min,
    #             self.model.x_coord <= x_max,
    #             self.model.y_coord >= y_min,
    #             self.model.y_coord <= y_max
    #         )
    #         .all()
    #     )