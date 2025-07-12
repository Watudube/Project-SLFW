from app.db.base import Base
from sqlalchemy import Integer, Column

class BaseModel(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True, autoincrement=True)