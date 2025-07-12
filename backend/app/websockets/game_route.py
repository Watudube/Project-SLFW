from app.apis.routers.auth_token import auth_tokens
from sqlalchemy.orm import Session
from .manager import ConnectionManager

router = APIRouter(
    prefix="/ws",
    tags=["ws"],
)
manager = ConnectionManager()

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
            if not token or not valid(token):
                await ws.close(code=1008, reason="Invalid token")
                return

            message_type = message.get("type")

            if message_type == "join_game":
                try:
                    empty_gameboard = gameboard_service.get_empty_gameboard()
                    initial_gameboard = EmptyGameboardOut.model_validate(
                        empty_gameboard
                    )

                    await manager.send(
                        {
                            "type": "join_game_response",
                            "data": initial_gameboard.model_dump(),
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

            elif message_type == "player_action":
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
                    },
                    ws,
                )

    except WebSocketDisconnect:
        manager.disconnect(ws)
        await manager.broadcast({"type": "player_disconnected"})
    except Exception as e:
        await manager.send({"error": f"Server error: {str(e)}"}, ws)
        await ws.close(code=1011)
    finally:
        manager.disconnect(ws)
