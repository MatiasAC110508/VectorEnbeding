# Friday Project

This repository contains two separate Next.js applications that explore the same general theme from different angles:

- `Embeding/`: a small semantic-search demo focused on generating text embeddings and comparing vectors with cosine similarity.
- `LocalApi/`: a larger local CRUD application with file-based persistence for `users` and `clients`, plus a semantic search endpoint powered by embeddings.

If you open the project from the root folder and want to understand it quickly, the most important idea is this:

The repository is not a single monolithic app. It is a workspace with two independent examples. One teaches the core embedding concept in a minimal way, and the other applies similar ideas inside a more realistic local admin-style application.

## Repository Overview

```text
friday-project/
├── README.md               # This guide
├── Embeding/               # Minimal vector embedding demo
└── LocalApi/               # File-based local API + UI + semantic search
```

## What Each Application Does

### 1. `Embeding`

This app is the smallest and most direct example in the repository.

Its purpose is to:

- receive a text query,
- convert that query into an embedding vector using Google Gemini,
- compare that vector against a small in-memory mock dataset,
- rank results using cosine similarity.

This project is useful if you want to understand the basic semantic-search flow without extra architectural complexity.

Core files:

- `Embeding/src/app/api/embed/route.ts`: API route that receives the query, generates the embedding, compares vectors, and returns sorted matches.
- `Embeding/src/servicio/iaService.ts`: integration with the Gemini embedding model.
- `Embeding/src/lib/utils.ts`: cosine similarity calculation.
- `Embeding/src/data/mockDatabase.ts`: static mock records used as the comparison dataset.
- `Embeding/src/app/page.tsx`: current UI entry point. At the moment it still contains the default Next.js starter page, so the main functional logic lives in the API route rather than the screen.

### 2. `LocalApi`

This app is a more complete local business-style application.

Its purpose is to show how to structure a Next.js app with:

- modular feature folders,
- typed CRUD flows,
- local file persistence,
- reusable shared components,
- semantic search over local records.

It includes two resources:

- `users`
- `clients`

Those resources are managed through Next.js route handlers and stored in a JSON file on disk.

Core files:

- `LocalApi/src/app/page.tsx`: main dashboard page that renders the search panel plus users and clients management panels.
- `LocalApi/src/server/database/database.json`: local file database.
- `LocalApi/src/server/database/file-database.ts`: read/write access to the JSON database.
- `LocalApi/src/app/api/users/...`: CRUD endpoints for users.
- `LocalApi/src/app/api/clients/...`: CRUD endpoints for clients.
- `LocalApi/src/app/api/search/route.ts`: vector search endpoint.
- `LocalApi/src/lib/embedding.ts`: embedding abstraction with Gemini support and a local fallback.
- `LocalApi/src/modules/**`: feature-oriented modules for domain types, services, repositories, client adapters, forms, and panels.

## Why There Are Two Apps

The repository looks like a progression:

1. `Embeding` explains the concept in the smallest possible implementation.
2. `LocalApi` shows how the same general idea can be inserted into a more practical application with entities, persistence, UI modules, and route handlers.

That makes the repo useful for both learning and demonstration:

- start in `Embeding` if you want to understand embeddings and cosine similarity first,
- move to `LocalApi` if you want to see architecture, CRUD patterns, and semantic search working together.

## How `Embeding` Works

The flow inside `Embeding` is:

1. A request is sent to `POST /api/embed`.
2. The route reads `{ query }` from the request body.
3. The route calls Gemini to generate an embedding vector for the query.
4. The generated vector is compared against every item in `MOCK_EMBEDDINGS`.
5. Cosine similarity is calculated for each item.
6. The API returns the results ordered by similarity.

Important note:

The sample vectors in `Embeding/src/data/mockDatabase.ts` are very small fixed arrays intended for demonstration. The Gemini model produces much larger real vectors. Conceptually the project explains semantic search correctly, but the current mock data should be understood as a teaching example rather than a production-ready vector store.

## How `LocalApi` Works

`LocalApi` is organized by features and layers.

### Main runtime flow

1. The UI loads the dashboard from `LocalApi/src/app/page.tsx`.
2. Feature panels call client adapters for `users` and `clients`.
3. Those adapters talk to Next.js API routes.
4. Server services and repositories read/write `database.json`.
5. The semantic search panel sends a query to `POST /api/search`.
6. The server generates embeddings for the query and the stored items.
7. Results are scored with cosine similarity and returned in descending order.

### Architectural layers in `LocalApi`

