from ..core.actor_schema import ActorSchema, ActorSchemaUpdate
from typing import Optional

# For returning human data in a response
class HumanOut(ActorSchema):
    id:       int
    hunger:   int
    thirst:   int
    strength: int


class HumanIn(ActorSchema):
    hunger:   int
    thirst:   int
    strength: int


class HumanUpdate(ActorSchemaUpdate):
    hunger: Optional[int]
    thirst: Optional[int]
    strength: Optional[int]