from .base_schema import BaseOut, BaseIn
from .level_schema import LevelOut, LevelOutNoEntity, LevelIn

class GameboardOut(BaseOut):
    num_levels: int
    levels: list[LevelOut]

class GameboardOutNoEntity(BaseOut):
    num_levels: int
    levels: list[LevelOutNoEntity]

class GameboardIn(BaseIn):
    num_levels: int
    levels: list[LevelIn]