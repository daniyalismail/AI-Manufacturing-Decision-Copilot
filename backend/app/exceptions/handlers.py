from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.logger import logger
from app.api.schemas import APIErrorResponse, APIErrorDetail
from app.api.exceptions import APIException

async def api_exception_handler(request: Request, exc: APIException):
    logger.error("api_exception", error=exc.message, path=request.url.path, status_code=exc.status_code)
    return JSONResponse(
        status_code=exc.status_code,
        content=APIErrorResponse(
            error=APIErrorDetail(code=exc.code, message=exc.message)
        ).model_dump()
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error("validation_error", error=str(exc.errors()), path=request.url.path)
    return JSONResponse(
        status_code=422,
        content=APIErrorResponse(
            error=APIErrorDetail(code="VALIDATION_ERROR", message=str(exc.errors()))
        ).model_dump()
    )
    
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content=APIErrorResponse(
            error=APIErrorDetail(code="INTERNAL_ERROR", message="Internal Server Error")
        ).model_dump()
    )

def register_exception_handlers(app: FastAPI):
    app.add_exception_handler(APIException, api_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)
