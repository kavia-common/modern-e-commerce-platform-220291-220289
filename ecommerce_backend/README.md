# Ecommerce Backend (Express)

- Base URL: http://localhost:3001
- API: http://localhost:3001/api/v1
- Swagger Docs: http://localhost:3001/docs

## Quickstart

1) Environment
- Copy .env.example to .env and set secrets/URLs.
- Important:
  - CORS_ORIGIN must point to your frontend (default http://localhost:3000).
  - MONGODB_URI can be empty; when absent, the server auto-resolves from ../ecommerce_database/db_connection.txt or falls back to MONGODB_URL/MONGODB_DB or a dev default.

2) Install & Run
- npm install
- Development: npm run dev
- Production: npm start

3) Seeding
- Set SEED_ON_START=true in .env OR
- POST /api/v1/dev/seed when NODE_ENV !== "production"

4) MongoDB Resolution
Priority:
1. MONGODB_URI
2. ../ecommerce_database/db_connection.txt (supports "mongosh <uri>" or raw mongodb uri)
3. MONGODB_URL (+ optional MONGODB_DB)
4. Dev fallback inside code

5) CORS
- The app enables CORS with:
  { origin: CORS_ORIGIN, credentials: true, methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }

## End-to-End Smoke Checklist

- Signup → POST /api/v1/auth/register
- Login → POST /api/v1/auth/login
- List products → GET /api/v1/products
- Add to cart → POST /api/v1/cart/add (Bearer token)
- Apply coupon → POST /api/v1/cart/apply-coupon (Bearer token)
- Checkout COD → POST /api/v1/orders { "method": "COD" } (Bearer token)
- View orders → GET /api/v1/orders (Bearer token)

See ../../scripts/smoke.md for copy-paste curl commands.
