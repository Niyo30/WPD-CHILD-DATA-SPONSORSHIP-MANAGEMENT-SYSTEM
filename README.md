# WPD Sponsorship Child Data Management System

This repository is a production-ready scaffold for the **WPD Sponsorship Child Data Management System** built with **React + Vite** and **TailwindCSS**.

## What is included
- React + Vite project structure
- TailwindCSS configured
- `src/api.js` — placeholder Axios client and example functions to connect to your backend API
- Demo UI derived from the WPD single-file component (children, sponsors, communication, reports)
- Scripts: `dev`, `build`, `preview`

## How to use (quick start)

1. Install dependencies
```bash
cd wpd-sponsorship-cms
npm install
```

2. Run the dev server
```bash
npm run dev
```

3. Open the URL shown by Vite (default `http://localhost:5173`)

## Production integration checklist
- Create a backend API (Node/Express, Django, Laravel, Firebase, etc.) exposing:
  - `GET /api/children`
  - `GET /api/sponsors`
  - `POST /api/messages`
  - `POST /api/auth/login`
- Set `VITE_API_BASE_URL` in your environment (e.g. `.env` file) before building:
```
VITE_API_BASE_URL=https://api.yourdomain.org
```
- Implement secure authentication and role-based access control
- Store media (photos/documents) in cloud storage (S3 or equivalent)
- Use a real database (Postgres, MySQL) for persistence
- Add server-side validation and logging

## Notes
- This scaffold intentionally uses demo data. Replace demo usage in `src/App.jsx` with calls to `src/api.js`.
- If you want, I can also scaffold a simple Node/Express backend (with SQLite or Postgres) that matches the expected API endpoints.

---

Prepared for Jean Bernard (WPD). If you'd like, I can also:
- Generate a backend repo and link it to this frontend
- Add Dockerfiles and deploy scripts
- Add real authentication (JWT) and example database seed scripts

