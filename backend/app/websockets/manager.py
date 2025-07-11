from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.connections: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.connections.append(ws)

    def disconnect(self, ws: WebSocket):
        self.connections.remove(ws)

    async def send(self, message: dict, ws: WebSocket):
        await ws.send_json(message)

    async def broadcast(self, message: dict):
        for connection in self.connections:
            await self.send(message, connection)