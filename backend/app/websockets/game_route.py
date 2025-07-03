from app.apis.routers.auth_token import auth_tokens
from .manager import ConnectionManager
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

def valid(token: str) -> bool:
    return token in auth_tokens

router = APIRouter("/ws")
manager = ConnectionManager()

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