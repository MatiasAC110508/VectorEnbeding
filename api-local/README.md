This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# LocalApi

## Vector Search (Gemini embeddings)

This project includes a simple vector search endpoint and a client-side
search panel that demonstrates semantic search across the local `users`
and `clients` resources.

Configuration:

- To use Google Gemini embeddings, set the environment variable `GEMINI_API_KEY`.
	If the SDK `@google/generative-ai` is installed and the key is present
	the server will call the real embedding model. If not configured the
	application falls back to a deterministic local embedding generator so
	vector search remains functional in development.

Example environment file: see `.env.example`.

API:

- `POST /api/search` -> body `{ query: string, resource: 'clients'|'users', topK?: number }`

The response is JSON `{ results: [{ item, score }] }` sorted by score descending.

