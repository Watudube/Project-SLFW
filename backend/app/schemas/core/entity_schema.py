from .base_schema import BaseOut, BaseIn, BaseUpdate

class EntityOut(BaseOut):
    type:        str
    label:       str
    description: str
    sprite:      str

class EntityIn(BaseIn):
    type:        str
    label:       str
    description: str
    sprite:      str

class EntityUpdate(BaseUpdate):
    pass