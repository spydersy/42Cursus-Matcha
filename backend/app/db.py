"""Neo4j driver singleton + hand-written Cypher helpers.

ALL queries must be parameterized — `session.run(query, **params)`.
Never build Cypher with f-strings containing user input.
"""

import atexit
from typing import Any

from flask import Flask
from neo4j import Driver, GraphDatabase

_driver: Driver | None = None

# Uniqueness constraints (they double as lookup indexes).
CONSTRAINTS = (
    "CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE",
    "CREATE CONSTRAINT user_email_unique IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE",
    "CREATE CONSTRAINT user_username_unique IF NOT EXISTS FOR (u:User) REQUIRE u.username IS UNIQUE",
    "CREATE CONSTRAINT tag_name_unique IF NOT EXISTS FOR (t:Tag) REQUIRE t.name IS UNIQUE",
    "CREATE CONSTRAINT message_id_unique IF NOT EXISTS FOR (m:Message) REQUIRE m.id IS UNIQUE",
)

# Secondary indexes for browse/search sorting (T11/T13).
INDEXES = ("CREATE INDEX user_fame_rating IF NOT EXISTS FOR (u:User) ON (u.fame_rating)",)


def init_db(app: Flask) -> None:
    """Create the driver (once), verify connectivity, ensure the schema."""
    global _driver
    if _driver is None:
        _driver = GraphDatabase.driver(
            app.config["NEO4J_URI"],
            auth=(app.config["NEO4J_USER"], app.config["NEO4J_PASSWORD"]),
        )
        atexit.register(close_db)
    _driver.verify_connectivity()  # fail fast if Neo4j is unreachable
    _ensure_schema()


def get_driver() -> Driver:
    if _driver is None:
        raise RuntimeError("Neo4j driver not initialized — call init_db() first")
    return _driver


def close_db() -> None:
    global _driver
    if _driver is not None:
        _driver.close()
        _driver = None


def _ensure_schema() -> None:
    with get_driver().session() as session:
        for statement in (*CONSTRAINTS, *INDEXES):
            session.execute_write(lambda tx, s=statement: tx.run(s).consume())


def query_read(query: str, **params: Any) -> list[dict[str, Any]]:
    """Run a read query; return records as plain dicts."""
    with get_driver().session() as session:
        return session.execute_read(
            lambda tx: [record.data() for record in tx.run(query, **params)]
        )


def query_write(query: str, **params: Any) -> list[dict[str, Any]]:
    """Run a write query; return records as plain dicts."""
    with get_driver().session() as session:
        return session.execute_write(
            lambda tx: [record.data() for record in tx.run(query, **params)]
        )
