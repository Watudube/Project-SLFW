from .base_service import BaseService
from app.models.core.level import Level
from app.models.core.tile import Tile
from app.repositories.core.level_repo import LevelRepository
from sqlalchemy.orm import Session

class LevelService(BaseService[Level, LevelRepository]):
    def __init__(self, db: Session):
        super().__init__(db, Level, LevelRepository)
    
    def get_level(self, level_id: int) -> Level:        
        """
        Provides a level with all tiles and entities included
        Params
            - level_id: id of level
        Returns
            - Level: Level object
        """
        level = self.repo.get_level(level_id)
        if not level:
            raise ValueError(f"Level with ID: {level_id} does not exist")
        return level
    
    def get_empty_base_level(self) -> Level:
        empty_level = self.repo.get_empty_level_with_index(0)
        if not empty_level:
            raise ValueError(f"Level with z_index: 0 does not exist")
        return empty_level
    
    def get_dimensions(self, level_id: int) -> tuple[int, int]:
        """
        Provides level dimensions (length and width)
        Params
            - level_id: id of level
        Returns
            - tuple(length: int, width: int)
        """
        dimensions = self.repo.get_level_dimensions(level_id)
        if not dimensions:
            raise ValueError(f"Level with ID: {level_id} does not exist")
        length, width = dimensions
        return (length, width)

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
        length, width = self.get_dimensions(level_id)
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