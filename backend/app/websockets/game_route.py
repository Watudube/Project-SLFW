from app.apis.routers.auth_token import auth_tokens
from .manager import ConnectionManager
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.core.gameboard_service import GameboardService
from app.schemas.core.gameboard_schema import GameboardOut
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.session import get_session

def valid(token: str) -> bool:
    return token in auth_tokens

router = APIRouter(prefix="/ws", tags=["ws"],)
manager = ConnectionManager()

@router.websocket("/game/start")
async def game_start(ws: WebSocket, db: Session = Depends(get_session)):
    gameboard_service = GameboardService(db)
    await manager.connect(ws)

    try:
        data = await ws.receive_json()
        if not isinstance(data, dict):
            await manager.send({"error": "Invalid JSON object"}, ws)
            await ws.close(code=1003)
            return
        token = data.pop("userToken", None)
        if not token or not valid(token):
            await ws.close(code=1008, reason="Invalid token")
            return

        empty_gameboard = gameboard_service.get_empty_gameboard()
        initial_gameboard = GameboardOut.model_validate(empty_gameboard)
        await manager.send(initial_gameboard.model_dump(), ws)

    except WebSocketDisconnect:
        return

    except Exception as e:
        await manager.send({"error": f"{str(e)}"}, ws)
        await ws.close(code=1011)
        return
    
    finally:
        manager.disconnect(ws)


@router.websocket("/game")
async def game_ws(ws: WebSocket):
    await manager.connect(ws)

    try:
        while True:
            data = await ws.receive_json()
            token = data.get("userToken")
            if not token or not valid(token):
                await ws.close(code=1008, reason="Invalid token")
                return
            data.pop("userToken")


            if data["type"] == "move":
                await manager.broadcast({
                    "type": "entity_moved",
                    "entityId": data["entityId"],
                    "x": data["x"],
                    "y": data["y"],
                })

    except WebSocketDisconnect:
        manager.disconnect(ws)
        await manager.broadcast({"type": "connection ended"})