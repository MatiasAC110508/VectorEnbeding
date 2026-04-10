export async function httpClient<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? "The request could not be completed.");
  }

  return payload;
}
