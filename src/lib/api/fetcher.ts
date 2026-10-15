// Purpose: make frontend API calls easier and safer.
// This helper automatically adds the logged-in user's Supabase Bearer token,
// sends JSON requests, and handles API errors in one shared place.

import { createClient } from '@/lib/supabase/client';
import { isBackendWarm, markBackendWarm } from './warm-tracker';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let activeRequests = 0;
let slowTimer: NodeJS.Timeout | null = null;
let isSlowNoticeActive = false;

function notifyColdStart(state: 'slow' | 'ready') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('render-backend-cold-start', { detail: { state } })
    );
  }
}

function startSlowTracker() {
  // If backend is already warm from a previous response, NEVER trigger the cold start banner
  if (isBackendWarm()) return;

  activeRequests++;
  if (activeRequests === 1 && !slowTimer) {
    slowTimer = setTimeout(() => {
      // Re-verify backend isn't already warm before firing notification
      if (activeRequests > 0 && !isBackendWarm()) {
        isSlowNoticeActive = true;
        notifyColdStart('slow');
      }
    }, 6000); // 6 seconds threshold: real cold-boots take ~30-50s, normal queries take <3s
  }
}

function stopSlowTracker() {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) {
    if (slowTimer) {
      clearTimeout(slowTimer);
      slowTimer = null;
    }
    if (isSlowNoticeActive) {
      isSlowNoticeActive = false;
      markBackendWarm();
      notifyColdStart('ready');
    }
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

  startSlowTracker();
  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
    // Any successful or completed response proves the backend is alive and warm
    markBackendWarm();
  } finally {
    stopSlowTracker();
  }

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
