from pydantic import BaseModel

class BaseOut(BaseModel):
    id: int

    # Tells pydantic to treat ORM model as dict
    # Supports serialising object to JSON for api responses
    class Config:
        from_attributes = True
    
class BaseIn(BaseModel):
    class Config:
        from_attributes = True


class BaseUpdate(BaseModel):

    class Config:
        from_attributes = True