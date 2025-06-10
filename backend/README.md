# Doggo Network Backend

This directory contains a minimal Flask backend configured for PostgreSQL via SQLAlchemy.

## Quick Start

1. Create a virtual environment and install dependencies from `requirements.txt`.
2. Set the `DATABASE_URL` environment variable to point to your PostgreSQL instance.
3. Run `python run.py` to start the API server.

The backend exposes a simple `/` endpoint and includes basic models for users, dogs, and posts.