- `src/modules/users/` and `src/modules/clients/`
  Contains domain models, server services, repository logic, client API utilities, and UI components for each feature.
- `src/modules/shared/`
  Contains reusable UI pieces, typed helpers, and the generic CRUD hook `use-crud-resource.ts`.
- `src/server/database/`
  Contains the local persistence layer based on a JSON file.
- `src/app/api/`
  Contains route handlers for CRUD and search operations.
- `src/lib/embedding.ts`
  Encapsulates vector generation and cosine similarity logic.

## Semantic Search Strategy

Both projects revolve around embeddings, but `LocalApi` adds an important practical detail:

It can work even without external AI access.

`LocalApi/src/lib/embedding.ts` follows this strategy:

- if `GEMINI_API_KEY` is available and the Google SDK is installed, it uses the Gemini embedding model,
- otherwise, it falls back to a deterministic local embedding generator based on hashing.

This fallback is valuable because it allows the search feature to keep working in local development and testing environments, even when no external API key is configured.

Important limitation:

The fallback embedding is deterministic, but it is not semantically intelligent like a real embedding model. It is a development convenience, not a replacement for real AI-based similarity.

## API Endpoints

### `Embeding`

- `POST /api/embed`
  Expected body:

```json
{
  "query": "your text"
}
```

Returns:

- the original query,
- the ranked results,
- similarity percentages.

### `LocalApi`

Users:

- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

Clients:

- `GET /api/clients`
- `POST /api/clients`
- `GET /api/clients/:id`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`

Semantic search:

- `POST /api/search`

Expected body:

```json
{
  "query": "find admin contacts",
  "resource": "users",
  "topK": 5
}
```

Where:

- `query` is the natural-language search text,
- `resource` must be `"users"` or `"clients"`,
- `topK` is optional and controls the maximum number of returned results.

## Data Storage

`LocalApi` stores its data in:

- `LocalApi/src/server/database/database.json`

This means:

- there is no external database,
- the app is easy to run locally,
- every create, update, and delete operation writes directly to a file,
- the project is ideal for demos, workshops, and local experimentation.

It also means this app is not currently designed for production-scale concurrency, access control, or large datasets.

## Tech Stack

Both applications are built with:

- Next.js
- React
- TypeScript
- Tailwind CSS

They also use:

- `@google/generative-ai` for Gemini embeddings when configured.

## How To Run The Projects

These applications are independent, so each one should be started from its own folder.

### Run `Embeding`

```bash
cd Embeding
npm install
npm run dev
```

Default local URL:

- `http://localhost:3000`

To use real Gemini embeddings, create an `.env.local` file in `Embeding/` and add:

```env
GEMINI_API_KEY=your_key_here
```

### Run `LocalApi`

```bash
cd LocalApi
npm install
npm run dev
```

Default local URL:

- `http://localhost:3000`

To use real Gemini embeddings, create an `.env.local` file in `LocalApi/` and add:

```env
GEMINI_API_KEY=your_key_here
```

If you do not configure the key, `LocalApi` will still run thanks to the deterministic fallback embedding generator.

## Recommended Reading Order

If you are trying to understand the codebase from scratch, this order works well:

1. Read this root `README.md`.
2. Open `Embeding/src/app/api/embed/route.ts`.
3. Open `Embeding/src/servicio/iaService.ts`.
4. Open `Embeding/src/lib/utils.ts`.
5. Move to `LocalApi/src/app/page.tsx`.
6. Review `LocalApi/src/app/api/search/route.ts`.
7. Review `LocalApi/src/lib/embedding.ts`.
8. Review `LocalApi/src/server/database/file-database.ts`.
9. Explore `LocalApi/src/modules/users/` and `LocalApi/src/modules/clients/`.

## Current Observations

From the root perspective, these are helpful things to know before working on the project:

- `Embeding` is concept-focused and API-driven; its UI is still mostly the default starter page.
- `LocalApi` is the more complete and practical application in the repository.
- The repository uses folder names with capital letters: `Embeding/` and `LocalApi/`.
- `LocalApi` includes local development artifacts such as `.next/` and `node_modules/` inside the folder.

## In Short

This repository is best understood as a pair of related learning projects:

- `Embeding` teaches how embedding-based semantic comparison works.
- `LocalApi` shows how to integrate similar ideas into a structured local CRUD application.

If your goal is to understand the repository from the main folder, start with the distinction between those two apps. Once that is clear, the rest of the architecture becomes much easier to follow.
