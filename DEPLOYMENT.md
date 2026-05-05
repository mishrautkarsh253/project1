# Deployment Guide

## Frontend (Vercel)

1. Push the project to a GitHub repository.
2. In Vercel, create a new project and select your repository.
3. Set the project root to `clinical-doc-app/frontend`.
4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variable:
   - `REACT_APP_API_BASE_URL=https://<your-backend-domain>/api`
6. Deploy.

## Backend (Recommended Hosts)

The backend is a Node/Express app that needs a real MongoDB connection.

### Setup

1. In `clinical-doc-app/backend`, install dependencies:
   - `npm install`
2. Configure environment variables:
   - `MONGO_URI=<your MongoDB Atlas connection string>`
   - `PORT=5000` (optional)

### Deploy options

- Render: Use a Web Service and point it to `clinical-doc-app/backend`.
- Railway: Create a new project and deploy from `clinical-doc-app/backend`.
- Heroku: Use the provided `Procfile`.

### Example Heroku settings

- Buildpacks: Node.js
- Config Vars:
  - `MONGO_URI`
  - `PORT`

### Notes

- `clinical-doc-app/backend/.env.example` shows the required backend vars.
- `clinical-doc-app/frontend/.env.example` shows the frontend API base URL.
- The frontend uses `REACT_APP_API_BASE_URL`; do not hardcode `localhost` in production.

## Local development

### Frontend

```bash
cd clinical-doc-app/frontend
npm install
npm start
```

### Backend

```bash
cd clinical-doc-app/backend
npm install
npm start
```

### If you want one combined app

You can deploy the frontend to Vercel and the backend to any Node host. The two apps will be connected via the `REACT_APP_API_BASE_URL` environment variable.
