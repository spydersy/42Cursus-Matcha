"""Auth routes: registration, email verification, login/logout, and password resets.

Strictly follows subject constraints:
- Parameterized Cypher queries only.
- Hand-written validation (validation.py).
- Passwords hashed with bcrypt (security.py).
- Session stored in signed httpOnly cookies.
"""

from datetime import datetime, timezone
import uuid
from typing import Any

from flask import Blueprint, g, jsonify, request, session

from app.db import query_read, query_write
from app.utils.email import send_password_reset_email, send_verification_email
from app.utils.security import (
    check_password,
    generate_email_verification_token,
    generate_password_reset_token,
    hash_password,
    require_auth,
    verify_email_verification_token,
    verify_password_reset_token,
)
from app.utils.validation import (
    validate_email,
    validate_name,
    validate_password,
    validate_username,
)

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _format_user(u: dict[str, Any]) -> dict[str, Any]:
    """Format User node dict for client response (omits sensitive internal fields)."""
    return {
        "id": u["id"],
        "username": u["username"],
        "email": u["email"],
        "first_name": u["first_name"],
        "last_name": u["last_name"],
        "verified": bool(u.get("verified", False)),
        "created_at": u.get("created_at"),
    }


@bp.post("/register")
def register() -> tuple[Any, int]:
    """Register a new user account."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Invalid request payload"), 400

    username = data.get("username")
    email = data.get("email")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    password = data.get("password")

    # Hand-written input validations
    ok, err = validate_username(username)
    if not ok:
        return jsonify(error=err), 400

    ok, err = validate_email(email)
    if not ok:
        return jsonify(error=err), 400

    ok, err = validate_name(first_name, "First name")
    if not ok:
        return jsonify(error=err), 400

    ok, err = validate_name(last_name, "Last name")
    if not ok:
        return jsonify(error=err), 400

    ok, err = validate_password(password)
    if not ok:
        return jsonify(error=err), 400

    clean_username = username.strip().lower()
    clean_email = email.strip().lower()
    clean_first_name = first_name.strip()
    clean_last_name = last_name.strip()

    # Check for existing username or email
    existing = query_read(
        "MATCH (u:User) WHERE u.username = $username OR u.email = $email "
        "RETURN u.username AS username, u.email AS email",
        username=clean_username,
        email=clean_email,
    )
    if existing:
        if existing[0]["username"] == clean_username:
            return jsonify(error="Username is already taken"), 409
        return jsonify(error="Email is already registered"), 409

    user_id = str(uuid.uuid4())
    pw_hash = hash_password(password)
    now_iso = datetime.now(timezone.utc).isoformat()

    # Parameterized Cypher insertion
    query_write(
        """
        CREATE (u:User {
            id: $id,
            username: $username,
            email: $email,
            first_name: $first_name,
            last_name: $last_name,
            password_hash: $password_hash,
            verified: false,
            gender: null,
            sexual_preference: 'bisexual',
            bio: '',
            birthdate: null,
            latitude: null,
            longitude: null,
            fame_rating: 0,
            online: false,
            last_seen: $now,
            created_at: $now
        })
        RETURN u
        """,
        id=user_id,
        username=clean_username,
        email=clean_email,
        first_name=clean_first_name,
        last_name=clean_last_name,
        password_hash=pw_hash,
        now=now_iso,
    )

    token = generate_email_verification_token(user_id, clean_email)
    send_verification_email(clean_email, clean_username, token)

    return (
        jsonify(
            message="Registration successful! Please check your email to verify your account."
        ),
        201,
    )


@bp.post("/verify-email")
def verify_email() -> tuple[Any, int]:
    """Confirm a user's email using the token received in the verification link."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict) or "token" not in data:
        return jsonify(error="Verification token is required"), 400

    token = data["token"]
    payload = verify_email_verification_token(token)
    if not payload:
        return jsonify(error="Invalid or expired verification link"), 400

    results = query_write(
        """
        MATCH (u:User {id: $id, email: $email})
        SET u.verified = true
        RETURN u
        """,
        id=payload["user_id"],
        email=payload["email"],
    )

    if not results:
        return jsonify(error="User not found"), 404

    return jsonify(message="Email verified successfully. You can now log in."), 200


