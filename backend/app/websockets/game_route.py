from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from app.websockets.manager import manager
from sqlalchemy.orm import Session
from app.db.session import get_session
from app.services.game_loop import GameLoopService
from app.schemas.core.gameboard_schema import GameboardOut
from app.schemas.humans.player_schema import PlayerIn
from app.schemas.core.level_schema import LevelOut
from app.services.core.gameboard_service import GameboardService
from app.services.humans.player_service import PlayerService
import asyncio

router = APIRouter(
    prefix="/ws",
    tags=["ws"],
)

@router.websocket("/game")
async def game_ws(ws: WebSocket, db: Session = Depends(get_session)):
    await manager.connect(ws)
    game_loop = GameLoopService(ws, db, manager)
    
    try:
        while True:
            message = await ws.receive_json()

            if not isinstance(message, dict):
                await manager.send({"error": "Invalid JSON object"}, ws)
                continue

            token = message.get("userToken")
            if not token or not manager.validate_token(token, ws):
                await ws.close(code=1008, reason="Invalid token")
                return
            
            connections = manager.get_connections()
            message_type = message.get("type")

            if not connections.get(ws):
                if message_type == "join_game":
                    try:
                        gameboard_service = GameboardService(db)
                        empty_gameboard = gameboard_service.get_empty_gameboard()
                        initial_gameboard = GameboardOut.model_validate(empty_gameboard)
                        await manager.send(
                            {
                                "type": "join_game_response",
                                "data": {"initial_gameboard" : initial_gameboard.model_dump()},
                                "status": "success",
                            },
                            ws,
                        )
                    except Exception as e:
                        await manager.send(
                            {
                                "type": "join_game_response",
                                "error": f"Failed to load gameboard: {str(e)}",
                                "status": "error",
                            },
                            ws,
                        )
                        await ws.close(code=1008, reason="join_game required before other actions")
                        manager.disconnect(token)
                        return
                    username = manager.assign_connection(ws, token)
                    periodic_task = asyncio.create_task(game_loop.start(username))

    except WebSocketDisconnect:
        manager.disconnect(ws)
        await manager.broadcast({"type": "player_disconnected"})
    except Exception as e:
        await manager.send({"error": f"Server error: {str(e)}"}, ws)
        await ws.close(code=1011)
        manager.disconnect(ws)
    finally:
        periodic_task.cancel()