/**
 * Thin fetch wrapper around the backend API.
 *
 * - Sends cookies (session) on every request via `credentials: "include"`.
 * - Parses JSON and throws `ApiRequestError` with the backend's {error} message.
 * - Never leaks raw network errors to the UI.
 */

import type { ApiError } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  // Only JSON string bodies get a Content-Type — FormData uploads (T7) must
  // let the browser set the multipart boundary itself.
  if (typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...options,
      headers,
    });
  } catch {
    throw new ApiRequestError(0, "Network error — is the server reachable?");
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (data as ApiError | null)?.error ?? `Request failed (${response.status})`;
    throw new ApiRequestError(response.status, message);
  }
  return data as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "PUT", body: JSON.stringify(body) });
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}
