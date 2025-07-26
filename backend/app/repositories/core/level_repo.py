from .base_repo import BaseRepository
from sqlalchemy.orm import Session, selectinload, joinedload, noload
from app.models.core.level import Level
from app.models.core.tile import Tile

class LevelRepository(BaseRepository):
    def __init__(self, db: Session, model: Level = Level):
        super().__init__(db, model)
    
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

    def get_level_dimensions(self, level_id: int) -> tuple[int, int] | None:
        return (
            self.db.query(Level.length, Level.width)
            .filter(Level.id == level_id)
            .first()
        )
    
    def get_empty_level_with_index(self, z_index: int) -> Level | None:
        return (
            self.db.query(Level)
            .options(noload(Level.tiles))
            .filter(Level.z_index == z_index)
            .first()
        )
    
    def get_subsection(self, level_id: int, x_start: int, x_end: int, y_start: int, y_end: int) -> list[Tile]:
        return (
            self.db.query(Tile)
            .options(joinedload(Tile.entities))
            .filter(
                Tile.level_id == level_id,
                Tile.x_coord >= x_start,
                Tile.x_coord < x_end,
                Tile.y_coord >= y_start,
                Tile.y_coord < y_end
            )
            .all()
        )
