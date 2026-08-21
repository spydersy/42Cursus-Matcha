"""Socket.IO wiring. T17 (chat) and T19 (notifications) register their
event handlers here; T15/T17 add auth gating and presence tracking."""

from app import socketio


def register_socket_handlers() -> None:
    """Baseline handlers — feature tasks extend this function."""

    @socketio.on("connect")
    def on_connect() -> None:
        pass
