from fastapi import WebSocket
import uuid

class ConnectionManager:
    def __init__(self):
        self.connections: dict[WebSocket, dict[str, int]] = {}
        self.unassigned_tokens: dict[str, int] = {}
        self.unassigned_websockets: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.unassigned_websockets.append(ws)

    def disconnect(self, ws: WebSocket) -> None:
        if self.connections.get(ws):
            self.connections.pop(ws)
            return
        try:
            self.unassigned_websockets.remove(ws)
        except Exception as e:
            raise ValueError(f"Cannot disconnect a non-existent websocket {e}")

    async def send(self, message: dict, ws: WebSocket):
        await ws.send_json(message)

    async def broadcast(self, message: dict) -> None:
        for ws in self.connections:
            await self.send(message, ws)
        
    def get_connections(self):
        return self.connections

    def issue_token(self, user_id: int) -> str:
        token = uuid.uuid4().hex
        self.unassigned_tokens[token] = user_id
        return token

    def validate_token(self, token: str, ws: WebSocket) -> bool:
        connection = self.connections.get(ws)
        if isinstance(connection, dict):
            return connection.get(token) or self.unassigned_tokens.get(token)

    def assign_connection(self, ws: WebSocket, token: str) -> None:
        self.unassigned_websockets.remove(ws)
        id = self.unassigned_tokens.pop(token)
        self.connections[ws] = {token: id}