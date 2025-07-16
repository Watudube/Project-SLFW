from .base_service import BaseService
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from app.models.core.gameboard import Gameboard
from app.repositories.core.gameboard_repo import GameboardRepository

class GameboardService(BaseService[Gameboard, GameboardRepository]):
    def __init__(self, db: Session, model=Gameboard):
        super().__init__(db, model, GameboardRepository)

    def get_empty_gameboard(self) -> Gameboard:
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
        