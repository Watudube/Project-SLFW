from .base_repo import BaseRepository
from sqlalchemy.orm import Session, selectinload
from app.models.core.tile import Tile

class TileRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(db, Tile)

    def get_tile(self, tile_id: int) -> Tile | None:
        return (self.db.query(Tile).filter(Tile.id == tile_id))
    
    def get_subsection(self, level_id: int, x_start: int, x_end: int, y_start: int, y_end: int) -> list[Tile]:
        return (
            self.db.query(Tile)
            .options(selectinload(Tile.entities))
            .filter(
                Tile.level_id == level_id,
                Tile.x_coord >= x_start,
                Tile.x_coord < x_end,
                Tile.y_coord >= y_start,
                Tile.y_coord < y_end,
            )
            .order_by(Tile.y_coord, Tile.x_coord)
            .all()
        )