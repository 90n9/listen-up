# ListenUp Push — come-back reminder service

Tiny Web-Push backend that nudges parents in the evening when their child's
streak is alive but they haven't played today. Stores subscriptions in a JSON
file on a mounted volume (no database, no native deps).

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Liveness probe |
| GET | `/api/vapid-public-key` | Public VAPID key for the client to subscribe |
| POST | `/api/subscribe` | Save a PushSubscription `{ subscription, tz, lastPlayedDate, streakDays }` |
| POST | `/api/sync` | Heartbeat `{ endpoint, lastPlayedDate, streakDays }` |
| POST | `/api/unsubscribe` | Remove `{ endpoint }` |
| POST | `/api/_run-reminders` | Manually fire the reminder sweep (testing) |

The cron sweep (default `0 18 * * *`, `Asia/Bangkok`) sends only to subscribers
whose `streakDays > 0` and whose `lastPlayedDate` is not today in their timezone.
Subscriptions returning 404/410 are pruned automatically.

## Generate VAPID keys (once)

```bash
npm install
npm run gen-vapid      # prints { publicKey, privateKey }
```

Keep `privateKey` secret. The `publicKey` is served to clients and is not secret.

## Environment

| Var | Required | Default |
| --- | --- | --- |
| `VAPID_PUBLIC_KEY` | ✅ | — |
| `VAPID_PRIVATE_KEY` | ✅ | — |
| `VAPID_SUBJECT` | | `mailto:narathip@rentspree.com` |
| `ALLOWED_ORIGIN` | | `*` → set to `https://listenup.gongideas.com` |
| `REMINDER_CRON` | | `0 18 * * *` |
| `REMINDER_TZ` | | `Asia/Bangkok` |
| `DATA_DIR` | | `/app/data` (mount a volume here) |
| `PORT` | | `8080` |

## Deploy on Dokploy (2nd service)

1. New **Application** in the same project, source = this repo, **build path** `server/`,
   Dockerfile `server/Dockerfile`.
2. Add env vars above (paste the generated VAPID keys; set `ALLOWED_ORIGIN`).
3. Mount a **Volume** at `/app/data` so subscriptions survive redeploys.
4. Add a domain, e.g. `listenup-api.gongideas.com` (Cloudflare A record → Dokploy
   IP `72.62.65.76`, **DNS only**), HTTPS via Let's Encrypt.
5. Rebuild the **frontend** with `--build-arg VITE_PUSH_API=https://listenup-api.gongideas.com`
   (or set the build arg in the frontend service's Dokploy config) so the notify
   toggle appears and the client talks to this API.

## Note on iOS

Web Push on iOS Safari only works after the user taps **Share → Add to Home
Screen**. The PWA manifest enables that; the notify toggle stays hidden until
the browser actually supports `PushManager`.
