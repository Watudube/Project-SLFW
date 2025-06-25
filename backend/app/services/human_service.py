from sqlalchemy.orm import Session
from app.repositories.human_repo import HumanRepository
from app.models.humans import Human

class HumanService:
    def __init__(self, db: Session):
        self.repo = HumanRepository(db)

    def get_human(self, human_id: int) -> Human:
        human = self.repo.get_by_id(human_id)
        if not human:
            raise ValueError(f'Human {human_id} does not exist')
        return human