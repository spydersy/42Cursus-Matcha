"""Matcha backend — Flask app factory."""

from pathlib import Path

from flask import Flask, Response, jsonify, request
from flask_socketio import SocketIO
from werkzeug.exceptions import HTTPException

socketio = SocketIO()


def create_app(config_object: str = "app.config.Config") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)

    Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)

    from app.db import init_db

    init_db(app)

    _register_error_handlers(app)
    _register_cors(app)

    # One blueprint per domain — feature tasks register theirs here.
    from app.routes.auth import bp as auth_bp
    from app.routes.health import bp as health_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp)

    from app.sockets import register_socket_handlers

    allowed_origins = [
        app.config["FRONTEND_URL"].rstrip("/"),
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    socketio.init_app(
        app,
        cors_allowed_origins=allowed_origins,
        async_mode="threading",
    )
    register_socket_handlers()

    return app


def _register_error_handlers(app: Flask) -> None:
    """Every error is JSON with a proper status code — never a stack trace."""

    @app.errorhandler(HTTPException)
    def handle_http_error(exc: HTTPException) -> tuple[Response, int]:
        return jsonify(error=exc.description or exc.name), exc.code

    @app.errorhandler(Exception)
    def handle_unexpected_error(exc: Exception) -> tuple[Response, int]:
        app.logger.exception("Unhandled error: %s", exc)
        return jsonify(error="Internal server error"), 500


def _register_cors(app: Flask) -> None:
    """Hand-rolled CORS: supports configured FRONTEND_URL and local dev origins with credentials."""

    allowed_origins = {
        app.config["FRONTEND_URL"].rstrip("/"),
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5001",
        "http://127.0.0.1:5001",
    }

    @app.after_request
    def add_cors_headers(response: Response) -> Response:
        origin = request.headers.get("Origin")
        if origin:
            clean_origin = origin.rstrip("/")
            if clean_origin in allowed_origins or "localhost" in origin or "127.0.0.1" in origin:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Vary"] = "Origin"
            else:
                response.headers["Access-Control-Allow-Origin"] = app.config["FRONTEND_URL"]
        else:
            response.headers["Access-Control-Allow-Origin"] = app.config["FRONTEND_URL"]

        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = (
            request.headers.get("Access-Control-Request-Headers")
            or "Content-Type, Authorization, X-Requested-With, Accept"
        )
        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        )
        response.headers["Access-Control-Max-Age"] = "86400"
        return response

    @app.before_request
    def handle_preflight() -> tuple[str, int] | None:
        if request.method == "OPTIONS":
            return "", 204
        return None
