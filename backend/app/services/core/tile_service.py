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
    
    def get_subsection(self, level_id: int, x: int, y: int, perception_range: int) -> list[Tile]:
        """
        Provides a subsection of tiles from a level centered on a given coordinate
        Params
            - level_id: id of the level where the subsection is taken
            - x: x coordinate where subsection is centered
            - y: y coordinate where subsection is centered
            - perception_range: Distance from center to be included in subsection
        returns
            - list[Tile]: A list of tiles on the level within the perception range of center
        Raises
            - ValueError: coordinates are out of bounds of gameboard
            - ValueError: No tiles matched the given conditions
        """
        level_service = LevelService(self.db)
        length, width = level_service.get_dimensions(level_id)
        if x >= length or x < 0 or y >= width or y < 0:
            raise ValueError("x and/or y values are out of bounds")

        x_start = max(0, x - perception_range)
        x_end = min(length, x + perception_range + 1)
        y_start = max(0, y - perception_range)
        y_end = min(width, y + perception_range + 1)
        
        subsection = self.repo.get_subsection(level_id, x_start, x_end, y_start, y_end)
        if not subsection:
            raise ValueError("Failed to retrieve subsection")
        return subsection