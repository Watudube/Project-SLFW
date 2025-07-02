import json
import uuid
from typing import Dict
from .manager import ConnectionManager
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException

router = APIRouter()

_token_store: Dict[str, int] = {}

@router.post("/auth/token")
def mint_token():
    """
    Return a one-off token to the client.
    In production you'd tie this to a real user/session in your DB.
    """
    token = uuid.uuid4().hex
    _token_store[token] = 1
    return {"userToken": token}

manager = ConnectionManager()

def valid(token: str) -> bool:
    return token in _token_store

@router.websocket("/ws/game")
async def websocket_endpoint(ws: WebSocket):
    await manager.connect(ws)
    manager.active.append(ws)

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
