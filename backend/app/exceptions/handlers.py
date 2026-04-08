from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.exceptions.response import error_response
from app.exceptions.exceptions import *

def create_error_response(status_code: int, message: str):
    return JSONResponse(
        status_code=status_code,
        content=error_response(message)
    )

def register_exception_handlers(app):

    @app.exception_handler(NotFoundException)
    async def not_found_handler(request: Request, exc: NotFoundException):
        return create_error_response(status.HTTP_404_NOT_FOUND, exc.message)

    @app.exception_handler(BadRequestException)
    async def bad_request_handler(request: Request, exc: BadRequestException):
        return create_error_response(status.HTTP_400_BAD_REQUEST, exc.message)

    @app.exception_handler(ConflictException)
    async def conflict_handler(request: Request, exc: ConflictException):
        return create_error_response(status.HTTP_409_CONFLICT, exc.message)

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        return create_error_response(exc.status_code, exc.detail)

    @app.exception_handler(SQLAlchemyError)
    async def db_exception_handler(request: Request, exc: SQLAlchemyError):
        return create_error_response(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Database error"
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return create_error_response(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "Internal Server Error"
        )