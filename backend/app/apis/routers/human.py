from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.humans.human import HumanOut, HumanIn
from app.services.humans.human_service import HumanService
from app.db.session import get_session

# APIRouter to modularise "humans" based endpoints
router = APIRouter(prefix="/humans", tags=["Humans"])

# Route to create a human.
@router.post("/create", response_model=HumanOut)
def create_human(human: HumanIn, db: Session = Depends(get_session)):
    service = HumanService(db)
    try:
        return service.create(human.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Route to retreive a human.
@router.get("/{human_id}", response_model=HumanOut)
def get_human(human_id: int, db: Session = Depends(get_session)):
    service = HumanService(db)
    try:
        return service.get(human_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
