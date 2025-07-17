from sqlalchemy.orm import Session
from typing import TypeVar, Generic
from .entity_service import EntityService
from app.models.core.actor import Actor
from app.repositories.core.actor_repo import ActorRepository
from app.models.core.tile import Tile
from .tile_service import TileService

M = TypeVar("M", bound=Actor)
R = TypeVar("R", bound=ActorRepository)

class ActorService(EntityService[M, R], Generic[M, R]):
    def __init__(self, db: Session, model: type[M], repo_class: type[R]):
        super().__init__(db, model, repo_class)

    def get_perception(self, actor_id: int) -> list[Tile]:
        """
        Provides all the tiles and entities that an actor can see within their
        range of vision
        Params:
            - actor_id: id of the actor whose perception we are checking
        returns:
            - list[Tile]: A list of tiles (containing entities) within range of the actor
        """
        actor = self.get(actor_id)
        tile_service = TileService(self.db)
        tile = tile_service.get_tile(actor.tile_id)
        return tile_service.get_subsection(
            tile.level_id,
            tile.x_coord,
            tile.y_coord,
            actor.perception_range
        )