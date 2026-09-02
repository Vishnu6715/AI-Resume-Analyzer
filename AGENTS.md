# Base44 Dev Environment

## Stack
- **Frontend**: Angular 22 (Vite-based dev server), served on port 4200 → mapped to host port 3000
- **Backend**: Spring Boot 4.1.1 (Java 21, Maven), served on port 8080
- **Database**: PostgreSQL 16

## Architecture
- Single-origin wiring: the Angular dev server proxies `/api` requests to the backend via `frontend/proxy.conf.json`. The frontend uses relative URLs (`/api/...`) — the hardcoded deployed-backend URLs were replaced with relative paths.
- `allowedHosts: true` in `angular.json` serve options allows the preview's external hostname (Vite blocks unknown hosts by default).

## Setup Notes
- No external secrets required. Resume analysis is local PDF text extraction (Apache PDFBox) — no AI API calls.
- Backend uses `ddl-auto=update` so Hibernate auto-creates tables on first boot.
- Maven dependencies are cached in a named volume (`maven-cache`) to speed up restarts.
- Frontend `node_modules` is in a named volume (`frontend-node-modules`) to persist across restarts.

## Verification
- Frontend: `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` returns the Angular app
- Backend: `curl -s http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"x@x.com","password":"x"}'` returns "User not found" (HTTP 400)
- Proxy: same request through port 3000 (`/api/auth/login`) reaches the backend
- Full flow: signup → login returns HTTP 200

## Commands
- Start: `docker compose -f docker-compose.base44.yml up -d`
- Logs: `docker compose -f docker-compose.base44.yml logs -f`
- Frontend live-reloads on file changes; backend uses Spring DevTools (auto-restarts on recompile).
