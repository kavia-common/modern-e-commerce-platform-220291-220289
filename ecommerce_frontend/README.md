# Ecommerce Frontend (React)

- Dev server: http://localhost:3000
- Expects backend API at: http://localhost:3001/api/v1 (configurable)

## Quickstart

1) Environment
- Copy .env.example to .env
- Ensure REACT_APP_API_BASE_URL points to your backend (default http://localhost:3001/api/v1)
- Optional: REACT_APP_THEME=royal-purple

2) Install & Run
- npm install
- npm start

## API Client

- The app should use an axios instance with baseURL set from REACT_APP_API_BASE_URL and withCredentials enabled if backend uses cookies.
- Example:
  - baseURL = process.env.REACT_APP_API_BASE_URL
  - withCredentials = true (if using cookie-based auth)

## Helpful Links

- Backend Docs: http://localhost:3001/docs
- Backend Health: http://localhost:3001/
