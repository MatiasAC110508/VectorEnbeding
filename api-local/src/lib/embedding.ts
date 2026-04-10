import crypto from "node:crypto";
import { readFileSync } from "fs";

// This module provides a unified abstraction for obtaining text embeddings.
// It prefers the Gemini (Google Generative AI) embedding model when a
// `GEMINI_API_KEY` environment variable is present. When the external SDK
// is not available or the environment variable is missing, it falls back to
// a deterministic local embedding generator so the application remains
// functional for development and testing.

type Vector = number[];

let useGemini = !!process.env.GEMINI_API_KEY;

// Lazy-load the Gemini client to avoid hard dependency failures at runtime.
let geminiClient: any | undefined;

async function ensureGeminiClient() {
  if (!useGemini) return false;
  if (geminiClient) return true;
  try {
    // Attempt to require the official Google Generative AI package if installed.
    // We use a dynamic require to keep the package optional for development.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return true;
  } catch (err) {
    // If the package is not present, silently fall back to the local generator.
    useGemini = false;
    return false;
  }
}

export async function generateEmbedding(text: string): Promise<Vector> {
  // Prefer Geminifor real embeddings when configured.
  if (await ensureGeminiClient()) {
    const model = geminiClient.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent([text]);
    // The provider returns an object with an embedding vector in `values`.
    return result.embedding.values as number[];
  }

  // Fallback: deterministic local embedding using SHA-256 bytes.
  // This is not semantically meaningful but it lets us test vector
  // search and similarity ranking without external calls.
  return localDeterministicEmbedding(text, 128);
}

function localDeterministicEmbedding(text: string, dim = 128): Vector {
  // Create a SHA-256 digest and expand it to the requested dimension.
  const hash = crypto.createHash("sha256").update(text).digest();
  const vector: number[] = new Array(dim).fill(0);

  for (let i = 0; i < dim; i++) {
    // Distribute bytes across the vector and map to [-1, 1].
    const b = hash[i % hash.length];
    vector[i] = (b / 255) * 2 - 1;
  }

  // Normalize to unit length to make cosine similarity behave nicely.
  const norm = Math.sqrt(vector.reduce((s, v) => s + v * v, 0)) || 1;
  return vector.map((v) => v / norm);
}

export function cosineSimilarity(a: Vector, b: Vector) {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  if (denom === 0) return 0;
  return dot / denom;
}
