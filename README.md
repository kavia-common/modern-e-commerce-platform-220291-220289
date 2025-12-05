# modern-e-commerce-platform-220291-220289

Backend service (Express) runs on PORT (default 3001) and exposes Swagger docs at /docs.
Environment variables are configured via .env (see ecommerce_backend/.env.example for required keys).

- Backend: ecommerce_backend
  - Docs: http://localhost:3001/docs (dynamic host in deployments)
  - Important envs:
    - MONGODB_URI or MONGODB_URL + MONGODB_DB
    - CORS_ORIGIN
    - JWT_ACCESS_SECRET, JWT_REFRESH_SECRET

## Database connection resolution

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

## Seeding data

- Set `SEED_ON_START=true` to insert minimal seed data on boot (dev/test).
- A dev-only endpoint is also available when `NODE_ENV !== 'production'`:

  - POST `/api/v1/dev/seed` → Inserts:
    - Categories: root, electronics
    - One sample product with variants and stock
    - Admin user: admin@example.com / admin123 (dev only)
    - Coupon: WELCOME10 (10% up to 500)

The seeding is idempotent (safe to call multiple times). Never enable these dev facilities in production.
