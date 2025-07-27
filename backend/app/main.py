from sqlalchemy.orm import sessionmaker
from app.db.session import engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.apis import *
from app.websockets import game_route
from contextlib import asynccontextmanager
from app.services.gameloop.game_loop_service import GameLoopService
import asyncio

SessionLocal = sessionmaker(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    game_loop = asyncio.create_task(GameLoopService(SessionLocal()).start())
    yield
    game_loop.cancel()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://192.168.1.115:5173",
        "http://192.168.1.142:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(game_route.router)