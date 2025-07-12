from .base_schema import BaseOut, BaseIn, BaseUpdate

class EntityOut(BaseOut):
    name:        str
    label:       str
    description: str
    sprite:      str

class EntityIn(BaseIn):
    name:        str
    label:       str
    description: str
    sprite:      str

class EntityUpdate(BaseUpdate):
    pass