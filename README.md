# Doggo Network

Doggo Network is a mobile-first social network for dog owners. The project is split into a React + TypeScript front-end and a Flask back-end using PostgreSQL. This repository contains a basic starting point for development.

## Structure

```
frontend/   - React application configured with Tailwind CSS
backend/    - Flask API with SQLAlchemy models
```

## Getting Started

1. Install Node.js dependencies in `frontend/` and Python dependencies in `backend/`.
2. Configure a PostgreSQL database and set the `DATABASE_URL` environment variable for the backend.
3. Run the front-end with `npm run dev` and the backend with `python run.py`.

The initial implementation exposes a placeholder API and a simple landing page. Expand the models and routes to add user profiles, posts, comments, following, and notifications.
