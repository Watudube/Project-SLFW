from fastapi import APIRouter
from uuid import uuid4

router = APIRouter()

@router.post("/auth/token")
def mint_token():
    token = uuid4().hex
    return {"userToken": token}