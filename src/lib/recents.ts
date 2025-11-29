export type RecentItem = {
  label: string;
  path: string;
  at: number;
};

const STORAGE_KEY = "bi-mobile-recents";
const MAX_ITEMS = 6;

export function getRecents(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export function addRecent(item: RecentItem) {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecents();
    const filtered = existing.filter((r) => r.path !== item.path);
    const next = [item, ...filtered].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error(err);
  }
}
