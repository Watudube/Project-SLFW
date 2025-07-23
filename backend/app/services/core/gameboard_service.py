from .base_service import BaseService
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from app.models.core.gameboard import Gameboard
from app.repositories.core.gameboard_repo import GameboardRepository
from app.models.core.level import Level
from app.models.core.tile import Tile
from app.utils.entity_registry import ENTITY_MODEL_REGISTRY, ENTITY_SCHEMA_REGISTRY
from app.schemas.core.gameboard_schema import GameboardIn
from pydantic import ValidationError

class GameboardService(BaseService[Gameboard, GameboardRepository]):
    def __init__(self, db: Session, model=Gameboard):
        super().__init__(db, model, GameboardRepository)

    def check_gameboard_exists(self) -> Gameboard | None:
        return self.repo.get_empty_gameboard()

    def get_no_entity_gameboard(self) -> Gameboard:
        """
        Provides the gameboard with levels and tiles but without entities
        returns
            - Gameboard: Gameboard object with no entities
        """
        try:
            return self.repo.get_no_entity_gameboard()
        except NoResultFound:
            raise ValueError("There is no gameboard in database")
        except MultipleResultsFound:
            raise ValueError("There are multiple gameboards in database")

    def get_gameboard(self) -> Gameboard:
        """
        Provides the gameboard with all levels, tiles and entities
        Returns
            - Gameboard: Gameboard object
        """
        try:
            return self.repo.get_gameboard()
        except NoResultFound:
            raise ValueError("There is no gameboard in database")
        except MultipleResultsFound:
            raise ValueError("There are multiple gameboards in database")
        
    def delete_gameboard(self) -> None:
        """
        Deletes gameboard
        """
        try:
            gameboard = self.repo.get_gameboard()
        except NoResultFound:
            return
        except MultipleResultsFound:
            raise ValueError("There are multiple gameboards in database")
        self.delete(gameboard)
    
    def build_gameboard(self, gameboard_in: GameboardIn) -> Gameboard:
        """
        build an SQLAlchemy Gameboard object (incl nested data)
        Params:
            - gameboard_in: Pydantic validated gameboard data
        Returns:
            - Gameboard: Populated SQLAlchemy gameboard object
        """
        gameboard = Gameboard(num_levels=gameboard_in.num_levels)
        self.db.add(gameboard)

        for level_data in gameboard_in.levels:
            level = Level(
                z_index = level_data.z_index,
                length = level_data.length,
                width = level_data.width,
                gameboard = gameboard # Sets FK and establishes relationship
            )
            self.db.add(level)
            
            for tile_data in level_data.tiles:
                tile = Tile(
                    type = tile_data.type,
                    x_coord = tile_data.x_coord,
                    y_coord = tile_data.y_coord,
                    is_wall = tile_data.is_wall,
                    sprite = tile_data.sprite,
                    speed = tile_data.speed,
                    level=level
                )
                self.db.add(tile)

                for entity_data in tile_data.entities:
                    entity_type = entity_data.get("type")
                    if not entity_type:
                        raise ValueError("All entities require a 'type'")
                    
                    model = ENTITY_MODEL_REGISTRY.get(entity_type)
                    schema = ENTITY_SCHEMA_REGISTRY.get(entity_type)
                    if not model or not schema:
                        raise ValueError(f"Entity type invalid: {entity_type}")

                    parsed = schema(**entity_data)
                    entity = model(**parsed.model_dump())
                    entity.tile = tile
                    self.db.add(entity)
        return gameboard

    def set_gameboard(self, gameboard_data: dict) -> Gameboard:
        """
        Inserts a gameboard into the db if one doesn't already exist.
        Params
            - gameboard_data: A dictionary containing a gameboard with levels,
              tiles and entities of various subclasses.
        Returns
            - Gameboard: The existing gameboard or the gameboard inserted into
              the database if one doesn't exist.
        """
        try:
            return self.repo.get_gameboard()
        except MultipleResultsFound:
            raise ValueError("There are multiple gameboards in database")
        except NoResultFound:
            try:
                gameboard_in = GameboardIn(**gameboard_data)
            except ValidationError as e:
                raise ValueError(f"Invalid gameboard input: {e}")
            gameboard = self.build_gameboard(gameboard_in)
            try:
                self.db.commit()
            except Exception as e:
                self.db.rollback()
                raise e
            self.db.refresh(gameboard)
            return gameboard