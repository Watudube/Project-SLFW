from ..core.actor_schema import ActorOut, ActorIn, ActorUpdate
from typing import Literal, Optional

class HumanOut(ActorOut):
    type: Literal["human"]
    name: Optional[str]
    hunger:   int
    strength: int


class HumanIn(ActorIn):
    name: Optional[str]
    hunger:   int
    strength: int


class HumanUpdate(ActorUpdate):
    name: Optional[str]
    hunger: Optional[int]
    strength: Optional[int]