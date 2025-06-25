from pydantic import BaseModel

# For creating a new human
class HumanCreate(BaseModel):
    name: str
    age: int

# For returning human data in a response
class HumanOut(HumanCreate):
    id: int

    # Tells pydantic to treat ORM model as dict
    class Config:
        orm_mode = True
