"use client";

import { useState } from "react";

type Resource = "clients" | "users";

// Simple client-side search panel that calls the server vector search API.
// The component is intentionally minimal to be easy to adapt to different
// UI requirements while remaining fully functional out of the box.

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const [resource, setResource] = useState<Resource>("clients");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function runSearch() {
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, resource, topK: 10 }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
    } catch (err) {
      // In a production app we would surface this to the UI.
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mb-6">
      <div className="flex gap-2">
        <input
          aria-label="Search query"
          className="flex-1 rounded-md border px-3 py-2"
          placeholder="Search by text (semantic vector search)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="rounded-md border px-2" value={resource} onChange={(e) => setResource(e.target.value as Resource)}>
          <option value="clients">Clients</option>
          <option value="users">Users</option>
        </select>
        <button className="rounded-md bg-slate-800 px-4 py-2 text-white" onClick={runSearch} disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="mt-4">
        {results.length === 0 ? (
          <p className="text-sm text-slate-500">No results yet.</p>
        ) : (
          <table className="w-full table-auto text-left text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1">Score</th>
                <th className="px-2 py-1">Preview</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-1 align-top">{r.score.toFixed(3)}</td>
                  <td className="px-2 py-1">
                    <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(r.item, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
