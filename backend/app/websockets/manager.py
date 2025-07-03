# app/websockets/manager.py
import json
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        self.active.remove(ws)

    async def send_personal(self, msg: dict, ws: WebSocket):
        await ws.send_json(msg)

    async def broadcast(self, msg: dict):
        data = json.dumps(msg)
        for client in self.active:
            await client.send_text(data)