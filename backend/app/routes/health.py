"""Health check — proves the API and its Neo4j connection are alive (M0)."""

from flask import Blueprint, Response, current_app, jsonify

from app.db import query_read

bp = Blueprint("health", __name__)


@bp.get("/health")
def health() -> tuple[Response, int]:
    try:
        query_read("RETURN 1 AS up")
    except Exception:
        current_app.logger.exception("Health check: Neo4j unreachable")
        return jsonify(status="degraded", neo4j="down"), 503
    return jsonify(status="ok", neo4j="up"), 200
