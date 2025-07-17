from typing import Union, Annotated
from pydantic import Field
from app.schemas.concrete_out_schemas import *

UnionEntityOut = Annotated[
    Union[
        HumanOut,
        UserOut,
    ],
    Field(discriminator="type")
]