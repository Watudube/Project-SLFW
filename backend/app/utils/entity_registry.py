from app.models import *
from app.schemas.core.entity_schema import EntityIn
from app.schemas.concrete_in_schemas import *

ENTITY_MODEL_REGISTRY: dict[str, type[Entity]] = {
    "human": Human,
    "player": Player,
}

ENTITY_SCHEMA_REGISTRY: dict[str, type[EntityIn]] = {
    "human": HumanIn,
    "player": PlayerIn
}