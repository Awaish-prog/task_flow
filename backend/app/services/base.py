from typing import TypeVar, Generic, Type
from sqlalchemy.ext.asyncio import AsyncSession
from app.exceptions.handlers import NotFoundException

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType")
UpdateSchemaType = TypeVar("UpdateSchemaType")

class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, repository):
        self.repository = repository

    async def get(self, db: AsyncSession, id: int):
        db_obj = await self.repository.get(db, id)
        if not db_obj:
            raise NotFoundException(self.repository.model.__name__, id)
        
        return db_obj

    async def get_all(self, db: AsyncSession):
        return await self.repository.get_all(db)

    async def create(self, db: AsyncSession, obj_in: CreateSchemaType):
        return await self.repository.create(db, obj_in.model_dump())

    async def update(
        self,
        db: AsyncSession,
        id: int,
        obj_in: UpdateSchemaType
    ):
        db_obj = await self.repository.get(db, id)
        if not db_obj:
            raise NotFoundException(self.repository.model.__name__, id)

        return await self.repository.update(
            db,
            db_obj,
            obj_in.model_dump(exclude_unset=True)
        )

    async def delete(self, db: AsyncSession, id: int) -> None:
        obj = await self.get(db, id)

        if not obj:
            raise NotFoundException(self.repository.model.__name__, id)

        await self.repository.delete(db, obj)