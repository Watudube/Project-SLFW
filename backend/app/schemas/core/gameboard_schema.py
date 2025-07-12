from .base_schema import BaseOut, BaseIn
from .level_schema import LevelOut, LevelIn

class GameboardOut(BaseOut):
    num_levels: int
    levels: list[LevelOut]

class GameboardIn(BaseIn):
    num_levels: int
    levels: list[LevelIn]