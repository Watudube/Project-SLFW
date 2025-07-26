from sqlalchemy.orm import Session
from app.services.core.gameboard_service import GameboardService
import json
import asyncio

class GameLoopService:
    def __init__(self, db: Session):
        self.db = db
        self.gameboard_service = GameboardService(self.db)

    def load_gameboard(self) -> dict:
        try:
            with open("assets/gameboard_16x16.json", "r", encoding="utf-8") as file:
                return json.load(file)
        except Exception as e:
            raise ValueError(f"There was a problem loading the gameboard: {e}")

    def setup_gameboard(self) -> None:
        if not self.gameboard_service.check_gameboard_exists():
            gameboard = self.load_gameboard()
            self.gameboard_service.set_gameboard(gameboard)

    async def start(self):
        # self.gameboard_service.delete_gameboard()
        self.setup_gameboard()
        while True:
            # await self.world_update()
            await asyncio.sleep(5)
