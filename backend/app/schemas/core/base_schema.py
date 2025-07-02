from pydantic import BaseModel

class BaseSchema(BaseModel):
    id: int

    # Tells pydantic to treat ORM model as dict
    # Supports serialising object to JSON for api responses
    class Config:
        from_attributes = True


class BaseSchemaUpdate(BaseModel):

    class Config:
        from_attributes = True