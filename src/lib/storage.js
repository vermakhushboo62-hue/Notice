const KEY = 'notice.v1'

export const emptyState = () => ({ version: 1, results: [], nextFocus: null })

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    return { ...emptyState(), ...parsed, results: Array.isArray(parsed.results) ? parsed.results : [] }
  } catch {
    return emptyState()
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage unavailable (private mode) — app still works for this session */
  }
}

export function clearState() {
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
}
