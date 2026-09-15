<div align="center">

# Healthify

### AI-assisted health guidance powered by RAG + Groq

Healthify is a full-stack health-advice application that turns structured symptom intake into a clear, sectioned response using a retrieval-augmented generation pipeline grounded in a curated health knowledge base.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Healthify-111827?style=for-the-badge&logo=render&logoColor=white)](https://healthify-31ok.onrender.com/landing)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.9-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Groq](https://img.shields.io/badge/Groq-LLM-F55036?style=flat-square)](https://groq.com/)

</div>

---

## Overview

Healthify is designed around a simple flow:

**collect health context → retrieve relevant knowledge → generate grounded guidance → stream readable results**

The application combines a React/Vite frontend with an Express backend, MongoDB Atlas persistence, local sentence embeddings, MongoDB vector retrieval, and Groq chat completions.

The result is not presented as a medical diagnosis. The generation prompt explicitly asks for uncertainty-aware guidance, practical self-care information, OTC cautions, lifestyle suggestions, red flags, and a safety disclaimer.

> **Medical disclaimer:** Healthify is an informational tool and is not a substitute for professional medical diagnosis, treatment, or emergency care.

---

## Architecture

<img width="1536" height="1024" alt="ChatGPT Image Sep 15, 2026, 03_46_43 PM" src="https://github.com/user-attachments/assets/0d706ab4-cf73-45af-a39d-6255a84d8340" />


## RAG Pipeline

Healthify includes a real retrieval layer rather than sending the complete knowledge base to the LLM.

### 1. Knowledge ingestion

Markdown files under `knowledge/` are discovered and processed by `scripts/buildKnowledgeBase.js`.

The builder:

- extracts a title from the first Markdown heading when available
- splits documents into **300-word chunks** with **50-word overlap**
- generates normalized embeddings with `Xenova/all-MiniLM-L6-v2`
- stores text, source metadata, and embeddings as `KnowledgeChunk` documents
- clears and rebuilds the collection when the knowledge base is regenerated

### 2. Query construction

For a submitted health form, retrieval focuses on clinically meaningful text fields:

- symptoms
- pre-existing conditions
- current medications

Demographic and duration fields are still passed to the final generation prompt, but the retrieval query intentionally keeps the semantic search focused on the condition-related context.

### 3. Retrieval

The backend first attempts MongoDB Atlas `$vectorSearch` through the `kb_vector_index` index.

When native vector search is unavailable or returns no results, Healthify falls back to an in-memory cosine-similarity scan over stored embeddings.

### 4. Grounded generation

The top retrieved chunks are formatted into numbered reference material and injected into the generation prompt. The model is instructed to cite applicable reference numbers in the final `Sources` section.

This creates the following chain:

```text
Patient intake
    ↓
Retrieval query
    ↓
384-dimensional embedding
    ↓
Top-k knowledge chunks
    ↓
Reference material
    ↓
Structured Groq prompt
    ↓
Streaming Markdown response
```

---

## Core Features

| Area | What Healthify provides |
|---|---|
| Health intake | Age, gender, height, weight, symptoms, duration, conditions, allergies, medications |
| Guided symptoms | Predefined symptom chips plus free-text symptom notes |
| AI advice | Groq-powered health guidance with configurable supported models |
| RAG grounding | Local MiniLM embeddings + MongoDB Atlas vector search |
| Retrieval fallback | In-memory cosine similarity if Atlas vector search is unavailable |
| Streaming UX | Incremental response rendering from `/api/health-advice?stream=true` |
| Structured output | Possible insights, home remedies, OTC medicines, lifestyle tips, doctor guidance, disclaimer, sources |
| Authentication | Signup/login using bcrypt + JWT |
| API protection | Helmet, CORS, request limits, advice-specific rate limiting |
| Session continuity | Latest form data and generated advice cached in browser session storage |
| Deployment | Single Render web service or split frontend/backend deployment |

---

## Application Flow

```text
                    ┌──────────────┐
                    │    Landing   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Health Form │
                    └──────┬───────┘
                           │ validate + store
                           ▼
                    ┌──────────────┐
                    │ /result      │
                    └──────┬───────┘
                           │ POST /api/health-advice?stream=true
                           ▼
               ┌────────────────────────┐
               │ Express Advice Endpoint │
               └────────────┬───────────┘
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
       ┌─────────────┐              ┌──────────────┐
       │ RAG Search  │              │ Groq LLM     │
       └──────┬──────┘              └──────┬───────┘
              └──────────────┬─────────────┘
                             ▼
                    Streamed Markdown
                             │
                             ▼
                 ┌─────────────────────┐
                 │ Structured Results  │
                 └─────────────────────┘
```

---

## Frontend

The client is built with **React 18**, **Vite**, **React Router**, **React Bootstrap/Bootstrap**, **Framer Motion**, **React Icons**, and **React Markdown**.

### Main routes

| Route | Purpose |
|---|---|
| `/` | Home experience |
| `/landing` | Landing page |
| `/about` | About page |
| `/contact` | Contact page |
| `/signup` | Account creation |
| `/login` | Login |
| `/form` | Health intake workflow |
| `/result` | Streaming AI guidance + source display |

### Results UX

The results screen keeps the submitted health snapshot beside the generated response and divides the Markdown into dedicated UI cards so long responses remain scannable.

---

## Backend API

### Health

```http
GET /api/healthcheck
```

Returns API and Groq configuration status, plus the resolved model.

### Authentication

```http
POST /api/signup
POST /api/login
POST /api/logout
```

Protected routes use:

```http
Authorization: Bearer <JWT>
```

### Health advice

```http
POST /api/health-advice
POST /api/health-advice?stream=true
```

Example request body:

```json
{
  "age": 29,
  "gender": "Male",
  "weight": "68",
  "height": "172",
  "symptoms": ["Fever", "Fatigue", "Headache"],
  "additionalSymptoms": "Mild body aches",
  "duration": "2 days",
  "preExistingConditions": "None",
  "allergies": "None",
  "currentMedications": "None"
}
```

The advice service validates and normalizes the payload before retrieval and generation.

---

## Project Structure

```text
healthify/
├── client/
│   ├── src/
│   │   ├── Landing.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── CustomForm.jsx
│   │   ├── FinalPage.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Navbar.jsx
│   │   ├── api.js
│   │   └── *.css
│   └── package.json
│
├── knowledge/
│   └── *.md                 # Curated health reference material
│
├── middleware/
│   └── authMiddleware.js    # JWT verification
│
├── scripts/
│   ├── buildKnowledgeBase.js # Chunk + embed knowledge documents
│   └── testRagE2E.js         # RAG end-to-end test entry point
│
├── auth.js
├── database.js              # MongoDB Atlas connection
├── healthAdviceService.js   # Validation + prompt construction
├── ragService.js            # Embeddings + retrieval + source formatting
├── User.js                  # User schema
├── KnowledgeChunk.js        # RAG chunk schema
├── server.js                # Express application + API routes
├── .env.example
├── DEPLOYMENT.md
└── package.json
```

---

## Tech Stack

### Frontend

- React 18
- Vite 6
- React Router 6
- React Markdown
- React Bootstrap / Bootstrap 5
- Framer Motion
- React Icons

### Backend

- Node.js 20.9
- Express 4
- Mongoose 8
- MongoDB Atlas
- JWT
- bcryptjs
- Helmet
- CORS
- express-validator

### AI / RAG

- Groq SDK
- `Xenova/all-MiniLM-L6-v2` embeddings
- MongoDB Atlas Vector Search
- cosine similarity fallback retrieval
- curated Markdown knowledge base

---

## Environment Variables

Create a `.env` file in the repository root:

```env
ATLASDB_URL=<your-mongodb-atlas-connection-string>
JWT_SECRET=<strong-random-secret>
GROQ_API_KEY=<your-groq-api-key>
GROQ_MODEL=openai/gpt-oss-120b
CLIENT_ORIGINS=http://localhost:5173
```

For a separate frontend deployment, configure the client with:

```env
VITE_API_BASE_URL=https://your-healthify-api.onrender.com
```

The application also supports the relevant frontend/API origin environment variables already handled by the server configuration.

---

## Local Development

### 1. Install dependencies

```bash
npm install
npm run client:install
```

### 2. Configure environment

Copy `.env.example` to `.env` and provide MongoDB Atlas, JWT, and Groq credentials.

### 3. Build the knowledge base

```bash
npm run build:kb
```

Run this after the first setup and whenever files under `knowledge/` change.

### 4. Start the application

```bash
npm start
```

For the frontend development server:

```bash
npm run client:build
```

or run Vite directly from `client/`:

```bash
cd client
npm run dev
```

---

## MongoDB Atlas Vector Search

Healthify expects an Atlas vector index named:

```text
kb_vector_index
```

Recommended definition:

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

The current embedding model produces **384-dimensional normalized vectors**, matching the index configuration above.

Vector search is an optimization rather than a hard runtime dependency because the application has a cosine-similarity fallback.

---

## Deployment

The repository is prepared for a single Render web service.

```text
Build:  npm run build
Start: npm start
Node:   20.9.0
```

The build command installs and builds the React client, while the Express server can serve the generated client from the same deployment setup.

For the complete deployment and Atlas configuration details, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## Design Principles

### Ground the generation

Relevant reference chunks are supplied to the model rather than relying exclusively on free-form generation.

### Fail gracefully

The RAG path can fall back from Atlas vector search to cosine similarity, and the AI endpoint handles timeouts, provider errors, and empty responses.

### Keep output structured

The generation service enforces a predictable section contract so the frontend can progressively render advice while the model is still streaming.

### Treat security as part of the product

Authentication uses hashed passwords and JWTs, while the API applies Helmet, CORS restrictions, request limits, and endpoint-specific rate limiting.

### Keep the UX readable

The intake form validates before navigation, preserves recent form state in session storage, and presents the final result as separate cards instead of one large text blob.

---

## Limitations

Healthify should be treated as an educational AI application, not a clinical decision system.

Important limitations include:

- Generated advice can be incorrect or incomplete.
- OTC suggestions require professional judgment for individual circumstances.
- Emergency or severe symptoms require real-world medical care.
- The knowledge base is only as good as the curated documents it contains.
- In-memory retrieval fallback is less scalable than native vector search for large knowledge bases.

---

## Why This Project Is Interesting

Healthify demonstrates an end-to-end **AI application architecture**, not just an LLM API call:

```text
React UX
   ↓
Express API
   ↓
Input validation
   ↓
Semantic query construction
   ↓
Local embedding model
   ↓
Vector retrieval
   ↓
Grounded prompt construction
   ↓
Groq inference
   ↓
HTTP streaming
   ↓
Structured React rendering
```

It is therefore useful as a practical example of combining **full-stack engineering, authentication, retrieval-augmented generation, vector search, AI integration, and production-oriented API controls** in one application.

---

## Author

**Rahul Bhatt**

Full Stack Developer · MERN · AI / RAG Integrations

- GitHub: https://github.com/rahulbhattsd
- LinkedIn: https://www.linkedin.com/in/rahulbhatt-developer/
- Portfolio: https://rahulbhattsd.github.io/rahul-portfolio/

---

<div align="center">

Built with React, Node.js, MongoDB Atlas, local embeddings, and Groq.

</div>
