import express from 'express';
import cron from 'node-cron';
import webpush from 'web-push';
import { upsert, sync, remove, all } from './store.js';

const {
  PORT = '8080',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
  VAPID_SUBJECT = 'mailto:narathip@rentspree.com',
  ALLOWED_ORIGIN = '*',
  REMINDER_CRON = '0 18 * * *', // 18:00 daily
  REMINDER_TZ = 'Asia/Bangkok',
} = process.env;

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error('FATAL: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY not set. Run `npm run gen-vapid`.');
  process.exit(1);
}
webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const app = express();
app.use(express.json({ limit: '16kb' }));

// CORS — frontend lives on a different origin (listenup.gongideas.com).
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/health', (_req, res) => res.json({ ok: true }));

// Public VAPID key so the client can subscribe without a build-time env.
app.get('/api/vapid-public-key', (_req, res) => res.json({ key: VAPID_PUBLIC_KEY }));

app.post('/api/subscribe', async (req, res) => {
  const { subscription, hour, tz, lastPlayedDate, streakDays } = req.body || {};
  if (!subscription?.endpoint) return res.status(400).json({ error: 'invalid subscription' });
  try {
    await upsert(subscription, { hour, tz, lastPlayedDate, streakDays });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// Lightweight heartbeat the client sends on load / after play, so the cron
// can skip users who already played today and stop nudging dead streaks.
app.post('/api/sync', async (req, res) => {
  const { endpoint, lastPlayedDate, streakDays } = req.body || {};
  if (!endpoint) return res.status(400).json({ error: 'missing endpoint' });
  await sync(endpoint, { lastPlayedDate, streakDays });
  res.json({ ok: true });
});

app.post('/api/unsubscribe', async (req, res) => {
  const { endpoint } = req.body || {};
  if (!endpoint) return res.status(400).json({ error: 'missing endpoint' });
  await remove(endpoint);
  res.json({ ok: true });
});

/** Local YYYY-MM-DD for a given IANA timezone. */
function todayIn(tz) {
  // en-CA gives ISO-ish YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date());
}

/** Send the streak-risk reminder to everyone who hasn't played today. */
async function sendReminders() {
  const subs = await all();
  const payload = JSON.stringify({
    title: 'อย่าให้สตรีคขาดนะ 🔥',
    body: 'มาฟังเรื่องสั้นวันละ 5 นาที รักษาสตรีคของลูกกันเถอะ!',
    url: '/start',
  });
  let sent = 0;
  let pruned = 0;
  for (const rec of subs) {
    const today = todayIn(rec.tz || REMINDER_TZ);
    // Only nudge a live streak that has not been continued today.
    if (rec.lastPlayedDate === today) continue;
    if ((rec.streakDays ?? 0) <= 0) continue;
    try {
      await webpush.sendNotification(rec.subscription, payload);
      sent++;
    } catch (err) {
      // 404/410 — subscription expired; drop it.
      if (err.statusCode === 404 || err.statusCode === 410) {
        await remove(rec.subscription.endpoint);
        pruned++;
      } else {
        console.error('push failed', err.statusCode, err.body || err.message);
      }
    }
  }
  console.log(`[reminders] sent=${sent} pruned=${pruned} total=${subs.length}`);
}

cron.schedule(REMINDER_CRON, sendReminders, { timezone: REMINDER_TZ });

// Manual trigger for testing (guard behind an env token in prod if exposed).
app.post('/api/_run-reminders', async (_req, res) => {
  await sendReminders();
  res.json({ ok: true });
});

app.listen(Number(PORT), () => {
  console.log(`listenup-push listening on :${PORT} — cron "${REMINDER_CRON}" (${REMINDER_TZ})`);
});
