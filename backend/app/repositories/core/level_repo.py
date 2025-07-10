from .base_repo import BaseRepository
from sqlalchemy.orm import Session, selectinload
from app.models.core.level import Level
from app.models.core.tile import Tile

class LevelRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db, Level)
    
    def get_level_dimensions(self, level_id: int) -> tuple[int, int] | None:
        return (
            self.db.query(Level.length, Level.width)
            .filter(Level.id == level_id)
            .first()
        )

    def get_level(self, level_id: int) -> Level | None:
        return (
            self.db.query(Level)
            .options(
                selectinload(Level.tiles)
                .selectinload(Tile.entities)
            )
            .filter(Level.id == level_id)
            .first()
        )
    