# AGENTS.md

## Cursor Cloud specific instructions

This repository is a static Progressive Web App (PWA) — a wine list/menu for Gran Caffè L'Aquila (Philadelphia). It is plain HTML/CSS/JS with a tiny Python standard-library web server. There are no third-party dependencies, no build step, no test framework, and no linter configured.

### Services

- **Static site + wine-save API** (`server.py`): serves all static files from the repo root and exposes one write endpoint.
  - Run it with `python3 server.py` (listens on port `8000`). Do not use the update script to start it.
  - Entry points: `http://localhost:8000/index.html` (public wine list) and `http://localhost:8000/gestione-vini.html` / `wine_manager.html` (Wine Management UI).
  - `POST /save-wines-json` writes the JSON request body to `data/wines.json` (the body must contain a `wines` array, else it returns HTTP 400). This is how the Wine Management page persists edits. Note the data lives in `data/wines.json`; the top-level `wines.json` is a separate/legacy copy.

### Notes / gotchas

- No dependencies to install — Python 3 (3.12 available) is all that's needed. The update script is intentionally a no-op check.
- `server.py` uses Python's `SimpleHTTPRequestHandler` and has no hot reload; restart the process after editing `server.py`. Static asset edits (HTML/CSS/JS) are picked up on browser refresh, but a service worker (`sw.js`) is registered and caches assets — hard-refresh / bypass the cache when changes don't appear.
- `manifest.json` is intentionally served as `application/manifest+json` via a `guess_type` override in `server.py`.
