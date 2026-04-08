class AppException(Exception):
    def __init__(self, message: str):
        self.message = message


class NotFoundException(AppException):
    def __init__(self, entity: str, id: int):
        self.entity = entity
        self.id = id
        super().__init__(f"{entity} with id {id} not found")


class BadRequestException(AppException):
    pass


class UnauthorizedException(AppException):
    pass


class ForbiddenException(AppException):
    pass


class ConflictException(AppException):
    pass