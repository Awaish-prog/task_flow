from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.api.dependencies import require_auth
from app.db.base import Base
from app.db.database import engine
from app.repositories.filters import _add_soft_delete_filter

def get_application() -> FastAPI:

    application = FastAPI()
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(api_router, prefix="/api/v1", dependencies=[Depends(require_auth)]  )
    
    @application.on_event("startup")
    async def on_startup():
        await init_db()

    return application


app = get_application()

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)