from typing import TypeVar, Generic, Type
from sqlalchemy.ext.asyncio import AsyncSession

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType")
UpdateSchemaType = TypeVar("UpdateSchemaType")

class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, repository):
        self.repository = repository

    async def get(self, db: AsyncSession, id: int):
        return await self.repository.get(db, id)

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
            return None

        return await self.repository.update(
            db,
            db_obj,
            obj_in.model_dump(exclude_unset=True)
        )

    async def delete(self, db: AsyncSession, id: int):
        return await self.repository.delete(db, id)