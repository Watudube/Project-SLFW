from .base_schema import BaseOut, BaseIn
from .tile_schema import TileOut, TileOutNoEntity, TileIn

class LevelOut(BaseOut):
    z_index: int
    length: int
    width: int
    tiles: list[TileOut]

class LevelOutNoEntity(BaseOut):
    z_index: int
    length: int
    width: int
    tiles: list[TileOutNoEntity]

class LevelIn(BaseIn):
    z_index: int
    length: int
    width: int
    tiles: list[TileIn]