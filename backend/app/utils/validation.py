"""Hand-written input validation utilities.

No third-party validation libraries (WTForms, marshmallow, pydantic, etc.) —
every check is explicitly hand-written per subject constraints.
"""

import re
from typing import Any

# RFC 5322 compliant simplified email regex
EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
)

# Username: 3-30 characters, alphanumeric, underscores and hyphens allowed
USERNAME_REGEX = re.compile(r"^[a-zA-Z0-9_-]{3,30}$")

# Name: 1-50 characters, letters, spaces, hyphens, and apostrophes
NAME_REGEX = re.compile(r"^[a-zA-ZÀ-ÿ\s'-]{1,50}$")

# Common weak/dictionary passwords to reject
COMMON_PASSWORDS = frozenset(
    [
        "password",
        "password123",
        "12345678",
        "123456789",
        "1234567890",
        "qwerty123",
        "admin123",
        "welcome123",
        "matcha123",
        "iloveyou",
        "secret123",
        "monkey123",
        "dragon123",
        "master123",
        "sunshine",
        "princess",
        "football",
        "superman",
        "trustno1",
        "charlie",
        "donald",
    ]
)


def validate_email(email: Any) -> tuple[bool, str | None]:
    """Validate email address format and length."""
    if not isinstance(email, str):
        return False, "Email must be a string."
    email = email.strip()
    if not email:
        return False, "Email is required."
    if len(email) > 254:
        return False, "Email is too long (maximum 254 characters)."
    if not EMAIL_REGEX.match(email):
        return False, "Invalid email address format."
    return True, None


def validate_username(username: Any) -> tuple[bool, str | None]:
    """Validate username format and length."""
    if not isinstance(username, str):
        return False, "Username must be a string."
    username = username.strip()
    if not username:
        return False, "Username is required."
    if len(username) < 3 or len(username) > 30:
        return False, "Username must be between 3 and 30 characters."
    if not USERNAME_REGEX.match(username):
        return (
            False,
            "Username can only contain letters, numbers, underscores, and hyphens.",
        )
    return True, None


def validate_name(name: Any, field_name: str = "Name") -> tuple[bool, str | None]:
    """Validate first or last name."""
    if not isinstance(name, str):
        return False, f"{field_name} must be a string."
    name = name.strip()
    if not name:
        return False, f"{field_name} is required."
    if len(name) < 1 or len(name) > 50:
        return False, f"{field_name} must be between 1 and 50 characters."
    if not NAME_REGEX.match(name):
        return (
            False,
            f"{field_name} can only contain letters, spaces, hyphens, and apostrophes.",
        )
    return True, None


def validate_password(password: Any) -> tuple[bool, str | None]:
    """Validate password strength and reject dictionary words / common passwords.

    Requirements:
    - 8 to 128 characters
    - At least one lowercase letter
    - At least one uppercase letter
    - At least one digit
    - At least one special character
    - Not a known dictionary / common weak password
    """
    if not isinstance(password, str):
        return False, "Password must be a string."
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if len(password) > 128:
        return False, "Password is too long (maximum 128 characters)."
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit."
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`]", password):
        return False, "Password must contain at least one special character."

    lower_pw = password.lower()
    if lower_pw in COMMON_PASSWORDS:
        return False, "Password is too common or easily guessable."
    for word in COMMON_PASSWORDS:
        if word in lower_pw and len(word) >= 6:
            return False, f"Password contains common word '{word}'."

    return True, None
