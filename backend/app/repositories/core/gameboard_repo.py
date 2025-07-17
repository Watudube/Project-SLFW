from .base_repo import BaseRepository
from sqlalchemy.orm import Session, selectinload, noload
from app.models.core.gameboard import Gameboard
from app.models.core.level import Level
from app.models.core.tile import Tile

class GameboardRepository(BaseRepository):
    def __init__(self, db: Session, model: Gameboard = Gameboard):
        super().__init__(db, model)
    
    def get_gameboard(self) -> Gameboard:
        return (
            self.db.query(Gameboard)
            .options(
                selectinload(Gameboard.levels)
                .selectinload(Level.tiles)
                .selectinload(Tile.entities)
            )
            .one()
        )
    
    def get_no_entity_gameboard(self) -> Gameboard:
        return (
            self.db.query(Gameboard)
            .options(
                 selectinload(Gameboard.levels)
                .selectinload(Level.tiles)
                .options(noload(Tile.entities))
            )
            .one()
        )