from .base_service import BaseService
from app.models.core.tile import Tile
from app.repositories.core.tile_repo import TileRepository
from sqlalchemy.orm import Session
from .level_service import LevelService

class TileService(BaseService[Tile, TileRepository]):
    def __init__(self, db: Session):
        super().__init__(db, Tile, TileRepository)

    def get_tile(self, tile_id: int) -> Tile:
        """
        Provides a tile
        Params
            - tile_id: id of a tile
        Returns
            - Tile: tile object
        Raises
            - ValueError: tile is not found
        """
        tile = self.repo.get_tile(tile_id)
        if not tile:
            raise ValueError(f"Tile with ID: {tile_id} does not exist")
        return tile

    def get_empty_tile(self, tile_id: int) -> Tile:
        """
        Provides a tile without entities
        Params
            - tile_id: id of a tile
        Returns
            - Tile: tile object
        Raises
            - ValueError: tile is not found
        """
        tile = self.repo.get_empty_tile(tile_id)
        if not tile:
            raise ValueError(f"Tile with ID: {tile_id} does not exist")
        return tile
    
    def get_empty_tile_with_coords(self, x_coord: int, y_coord: int) -> Tile | None:
        return self.repo.get_empty_tile_with_coords(x_coord, y_coord)        