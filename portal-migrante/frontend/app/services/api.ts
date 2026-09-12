const rawApiBase =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:4000/api";

const normalizedApiBase = rawApiBase.replace(/\/+$/, "");

export const API_BASE = normalizedApiBase.endsWith("/api")
  ? normalizedApiBase
  : `${normalizedApiBase}/api`;

export const AUTH_TOKEN_KEY = "portal.authToken";

export async function http<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
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
