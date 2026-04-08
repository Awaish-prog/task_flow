from typing import Any

def error_response(message: str):
    return {
        "success": False,
        "message": message,
        "data": None
    }