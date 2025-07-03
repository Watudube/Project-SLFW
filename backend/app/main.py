from app.apis.routers import human
from app.websockets import game_route
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.apis.routers import auth_token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(human.router)
app.include_router(auth_token.router)
app.include_router(game_route.router)