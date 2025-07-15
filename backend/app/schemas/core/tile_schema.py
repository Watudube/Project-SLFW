from .base_schema import BaseOut, BaseIn
from .entity_schema import EntityOut, EntityIn

class TileOut(BaseOut):
    x_coord: int
    y_coord: int
    type: str
    is_wall: bool
    sprite: str
    speed: int
    entities: list[EntityOut] = []

class TileIn(BaseIn):
    x_coord: int
    y_coord: int
    type: str
    is_wall: bool
    sprite: str
    speed: int
    entities: list[EntityIn] = []