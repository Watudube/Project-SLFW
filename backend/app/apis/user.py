from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_session
from app.schemas.humans.user_schema import UserIn, AuthResponse
from app.services.humans.user_service import UserService
from app.websockets.manager import ConnectionManager

router = APIRouter(prefix="/user", tags=["user"])
manager = ConnectionManager()

@router.post("/create", response_model=AuthResponse)
def create_account(user_in: UserIn, db: Session = Depends(get_session)):
    service = UserService(db)
    if service.check_username_exists(user_in.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    user_in = user_in.model_dump()
    user_in["type"] = "user"
    user_in["label"] = [user_in.username]

    user = service.create_user(user_in)
    token = manager.issue_token(user.id)
    return {"user": user, "token": token}

@router.post("/login", response_model=AuthResponse)
def login(user_in: UserIn, db: Session = Depends(get_session)):
    service = UserService(db)
    user = service.validate_credentials(user_in.username, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password"
        )
    token = manager.issue_token(user.id)
    return {"user": user, "token": token}