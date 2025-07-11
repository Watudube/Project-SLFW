from .base_schema import BaseSchema

class EmptyTileOut(BaseSchema):
    x_coord: int
    y_coord: int
    type: str
    is_wall: bool
    sprite: str
    speed: int