"""Security utilities: password hashing, timed tokens, and auth decorators.

Follows subject constraints:
- Passwords hashed with bcrypt.
- Timed tokens for email verification and password resets using itsdangerous.
- Session-based authentication via Flask signed cookies.
"""

from functools import wraps
from typing import Any, Callable

import bcrypt
from flask import current_app, g, jsonify, session
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from app.db import query_read


def hash_password(password: str) -> str:
    """Hash a plaintext password with bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def check_password(password: str, hashed: str) -> bool:
    """Verify a plaintext password against a bcrypt hash."""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def _get_serializer() -> URLSafeTimedSerializer:
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"])


def generate_email_verification_token(user_id: str, email: str) -> str:
    """Generate a timed URL-safe token for email verification."""
    s = _get_serializer()
    return s.dumps({"user_id": user_id, "email": email}, salt="email-verification")


def verify_email_verification_token(
    token: str, max_age_seconds: int = 86400
) -> dict[str, Any] | None:
    """Verify an email verification token (default expiry: 24h)."""
    s = _get_serializer()
    try:
        data = s.loads(token, salt="email-verification", max_age=max_age_seconds)
        if isinstance(data, dict) and "user_id" in data and "email" in data:
            return data
    except (BadSignature, SignatureExpired):
        return None
    return None


def generate_password_reset_token(user_id: str, email: str) -> str:
    """Generate a timed URL-safe token for password resets."""
    s = _get_serializer()
    return s.dumps({"user_id": user_id, "email": email}, salt="password-reset")


def verify_password_reset_token(
    token: str, max_age_seconds: int = 3600
) -> dict[str, Any] | None:
    """Verify a password reset token (default expiry: 1h)."""
    s = _get_serializer()
    try:
        data = s.loads(token, salt="password-reset", max_age=max_age_seconds)
        if isinstance(data, dict) and "user_id" in data and "email" in data:
            return data
    except (BadSignature, SignatureExpired):
        return None
    return None


def require_auth(f: Callable[..., Any]) -> Callable[..., Any]:
    """Decorator to enforce that the request comes from an authenticated user."""

    @wraps(f)
    def decorated_function(*args: Any, **kwargs: Any) -> Any:
        user_id = session.get("user_id")
        if not user_id:
            return jsonify(error="Authentication required"), 401

        results = query_read(
            "MATCH (u:User {id: $id}) RETURN u",
            id=user_id,
        )
        if not results:
            session.clear()
            return jsonify(error="Authentication required"), 401

        user_data = results[0]["u"]
        g.current_user = user_data
        return f(*args, **kwargs)

    return decorated_function


def require_verified(f: Callable[..., Any]) -> Callable[..., Any]:
    """Decorator to enforce that the authenticated user has verified their email."""

    @wraps(f)
    @require_auth
    def decorated_function(*args: Any, **kwargs: Any) -> Any:
        if not g.current_user.get("verified", False):
            return jsonify(error="Email verification required"), 403
        return f(*args, **kwargs)

    return decorated_function
