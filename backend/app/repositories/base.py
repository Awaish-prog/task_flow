from typing import Type, TypeVar, Generic, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

ModelType = TypeVar("ModelType")

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: int) -> Optional[ModelType]:
        result = await db.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()

    async def get_with_lock(self, db: AsyncSession, id: int) -> Optional[ModelType]:
        result = await db.execute(
            select(self.model)
            .where(self.model.id == id)
            .with_for_update()
        )
        return result.scalar_one_or_none()

    async def get_all(self, db: AsyncSession) -> List[ModelType]:
        result = await db.execute(select(self.model))
        return result.scalars().all()

    async def create(self, db: AsyncSession, obj_data: dict) -> ModelType:
        obj = self.model(**obj_data)
        db.add(obj)
        await db.flush()
        await db.refresh(obj)
        return obj

    async def update(
        self,
        db: AsyncSession,
        db_obj: ModelType,
        update_data: dict
    ) -> ModelType:
        for field, value in update_data.items():
            if value is not None:
                setattr(db_obj, field, value)

        await db.flush()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, obj: ModelType) -> None:
        obj.soft_delete()
        await db.flush()