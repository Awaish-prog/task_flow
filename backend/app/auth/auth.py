from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt_auth import verify_token
from fastapi import Depends

security = HTTPBearer()

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token",
        )

    return payload