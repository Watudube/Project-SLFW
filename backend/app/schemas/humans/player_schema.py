from .human_schema import HumanOut, HumanIn
from typing import Literal

class PlayerOut(HumanOut):
    type: Literal["player"]

class PlayerIn(HumanIn):
    username: str