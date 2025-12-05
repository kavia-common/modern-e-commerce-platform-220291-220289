# modern-e-commerce-platform-220291-220289

Backend service (Express) runs on PORT (default 3001) and exposes Swagger docs at /docs.
Environment variables are configured via .env (see ecommerce_backend/.env.example for required keys).

- Backend: ecommerce_backend
  - Docs: http://localhost:3001/docs (dynamic host in deployments)
  - Important envs:
    - MONGODB_URI or MONGODB_URL + MONGODB_DB
    - CORS_ORIGIN
    - JWT_ACCESS_SECRET, JWT_REFRESH_SECRET