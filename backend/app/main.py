from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.db.base import Base
from app.db.database import engine

def get_application() -> FastAPI:

    application = FastAPI()
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # allow all origins
        allow_credentials=True,
        allow_methods=["*"],  # allow all HTTP methods
        allow_headers=["*"],  # allow all headers
    )

    application.include_router(api_router, prefix="/api/v1")
    
    @application.on_event("startup")
    async def on_startup():
        await init_db()

    return application


app = get_application()

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)