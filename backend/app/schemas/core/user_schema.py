from app.schemas.core.base_schema import BaseModel, BaseIn

class UserIn(BaseIn):
    username: str
    password: str

class AuthResponse(BaseModel):
    token: str