from sqlalchemy.orm import with_loader_criteria
from sqlalchemy.orm import Session
from sqlalchemy import event
from app.models.mixins.soft_delete import SoftDeleteMixin

@event.listens_for(Session, "do_orm_execute")
def _add_soft_delete_filter(execute_state):
    if (
        execute_state.is_select
        and not execute_state.execution_options.get("include_deleted", False)
    ):
        execute_state.statement = execute_state.statement.options(
            with_loader_criteria(
                SoftDeleteMixin,
                lambda cls: cls.deleted == False,
                include_aliases=True,
            )
        )