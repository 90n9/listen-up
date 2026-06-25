// Tiny JSON-file subscription store. No native deps; persisted to a Docker
// volume via DATA_DIR. Keyed by push-subscription endpoint (unique per device).
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || './data';
const FILE = join(DATA_DIR, 'subscriptions.json');

/** @type {Map<string, object>} endpoint -> record */
let cache = null;
let writing = Promise.resolve();

async function ensureLoaded() {
  if (cache) return;
  cache = new Map();
  try {
    const raw = await readFile(FILE, 'utf8');
    const arr = JSON.parse(raw);
    for (const rec of arr) {
      // Skip corrupt/partial records instead of aborting the whole load.
      const endpoint = rec?.subscription?.endpoint;
      if (endpoint) cache.set(endpoint, rec);
    }
  } catch {
    // first run / missing file — start empty
  }
}

async function persist() {
  // Serialize writes so concurrent requests don't clobber the file, and
  // reset the chain on failure so one bad write doesn't poison all future ones.
  writing = writing.then(
    () => doWrite(),
    () => doWrite(),
  );
  return writing;
}

async function doWrite() {
  await mkdir(dirname(FILE), { recursive: true });
  // Atomic swap: write to a temp file then rename, so a crash mid-write
  // can't corrupt the live subscription list.
  const tmp = `${FILE}.tmp`;
  await writeFile(tmp, JSON.stringify([...cache.values()], null, 2));
  await rename(tmp, FILE);
}

/**
 * Insert or update a subscription.
 * @param {object} subscription PushSubscription JSON
 * @param {object} meta { hour, tz, lastPlayedDate, streakDays }
 */
export async function upsert(subscription, meta = {}) {
  await ensureLoaded();
  const endpoint = subscription?.endpoint;
  if (!endpoint) throw new Error('missing endpoint');
  const existing = cache.get(endpoint) || {};
  cache.set(endpoint, {
    subscription,
    hour: meta.hour ?? existing.hour ?? 18,
    tz: meta.tz ?? existing.tz ?? 'Asia/Bangkok',
    lastPlayedDate: meta.lastPlayedDate ?? existing.lastPlayedDate ?? '',
    streakDays: meta.streakDays ?? existing.streakDays ?? 0,
  });
  await persist();
}

/** Update only the play-state fields for an endpoint (no-op if unknown). */
export async function sync(endpoint, meta = {}) {
  await ensureLoaded();
  const rec = cache.get(endpoint);
  if (!rec) return false;
  if (meta.lastPlayedDate !== undefined) rec.lastPlayedDate = meta.lastPlayedDate;
  if (meta.streakDays !== undefined) rec.streakDays = meta.streakDays;
  await persist();
  return true;
}

export async function remove(endpoint) {
  await ensureLoaded();
  const had = cache.delete(endpoint);
  if (had) await persist();
  return had;
}

export async function all() {
  await ensureLoaded();
  return [...cache.values()];
}
