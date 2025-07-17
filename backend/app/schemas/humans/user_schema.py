from app.schemas.core.base_schema import BaseModel, BaseIn
from .human_schema import HumanOut
from typing import Literal

class UserOut(HumanOut):
    type: Literal["user"]
    description: None

class UserIn(BaseIn):
    username: str
    password: str

class AuthResponse(BaseModel):
    user: UserOut
    token: str