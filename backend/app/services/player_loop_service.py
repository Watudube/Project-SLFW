from sqlalchemy.orm import Session
from fastapi import WebSocket
from app.websockets.manager import ConnectionManager
from app.services.humans.player_service import PlayerService
from app.schemas.core.level_schema import LevelOut

import asyncio

class PlayerLoopService:
    def __init__(self, ws: WebSocket, db: Session, manager: ConnectionManager):
        self.db = db
        self.ws = ws
        self.manager = manager

    async def start(self, username: str):
        player_service = PlayerService(self.db)
        while True:
            await self.send_player_perception(username, player_service)
            await asyncio.sleep(5)
    
    async def send_player_perception(self, username: str, player_service: PlayerService):
        try:
            player_perception = player_service.get_player_perception(username)
            level_segment = LevelOut.model_validate(player_perception)

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
