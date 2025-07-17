from .base_repo import BaseRepository
from sqlalchemy.orm import Session, selectinload, noload
from app.models.core.tile import Tile

class TileRepository(BaseRepository):
    def __init__(self, db: Session, model: Tile = Tile):
        super().__init__(db, model)

    def get_tile(self, tile_id: int) -> Tile | None:
        return (
            self.db.query(Tile)
            .options(selectinload(Tile.entities))
            .filter(Tile.id == tile_id)
            .first()
        )

    def get_empty_tile(self, tile_id: int) -> Tile | None:
        return (
            self.db.query(Tile)
            .options(noload(Tile.entities))
            .filter(Tile.id == tile_id)
            .first()
        )