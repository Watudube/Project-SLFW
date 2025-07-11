from .base_schema import BaseSchema
from .level_schema import EmptyLevelOut

class EmptyGameboardOut(BaseSchema):
    num_levels: int
    levels: list[EmptyLevelOut]