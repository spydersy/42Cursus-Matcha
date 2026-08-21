"""Central configuration — every value comes from the environment.

In Docker, compose injects the vars; in host dev, python-dotenv loads the
repo-root .env. Never hardcode secrets in this file.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BACKEND_DIR.parent
load_dotenv(ROOT_DIR / ".env")  # real env vars always win (no override)


def _required(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(
            f"Missing required environment variable {name!r}. "
            "Copy .env.example to .env and fill it in."
        )
    return value


class Config:
    """Settings consumed by create_app()."""

    SECRET_KEY = _required("SECRET_KEY")

    NEO4J_URI = _required("NEO4J_URI")
    NEO4J_USER = _required("NEO4J_USER")
    NEO4J_PASSWORD = _required("NEO4J_PASSWORD")

    MAIL_HOST = _required("MAIL_HOST")
    MAIL_PORT = int(os.getenv("MAIL_PORT", "1025"))
    MAIL_FROM = _required("MAIL_FROM")

    FRONTEND_URL = _required("FRONTEND_URL")

    # Profile pictures — absolute path, created at startup (T7 uses it).
    UPLOAD_FOLDER = str((BACKEND_DIR / os.getenv("UPLOAD_FOLDER", "uploads")).resolve())
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB request cap

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = False  # dev over http; set True behind https
