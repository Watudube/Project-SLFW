from typing import Generic, Type, TypeVar
from app.models.humans.player import Player
from app.repositories.humans.player_repo import PlayerRepository
from .human_service import HumanService
from sqlalchemy.orm import Session
from app.models.core.tile import Tile
from app.services.core.tile_service import TileService
from app.services.core.level_service import LevelService

M = TypeVar("M", bound=Player)
R = TypeVar("R", bound=PlayerRepository)

class PlayerService(HumanService[M, R], Generic[M, R]):
    def __init__(self, db: Session, model: Type[M] = Player, repo_class: Type[R] = PlayerRepository):
        super().__init__(db, model, repo_class)

    def find_safe_spawn_tile(self) -> int:
        level_service = LevelService(self.db)
        level = level_service.get_empty_base_level()
        x_coord = (level.length + 1) // 2
        y_coord = (level.width + 1) // 2
        tile_service = TileService(self.db)
        tile = tile_service.get_empty_tile_with_coords(level.id, x_coord, y_coord)
        if tile:
            if not tile.is_wall:
                return tile.id
        # Implement fibonacci sequence

    def create_player(self, player_in: dict) -> Player:
        player_in["tile_id"] = self.find_safe_spawn_tile()
        player_in["type"] = "player"
        player_in["label"] = player_in["username"]
        player_in["description"] = "Fuck off"
        player_in["sprite"] = "player"
        return self.create(player_in)

    def get_player(self, username: str) -> Player:
        player = self.repo.get_player(username)
        if not player:
            raise ValueError(f"Player: {username} not found")
        return player
    
    def check_player_exists(self, username: int) -> Player | None:
        return self.repo.get_player(username)

    def get_player_perception(self, username: int) -> list[Tile]:
        player = self.get_player(username)
        tile = TileService(self.db).get_empty_tile(player.tile_id)
        return LevelService(self.db).get_subsection(
            tile.level_id,
            tile.x_coord,
            tile.y_coord,
            player.perception_range
        )