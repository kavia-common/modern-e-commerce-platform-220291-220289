# modern-e-commerce-platform-220291-220289

This repo contains a modern e-commerce platform split into containers:
- Backend (Express) at ecommerce_backend (default port 3001)
- Frontend (React) at ecommerce_frontend (default port 3000)
- Database (MongoDB) at ecommerce_database

Backend service (Express) runs on PORT (default 3001) and exposes Swagger docs at /docs.
Environment variables are configured via .env (see ecommerce_backend/.env.example for required keys).
Frontend reads its API base URL from REACT_APP_API_BASE_URL (see ecommerce_frontend/.env.example).

- Backend: ecommerce_backend
  - Docs: http://localhost:3001/docs (dynamic host in deployments)
  - Main API base: http://localhost:3001/api/v1
  - Important envs:
    - MONGODB_URI or MONGODB_URL + MONGODB_DB
    - CORS_ORIGIN
    - JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
- Frontend: ecommerce_frontend
  - Runs at http://localhost:3000
  - Uses REACT_APP_API_BASE_URL=http://localhost:3001/api/v1

## Quickstart

1) Database
- Ensure ecommerce_database/db_connection.txt exists. It can contain either:
  - a line like `mongosh <connection-string>`
  - or the raw MongoDB URI (`mongodb://...` or `mongodb+srv://...`)
- Backend will auto-read this when MONGODB_URI is not provided.

2) Backend
- Copy ecommerce_backend/.env.example → ecommerce_backend/.env and adjust values as needed.
- Start backend:
  - dev: cd ecommerce_backend && npm install && npm run dev
  - prod: cd ecommerce_backend && npm install && npm start
- API: http://localhost:3001/api/v1
- Docs: http://localhost:3001/docs

3) Frontend
- Copy ecommerce_frontend/.env.example → ecommerce_frontend/.env
- Ensure REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
- Start frontend: cd ecommerce_frontend && npm install && npm start
- App: http://localhost:3000

## Database connection resolution (backend)

The backend resolves the MongoDB connection string in the following order:
1. MONGODB_URI (if set)
2. ecommerce_database/db_connection.txt: supports either:
   - a line like `mongosh <connection-string>`
   - or the raw MongoDB URI (`mongodb://...` or `mongodb+srv://...`)
3. MONGODB_URL (+ optional MONGODB_DB to append when path segment missing)
4. Dev fallback: `mongodb://appuser:dbuser123@localhost:5001/ecommerce?authSource=admin`

Note: The effective database name used is also controlled by MONGODB_DB (defaults to `ecommerce`) via the Mongoose `dbName` option.

## Index creation

On startup, after connecting to MongoDB, the app will call `syncIndexes()` for all registered models, ensuring indexes are created. This is intended for dev/test; for production, consider managing indexes out-of-band.

## Seeding data (backend)

- Set `SEED_ON_START=true` to insert minimal seed data on boot (dev/test).
- A dev-only endpoint is also available when `NODE_ENV !== 'production'`:

  - POST `/api/v1/dev/seed` → Inserts:
    - Categories: root, electronics
    - One sample product with variants and stock
    - Admin user: admin@example.com / admin123 (dev only)
    - Coupon: WELCOME10 (10% up to 500)

The seeding is idempotent (safe to call multiple times). Never enable these dev facilities in production.

## End-to-End Smoke Checklist

- Signup → POST /api/v1/auth/register
- Login → POST /api/v1/auth/login
- List products → GET /api/v1/products
- Add to cart → POST /api/v1/cart/add (requires Bearer access token)
- Apply coupon → POST /api/v1/cart/apply-coupon (Bearer token)
- Checkout COD → POST /api/v1/orders { "method": "COD" } (Bearer token)
- View orders → GET /api/v1/orders (Bearer token)

See scripts/smoke.md for curl examples.
