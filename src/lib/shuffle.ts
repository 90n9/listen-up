/** Pick a random element from a non-empty array. */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Pick a random element, avoiding `exceptId` when possible so the same story
 * does not repeat back-to-back. Falls back to any element if the list is tiny.
 */
export function pickRandomExcept<T extends { id: string }>(arr: T[], exceptId?: string): T {
  if (!exceptId || arr.length <= 1) return pickRandom(arr);
  const pool = arr.filter((x) => x.id !== exceptId);
  return pickRandom(pool.length ? pool : arr);
}
