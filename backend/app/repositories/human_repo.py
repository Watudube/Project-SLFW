from sqlalchemy.orm import Session
from app.models.humans import Human

class HumanRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, human_id: int) -> Human | None:
        return self.db.query(Human).filter(Human.id == human_id).first()