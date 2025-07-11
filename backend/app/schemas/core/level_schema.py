from .base_schema import BaseSchema
from .tile_schema import EmptyTileOut

class EmptyLevelOut(BaseSchema):
    length: int
    width: int
    
    tiles: list[EmptyTileOut]