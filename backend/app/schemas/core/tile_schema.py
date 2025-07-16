from .base_schema import BaseOut, BaseIn
from typing import Any
from pydantic import Field
from app.utils.entity_union_schema import UnionEntityOut

class TileOut(BaseOut):
    x_coord: int
    y_coord: int
    type: str
    is_wall: bool
    sprite: str
    speed: int
    entities: list[UnionEntityOut] = Field(default_factory=list)

class TileIn(BaseIn):
    x_coord: int
    y_coord: int
    type: str
    is_wall: bool
    sprite: str
    speed: int
    entities: list[dict[str, Any]] = Field(default_factory=list)