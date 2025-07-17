# Schemas for lowest level relations. These Avoiding circular imports without
# creating bloat in other files (entity_union_schema)
from app.schemas.humans.human_schema import HumanOut
from app.schemas.humans.user_schema import UserOut