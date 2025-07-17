from ..core.actor_schema import ActorOut, ActorIn, ActorUpdate
from typing import Literal

class HumanOut(ActorOut):
    type: Literal["human"]

class HumanIn(ActorIn):
    pass

class HumanUpdate(ActorUpdate):
    pass