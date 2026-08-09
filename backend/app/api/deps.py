from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.api.exceptions import AuthError
from pydantic import BaseModel
import uuid

security = HTTPBearer()

class CurrentUser(BaseModel):
    user_id: str

from app.core.supabase import supabase

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> CurrentUser:
    """
    Verify the incoming JWT token against Supabase Auth.
    """
    token = credentials.credentials
    if not token or token == "invalid":
        raise AuthError("Invalid or missing token")
        
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise AuthError("Invalid Supabase token")
        return CurrentUser(user_id=user_response.user.id)
    except Exception as e:
        error_msg = str(e)
        if "disconnected" in error_msg.lower() or "timeout" in error_msg.lower():
            from app.api.exceptions import APIException
            raise APIException(status_code=503, code="SERVICE_UNAVAILABLE", message="Supabase connection failed. Please try again.")
        raise AuthError(f"Token validation failed: {error_msg}")
