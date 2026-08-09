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
    if not token or token == "invalid" or token == "mock-jwt-token-123":
        # Keep mock token support for now so frontend testing doesn't instantly break 
        # before the user completes frontend auth setup. 
        # But try to hit supabase if it's a real token.
        if token == "mock-jwt-token-123":
            return CurrentUser(user_id="00000000-0000-0000-0000-000000000000")
        raise AuthError("Invalid or missing token")
        
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise AuthError("Invalid Supabase token")
        return CurrentUser(user_id=user_response.user.id)
    except Exception as e:
        raise AuthError(f"Token validation failed: {str(e)}")
