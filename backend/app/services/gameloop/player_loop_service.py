import asyncio

from app.models.core.tile import Tile
from app.schemas.core.tile_schema import PerceptionOut
from app.services.core.level_service import LevelService
from app.services.core.tile_service import TileService
from app.services.humans.player_service import PlayerService
from app.websockets.manager import ConnectionManager
from fastapi import WebSocket
from sqlalchemy.orm import Session


class PlayerLoopService:
    def __init__(self, ws: WebSocket, db: Session, manager: ConnectionManager):
        self.db = db
        self.ws = ws
        self.manager = manager
        self.player_service = PlayerService(self.db)
        self.level_service = LevelService(self.db)
        self.tile_service = TileService(self.db)
        self.username = None

    async def start(self, username: str):
        self.username = username
        self.player_service.create_player_if_not_exists({"username": self.username})
        while True:
            await asyncio.sleep(1)
            await self.send_player_perception()

    async def send_player_perception(self):
        try:
            player_perception = self.player_service.get_player_perception(self.username)
            level_segment = PerceptionOut.model_validate({"tiles": player_perception})

            await self.manager.send(
                {
                    "type": "perception_update",
                    "data": {"perception": level_segment.model_dump()},
                    "status": "success",
                },
                self.ws,
            )
        except Exception as e:
            await self.manager.send(
                {
                    "type": "perception_update",
                    "error": f"Failed to load level segment: {str(e)}",
                    "status": "error",
                },
                self.ws,
            )

    async def handle_player_move(self, data: dict) -> None:
        direction = data.get("direction")
        player = self.player_service.get_player(self.username)
        current_tile: Tile = player.tile

        x, y = current_tile.x_coord, current_tile.y_coord
        match direction:
            case "north":
                y -= 1
            case "east":
                x += 1
            case "south":
                y += 1
            case "west":
                x -= 1
            case _:
                await self.manager.send(
                    {
                        "type": "error",
                        "error": f"Player attempted to move in unknown direction: {direction}",
                        "status": "error",
                    },
                    self.ws,
                )
        target_tile = self.tile_service.get_empty_tile_with_coords(
            current_tile.level_id, x, y
        )
        if not target_tile or target_tile.is_wall:
            return  # Want to ignore invalid movements rather than crash out
        player.tile_id = target_tile.id
        self.player_service.commit_and_refresh(player)

    async def handle_player_action(self, action: str, data: dict):
        match action:
            case "move":
                await self.handle_player_move(data)
            case _:
                await self.manager.send(
                    {
                        "type": "error",
                        "error": f"Player attempted unknown action: {action}",
                        "status": "error",
                    },
                    self.ws,
                )

    async def move_player_offline(self) -> None:
        """
        When a player disconnects, move them to a designated tile
        Currently assuming the designated tile is on ground level (z_index=0)
        at length+100, width+100
        """
        player = self.player_service.get_player(self.username)
        current_tile: Tile = player.tile
        level = self.level_service.get_empty_base_level()
        target_tile = self.tile_service.get_empty_tile_with_coords(
            level.id, level.length + 100, level.width + 100
        )
        if not target_tile:
            raise ValueError("Failed to find target tile for offline player")
        player.tile_id = target_tile.id
        player.relog_tile_id = current_tile.id
        self.player_service.commit_and_refresh(player)
