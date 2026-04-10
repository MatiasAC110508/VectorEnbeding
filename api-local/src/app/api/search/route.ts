import { NextResponse } from "next/server";
import { readDatabase } from "@/server/database/file-database";
import { generateEmbedding, cosineSimilarity } from "@/lib/embedding";

// Server route handler for vector search over local resources (users/clients).
// Accepts a POST body: { query: string, resource: 'clients'|'users', topK?: number }
// Returns the top-K items sorted by cosine similarity to the query embedding.

type SearchBody = {
  query: string;
  resource: "clients" | "users";
  topK?: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SearchBody;

    if (!body || !body.query || !body.resource) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await readDatabase();
    const items = body.resource === "clients" ? db.clients : db.users;

    // Produce a simple textual representation per item for embedding.
    const toText = (item: any) => {
      if (body.resource === "clients") {
        return `${item.companyName} ${item.contactName} ${item.email}`;
      }
      return `${item.name} ${item.email} ${item.role}`;
    };

    // Compute query embedding and all item embeddings (in parallel).
    const queryEmbedding = await generateEmbedding(body.query);
    const itemEmbeddings = await Promise.all(items.map((it: any) => generateEmbedding(toText(it))));

    const scored = items.map((it: any, idx: number) => ({
      item: it,
      score: cosineSimilarity(queryEmbedding, itemEmbeddings[idx]),
    }));

    scored.sort((a, b) => b.score - a.score);

    const topK = Math.max(1, Math.min(body.topK ?? 10, 50));

    return NextResponse.json({ results: scored.slice(0, topK) });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
