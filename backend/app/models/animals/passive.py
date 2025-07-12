from .animal import Animal
from sqlalchemy import Column, Integer, ForeignKey

class Passive(Animal):
    __tablename__ = "passive_animals"

    id = Column(Integer, ForeignKey("animals.id"), primary_key=True)