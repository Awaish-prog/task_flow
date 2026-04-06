from sqlalchemy import Column, Boolean

class SoftDeleteMixin:
    deleted = Column(Boolean, default=False, nullable=False)
    
    def soft_delete(self):
        self.deleted = True