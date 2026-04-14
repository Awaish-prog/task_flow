from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from typing import Annotated
from fastapi import Depends
import os
from dotenv import load_dotenv

load_dotenv() 


def get_env(key: str, default: str) -> str:
    return os.getenv(key, default)

USER_NAME = get_env("USER_NAME", "user")
PASSWORD = get_env("PASSWORD", "password")
HOST = get_env("DATABASE", "localhost")
PORT = get_env("PORT", "5432")
DB_NAME = get_env("DATABASE_NAME", "app_db")

DATABASE_URL = (
    f"postgresql+asyncpg://{USER_NAME}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}"
)

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)

async_session_maker = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with async_session_maker() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise


Database = Annotated[AsyncSession, Depends(get_db)]