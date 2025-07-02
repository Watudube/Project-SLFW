from fastapi import FastAPI
from app.apis.routers import human
from app.apis.routers import temp_auth

app = FastAPI()

app.include_router(human.router)
app.include_router(temp_auth.router)