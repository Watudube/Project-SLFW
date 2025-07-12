from .base_schema import BaseOut, BaseIn
from .tile_schema import TileOut, TileIn

class LevelOut(BaseOut):
    z_index: int
    length: int
    width: int
    tiles: list[TileOut]

class LevelIn(BaseIn):
    z_index: int
    length: int
    width: int
    tiles: list[TileIn]