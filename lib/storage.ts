export const storage = {
  read<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  write<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};
