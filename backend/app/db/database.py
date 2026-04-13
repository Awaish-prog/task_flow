from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from typing import Annotated
from fastapi import Depends
import os

# DATABASE_URL = "postgresql+asyncpg://user:password@db:5432/app_db"
DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/app_db"

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
        
Database = Annotated[AsyncSession, Depends(get_db)]