@bp.post("/resend-verification")
def resend_verification() -> tuple[Any, int]:
    """Resend email verification link."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict) or "email" not in data:
        return jsonify(error="Email is required"), 400

    email = str(data["email"]).strip().lower()
    results = query_read(
        "MATCH (u:User {email: $email}) RETURN u",
        email=email,
    )

    if results:
        user = results[0]["u"]
        if not user.get("verified", False):
            token = generate_email_verification_token(user["id"], user["email"])
            send_verification_email(user["email"], user["username"], token)

    return (
        jsonify(
            message="If an unverified account exists with that email, a verification link has been sent."
        ),
        200,
    )


@bp.post("/login")
def login() -> tuple[Any, int]:
    """Authenticate user and establish session cookie."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Invalid request payload"), 400

    identifier = data.get("username", "")
    password = data.get("password", "")

    if not identifier or not password or not isinstance(identifier, str) or not isinstance(password, str):
        return jsonify(error="Username and password are required"), 400

    clean_identifier = identifier.strip().lower()

    results = query_read(
        "MATCH (u:User) WHERE u.username = $ident OR u.email = $ident RETURN u",
        ident=clean_identifier,
    )

    if not results:
        return jsonify(error="Invalid username or password"), 401

    user = results[0]["u"]

    if not check_password(password, user.get("password_hash", "")):
        return jsonify(error="Invalid username or password"), 401

    if not user.get("verified", False):
        return (
            jsonify(
                error="Please verify your email before logging in.",
                unverified=True,
                email=user["email"],
            ),
            403,
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    query_write(
        "MATCH (u:User {id: $id}) SET u.online = true, u.last_seen = $now RETURN u",
        id=user["id"],
        now=now_iso,
    )

    session["user_id"] = user["id"]
    return jsonify(user=_format_user(user)), 200


@bp.post("/logout")
def logout() -> tuple[Any, int]:
    """End the authenticated session."""
    user_id = session.get("user_id")
    if user_id:
        now_iso = datetime.now(timezone.utc).isoformat()
        query_write(
            "MATCH (u:User {id: $id}) SET u.online = false, u.last_seen = $now RETURN u",
            id=user_id,
            now=now_iso,
        )
    session.clear()
    return jsonify(message="Logged out successfully"), 200


@bp.get("/me")
@require_auth
def get_current_user() -> tuple[Any, int]:
    """Return the currently authenticated user's account details."""
    return jsonify(user=_format_user(g.current_user)), 200


@bp.post("/forgot-password")
def forgot_password() -> tuple[Any, int]:
    """Request a password reset email."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict) or "email" not in data:
        return jsonify(error="Email is required"), 400

    email = str(data["email"]).strip().lower()
    results = query_read(
        "MATCH (u:User {email: $email}) RETURN u",
        email=email,
    )

    if results:
        user = results[0]["u"]
        token = generate_password_reset_token(user["id"], user["email"])
        send_password_reset_email(user["email"], user["username"], token)

    return (
        jsonify(
            message="If an account exists with that email, a password reset link has been sent."
        ),
        200,
    )


@bp.post("/reset-password")
def reset_password() -> tuple[Any, int]:
    """Reset password using token from reset email."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Invalid request payload"), 400

    token = data.get("token")
    password = data.get("password")

    if not token or not isinstance(token, str):
        return jsonify(error="Reset token is required"), 400

    ok, err = validate_password(password)
    if not ok:
        return jsonify(error=err), 400

    payload = verify_password_reset_token(token)
    if not payload:
        return jsonify(error="Invalid or expired password reset link"), 400

    new_hash = hash_password(password)
    results = query_write(
        """
        MATCH (u:User {id: $id, email: $email})
        SET u.password_hash = $password_hash
        RETURN u
        """,
        id=payload["user_id"],
        email=payload["email"],
        password_hash=new_hash,
    )

    if not results:
        return jsonify(error="User not found"), 404

    return (
        jsonify(
            message="Password reset successfully! You can now log in with your new password."
        ),
        200,
    )
