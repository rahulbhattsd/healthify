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

## Knowledge base (RAG)

Healthify includes a local Retrieval-Augmented Generation (RAG) system grounded in curated health guidance documents.

1. **Build the knowledge base**:
   Run the chunk-and-embed script once after initial deployment, and whenever contents in `knowledge/` are updated:
   ```bash
   npm run build:kb
   ```
   This script parses all markdown files in `knowledge/`, splits them into chunks with overlap, generates local embeddings via `@xenova/transformers` (`Xenova/all-MiniLM-L6-v2`), and saves them to the `knowledgechunks` collection in MongoDB Atlas.

2. **Atlas Vector Search index (optional but recommended for speed)**:
   To enable fast native vector search in MongoDB Atlas, create a vector search index named `kb_vector_index` on the `knowledgechunks` collection in the Atlas UI or Atlas Admin API:
   ```json
   {
     "fields": [
       {
         "type": "vector",
         "path": "embedding",
         "numDimensions": 384,
         "similarity": "cosine"
       }
     ]
   }
   ```
   *Note*: If `kb_vector_index` is not configured or vector search is unavailable on your Atlas cluster tier, the backend automatically and seamlessly falls back to an in-memory cosine similarity search across the knowledge chunks. The health advice endpoint remains fully functional either way.

