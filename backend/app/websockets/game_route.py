from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from app.apis.user import manager
from sqlalchemy.orm import Session
from app.db.session import get_session
from app.schemas.core.gameboard_schema import GameboardOut
from app.schemas.core.level_schema import LevelOut
from app.services.core.gameboard_service import GameboardService
from app.services.humans.user_service import UserService
import asyncio

router = APIRouter(
    prefix="/ws",
    tags=["ws"],
)

@router.websocket("/game")
async def game_ws(ws: WebSocket, db: Session = Depends(get_session)):
    await manager.connect(ws)
    gameboard_service = GameboardService(db)

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
                        manager.assign_connection(ws, token)
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
                else:
                    await manager.send(
                        {
                            "type": "join_game_response",
                            "error": "You must send a message type 'join_game' before other actions",
                            "status": "error",
                        },
                        ws
                    )
                    await ws.close(code=1008, reason="join_game required before other actions")
                    manager.disconnect(ws)
                    return

            else:
                if message_type == "player_action":
                    action = message.get("action")
                    action_data = message.get("data")

                    if action == "move":
                        await manager.broadcast(
                            {
                                "type": "entity_update",
                                "entityId": action_data.get("entityId"),
                                "x": action_data.get("x"),
                                "y": action_data.get("y"),
                            }
                        )
                else:
                    await manager.send(
                        {
                            "type": "error",
                            "message": f"Unknown message type: {message_type}",
                            "status": "error",
                        },
                        ws,
                    )
                    continue

    except WebSocketDisconnect:
        manager.disconnect(ws)
        await manager.broadcast({"type": "player_disconnected"})
    except Exception as e:
        await manager.send({"error": f"Server error: {str(e)}"}, ws)
        await ws.close(code=1011)
        manager.disconnect(ws)
    finally:
        if periodic_task:
            periodic_task.cancel()