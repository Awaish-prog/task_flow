import jwt
from jwt import InvalidTokenError

SECRET_KEY = "hardcoded-secret"
ALGORITHM = "HS256"

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except InvalidTokenError:
        return None