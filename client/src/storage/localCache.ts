const PREFIX = 'archivist_cache_';

export function readCache<T>(table: string, userId: string): T[] {
  try {
    const raw = localStorage.getItem(PREFIX + table + ':' + userId);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function writeCache<T>(table: string, userId: string, rows: T[]): void {
  try {
    localStorage.setItem(PREFIX + table + ':' + userId, JSON.stringify(rows));
  } catch {
    // storage full or disabled — degrade silently
  }
}

export function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine !== false;
}
