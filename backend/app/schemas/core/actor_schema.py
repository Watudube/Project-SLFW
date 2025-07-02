from .entity import EntitySchema, EntitySchemaUpdate
from typing import Optional

class ActorSchema(EntitySchema):
    health:           int
    speed:            int
    perception_range: int


class ActorSchemaUpdate(EntitySchemaUpdate):
    health: Optional[int]
    speed: Optional[int]
    perception_range: Optional[int]