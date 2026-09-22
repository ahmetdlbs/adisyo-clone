const fold = (text: string) => text.trim().toLocaleLowerCase("tr");

/** Case-insensitive substring match with Turkish folding (`İ`↔`i`, `I`↔`ı`). A blank query matches everything. */
export function matchesQuery(text: string, query: string): boolean {
  const needle = fold(query);
  return needle === "" || fold(text).includes(needle);
}

/** Items whose searchable text matches the query. Returns a new array. */
export function filterByQuery<T>(items: readonly T[], query: string, getText: (item: T) => string): readonly T[] {
  return items.filter((item) => matchesQuery(getText(item), query));
}
