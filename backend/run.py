"""Dev entry point: `python run.py` → http://localhost:5001

Port 5001 because macOS AirPlay Receiver occupies 5000.
"""

import os

from app import create_app, socketio

app = create_app()

if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    socketio.run(
        app,
        host="0.0.0.0",
        port=5001,
        debug=debug,
        use_reloader=debug,
        allow_unsafe_werkzeug=True,
    )
