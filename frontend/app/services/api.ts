// frontend/app/services/api.ts
const rawApiBase =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:4000/api";

const normalizedApiBase = rawApiBase.replace(/\/+$/, "");

export const API_BASE = normalizedApiBase.endsWith("/api")
  ? normalizedApiBase
  : `${normalizedApiBase}/api`;

export async function http<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = text;
    try {
      const data = JSON.parse(text) as { message?: string; error?: string };
      message = data.message || data.error || text;
    } catch {
      message = text;
    }
    throw new Error(message || `Request failed (${res.status})`);
  }

  return res.json().catch(() => ({})) as Promise<T>;
}
