from sqlalchemy.orm import Session
from fastapi import WebSocket
from app.websockets.manager import ConnectionManager
from app.services.humans.player_service import PlayerService
from app.schemas.core.tile_schema import PerceptionOut

import asyncio

class PlayerLoopService:
    def __init__(self, ws: WebSocket, db: Session, manager: ConnectionManager):
        self.db = db
        self.ws = ws
        self.manager = manager
        self.player_service = PlayerService(self.db)

    async def start(self, username: str):
        self.player_service.create_player_if_not_exists({"username": username})
        while True:
            await asyncio.sleep(10)
            await self.send_player_perception(username)
    
    async def send_player_perception(self, username: str):
        try:
            player_perception = self.player_service.get_player_perception(username)
            level_segment = PerceptionOut.model_validate({"tiles": player_perception})

            await self.manager.send(
                {
                    "type": "perception_update",
                    "data": {"perception" : level_segment.model_dump()},
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

    async def handle_player_action(self, action, data):
        pass
