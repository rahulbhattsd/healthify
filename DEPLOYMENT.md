# Healthify Deployment

## Render web service

Use the root project for a single Render web service.

- Build command: `npm run build`
- Start command: `npm start`
- Node version: `20.9.0`

Required environment variables:

- `ATLASDB_URL`
- `JWT_SECRET`
- `GROQ_API_KEY`
- `CLIENT_ORIGINS`

For `CLIENT_ORIGINS`, use a comma-separated list of the frontend URLs that may call the API, for example:

```text
https://your-healthify-service.onrender.com,https://your-healthify-frontend.onrender.com
```

If the React frontend is deployed as a separate Render Static Site, set this build-time variable on the frontend:

```text
VITE_API_BASE_URL=https://your-healthify-api.onrender.com
```

If the backend serves the built React app from `client/dist`, leave `VITE_API_BASE_URL` unset so the app calls same-origin `/api/...` routes.
