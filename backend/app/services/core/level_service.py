from .base_service import BaseService
from app.models.core.level import Level
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
    
    def get_dimensions(self, level_id: int) -> tuple[int, int]:
        """
        Provides level dimensions (length and width)
        Params
            - level_id: id of level
        Returns
            - tuple(length: int, width: int)
        """
        length, width = self.repo.get_level_dimensions(level_id)
        if not (length and width):
            raise ValueError(f"Level with ID: {level_id} does not exist")
        return (length, width)