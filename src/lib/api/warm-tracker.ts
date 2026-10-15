// Tracks whether the Render backend server is already awake and warm in the current session.
// Render free tier only sleeps after 15 minutes of inactivity. Once awake, the server responds
// quickly and should NEVER show the 40-50s cold-start notice during normal page switching.

const WARM_KEY = "render_backend_warmed_at";
const RENDER_IDLE_TIMEOUT_MS = 14 * 60 * 1000; // 14 minutes

let inMemoryWarm = false;

export function isBackendWarm(): boolean {
  if (inMemoryWarm) return true;
  if (typeof window === "undefined") return false;

  try {
    const raw = sessionStorage.getItem(WARM_KEY);
    if (!raw) return false;
    const warmedAt = parseInt(raw, 10);
    const isStillWarm = Date.now() - warmedAt < RENDER_IDLE_TIMEOUT_MS;
    if (isStillWarm) {
      inMemoryWarm = true;
      return true;
    }
  } catch {
    // Ignore storage errors
  }
  return false;
}

export function markBackendWarm(): void {
  inMemoryWarm = true;
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(WARM_KEY, Date.now().toString());
  } catch {
    // Ignore storage errors
  }
}
