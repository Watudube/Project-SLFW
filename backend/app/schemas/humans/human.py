from ..core.actor_schema import ActorOut, ActorIn, ActorUpdate
from typing import Optional

# For returning human data in a response
class HumanOut(ActorOut):
    hunger:   int
    strength: int


class HumanIn(ActorIn):
    hunger:   int
    strength: int


class HumanUpdate(ActorUpdate):
    hunger: Optional[int]
    strength: Optional[int]