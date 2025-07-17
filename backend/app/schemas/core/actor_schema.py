from .entity_schema import EntityOut, EntityIn, EntityUpdate
from typing import Optional

class ActorOut(EntityOut):
    health:           int
    speed:            int
    perception_range: int
    hunger:   int
    strength: int

class ActorIn(EntityIn):
    health:           int
    speed:            int
    perception_range: int
    hunger:   int
    strength: int


class ActorUpdate(EntityUpdate):
    health: Optional[int]
    speed: Optional[int]
    perception_range: Optional[int]
    hunger: Optional[int]
    strength: Optional[int]