// Purpose: make frontend API calls easier and safer.
// This helper automatically adds the logged-in user's Supabase Bearer token,
// sends JSON requests, and handles API errors in one shared place.

import { createClient } from '@/lib/supabase/client';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Fetch wrapper that auto-attaches Supabase auth token.
 * Used as the SWR fetcher and for mutation calls.
 */
export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const supabase = createClient();
  const token = supabase
    ? (await supabase.auth.getSession()).data.session?.access_token
    : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(errorBody.error || `Request failed: ${response.status}`, response.status);
  }

  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return null as unknown as T;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : (null as unknown as T);
}

/**
 * SWR fetcher — just calls apiFetch with the URL
 */
export const fetcher = <T = any>(url: string): Promise<T> => apiFetch<T>(url);
