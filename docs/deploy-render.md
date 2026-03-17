# Deploy TravelSplit on Render with Docker

This guide explains how to deploy the TravelSplit backend and frontend on [Render](https://render.com) using Docker, with a managed PostgreSQL database.

## Overview

- **Backend**: NestJS API (Docker, production build + migrations + `node dist/main.js`).
- **Frontend**: Vite/React app built to static files and served with nginx.
- **Database**: Render PostgreSQL (create one in the dashboard and connect via internal URL).

You will create:

1. A **PostgreSQL** database (Render managed).
2. A **Web Service** for the backend (Docker).
3. A **Web Service** for the frontend (Docker).

## Prerequisites

- A [Render](https://render.com) account.
- This repository connected to Render (GitHub/GitLab).
- The repo contains:
  - `Backend/Dockerfile.production`
  - `Frontend/Dockerfile.production`
  - `Frontend/nginx.conf`

## 1. Create PostgreSQL Database

1. In Render Dashboard: **New** > **PostgreSQL**.
2. Name it (e.g. `travelsplit-db`).
3. Choose region and plan.
4. Create. Copy the **Internal Database URL** (you will use it for the backend).

Internal URL format:

```
postgres://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

You will map this to: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`. Render also exposes `DATABASE_URL`; you can use that or set each variable.

## 2. Backend Web Service (Docker)

1. **New** > **Web Service**.
2. Connect the repository and select the repo.
3. Configure:
   - **Name**: e.g. `travelsplit-api`.
   - **Region**: Same as the database.
   - **Branch**: `main` (or your deploy branch).
   - **Root Directory**: leave empty.
   - **Runtime**: **Docker**.
   - **Dockerfile Path**: `Backend/Dockerfile.production`.
   - **Docker Build Context Directory**: `Backend` (so COPY in the Dockerfile are relative to the Backend folder).

4. **Instance type**: Free or paid.

5. **Environment variables** (use the key/value editor or “Add from Database” for `DATABASE_URL`):

   | Key           | Value / source |
   |---------------|----------------|
   | `PORT`        | `3000` |
   | `NODE_ENV`    | `production` |
   | `API_PREFIX`  | `api` |
   | `CORS_ORIGINS` | Your frontend URL, e.g. `https://travelsplit.onrender.com` (replace with your real frontend URL after creating it). Add both Render URL and any custom domain. |
   | `DB_HOST`     | From Internal Database URL (host part). |
   | `DB_PORT`     | Usually `5432`. |
   | `DB_USERNAME` | From Internal Database URL. |
   | `DB_PASSWORD` | From Internal Database URL. |
   | `DB_NAME`     | From Internal Database URL. |
   | `DB_SYNCHRONIZE` | `false` |
   | `DB_LOGGING`  | `false` (or `true` for debugging). |
   | `JWT_SECRET`  | A long random string (e.g. 32+ chars). Generate with `openssl rand -base64 32`. |
   | `JWT_EXPIRES_IN` | `3600` (seconds). |

   If Render gives you **Internal Database URL** as a single URL, you can use **Add from Database** and then add a script or env that parses it into `DB_HOST`, `DB_PORT`, etc. Alternatively, some Render plans expose `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`; use those if available and your app supports them (our app expects `DB_*`).

6. **Health Check Path** (optional): `api/health` or the path your backend uses for health checks.

7. Create the service. Render will build the Docker image from `Backend/Dockerfile.production` and deploy. After deploy, note the backend URL (e.g. `https://travelsplit-api.onrender.com`). The API will be at `https://<backend-url>/api`.

## 3. Frontend Web Service (Docker)

1. **New** > **Web Service**.
2. Same repository.
3. Configure:
   - **Name**: e.g. `travelsplit-web`.
   - **Region**: Same as backend.
   - **Branch**: `main`.
   - **Runtime**: **Docker**.
   - **Dockerfile Path**: `Frontend/Dockerfile.production`.
   - **Docker Build Context Directory**: `Frontend` (so COPY in the Dockerfile are relative to the Frontend folder).

4. **Environment variables** (needed at **build time** for Vite):

   | Key                  | Value |
   |----------------------|--------|
   | `VITE_API_BASE_URL`  | Backend API URL, e.g. `https://travelsplit-api.onrender.com/api` (use the backend URL from step 2). |

   On Render, environment variables are typically available at Docker build time. If your build produces a frontend that still points to localhost, ensure `VITE_API_BASE_URL` is set in the **Environment** tab and that Render passes env to the Docker build (Render usually does this by default).

5. **Instance type**: Free or paid.

6. Create the service. After deploy, note the frontend URL (e.g. `https://travelsplit-web.onrender.com`).

## 4. Wire CORS and URLs

1. **Backend**: In the backend service **Environment**, set `CORS_ORIGINS` to your frontend URL(s), e.g.:
   - `https://travelsplit-web.onrender.com`
   - Add a custom domain if you use one.
   Use a comma-separated list if you have multiple origins.

2. **Frontend**: Ensure `VITE_API_BASE_URL` is the full backend API base URL (e.g. `https://travelsplit-api.onrender.com/api`). Re-deploy the frontend after changing it so the build picks the new value.

## 5. Deploy and Migrations

- **Backend**: On each deploy, the image runs `docker-entrypoint-production.sh`: wait for PostgreSQL, run `npm run migration:run`, then `node dist/main.js`. No extra step is required for migrations.
- **Frontend**: Each deploy rebuilds the image with the current `VITE_API_BASE_URL` and serves the built files via nginx.

## Local Docker build (optional)

Backend:

```bash
cd Backend
docker build -f Dockerfile.production -t travelsplit-backend .
docker run --rm -e DB_HOST=host.docker.internal -e DB_PORT=5432 -e DB_USERNAME=postgres -e DB_PASSWORD=postgres -e DB_NAME=travelsplit -e JWT_SECRET=your-secret -p 3000:3000 travelsplit-backend
```

Frontend (replace with your API URL):

```bash
cd Frontend
docker build -f Dockerfile.production --build-arg VITE_API_BASE_URL=https://travelsplit-api.onrender.com/api -t travelsplit-frontend .
docker run -p 8080:80 travelsplit-frontend
```

## Troubleshooting

- **Backend fails to start**: Check that all `DB_*` and `JWT_SECRET` are set and that the database is reachable (use Internal Database URL / same region).
- **Migrations**: They run automatically in the backend container on startup. If you need to run them manually, you can run a one-off container with `RUN_MIGRATION_ONLY=1` and the same env (implementation may require adding support for this in the entrypoint; current script supports it).
- **Frontend shows wrong API URL**: Set `VITE_API_BASE_URL` in the frontend service Environment and trigger a new deploy so the Docker build uses the new value.
- **CORS errors**: Add the exact frontend origin (and protocol) to `CORS_ORIGINS` on the backend and redeploy.

