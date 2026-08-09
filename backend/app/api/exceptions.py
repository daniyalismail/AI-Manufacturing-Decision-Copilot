from fastapi import Request
from fastapi.responses import JSONResponse
from app.api.schemas import APIErrorResponse, APIErrorDetail

class APIException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code

class NotFoundError(APIException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__("NOT_FOUND", message, 404)

class AuthError(APIException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__("AUTH_REQUIRED", message, 401)

class ValidationError(APIException):
    def __init__(self, message: str = "Validation failed"):
        super().__init__("VALIDATION_ERROR", message, 422)

async def api_exception_handler(request: Request, exc: APIException):
    return JSONResponse(
        status_code=exc.status_code,
        content=APIErrorResponse(
            error=APIErrorDetail(code=exc.code, message=exc.message)
        ).model_dump()
    )

async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=APIErrorResponse(
            error=APIErrorDetail(code="INTERNAL_ERROR", message=str(exc))
        ).model_dump()
    )
