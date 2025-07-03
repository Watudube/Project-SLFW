from .base_schema import BaseSchema, BaseSchemaUpdate
from typing import Optional

class EntitySchema(BaseSchema):
    name:        str
    label:       str
    description: str
    x_coord:     int
    y_coord:     int


class EntitySchemaUpdate(BaseSchemaUpdate):
    name: Optional[str]
    label: Optional[str]
    description: Optional[str]
    x_coord: Optional[int]
    y_coord: Optional[int]