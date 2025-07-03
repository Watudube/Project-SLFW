from fastapi import APIRouter
from typing import Dict
import uuid

router = APIRouter("/auth")
auth_tokens: Dict[str, int] = {}

@router.post("/token")
def create_token():
    token = uuid.uuid4().hex
    auth_tokens[token] = 1
    return {"userToken": token}