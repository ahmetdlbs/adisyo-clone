/** Replaces the item with the same id (keeping its position) or appends it. Returns a new array. */
export function upsertById<T extends { id: string }>(items: readonly T[], item: T): readonly T[] {
  const exists = items.some((current) => current.id === item.id);
  return exists ? items.map((current) => (current.id === item.id ? item : current)) : [...items, item];
}

/** Returns a new array without the item that has this id. */
export function removeById<T extends { id: string }>(items: readonly T[], id: string): readonly T[] {
  return items.filter((item) => item.id !== id);
}

const foldName = (name: string) => name.trim().toLocaleLowerCase("tr");

/**
 * True when another item already has this name (Turkish case folding: `İ`↔`i`, `I`↔`ı`).
 * Pass the id of the item being edited so it can keep its own name.
 */
export function isNameTaken(items: readonly { id: string; name: string }[], name: string, ignoreId: string | null = null): boolean {
  const wanted = foldName(name);
  return items.some((item) => item.id !== ignoreId && foldName(item.name) === wanted);
}
