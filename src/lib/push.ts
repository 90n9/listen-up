// Web-Push client: register the service worker, gate on permission, subscribe
// against the self-hosted push backend, and sync streak state so the server
// only nudges users with a live streak who haven't played today.
//
// Backend base URL comes from VITE_PUSH_API (e.g. https://listenup-api.gongideas.com).
// When unset the whole feature degrades to "unsupported" and the UI hides itself.

const API = import.meta.env.VITE_PUSH_API as string | undefined;

export function pushConfigured(): boolean {
  return Boolean(API);
}

export function pushSupported(): boolean {
  return (
    pushConfigured() &&
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export type PushState = 'unsupported' | 'default' | 'granted' | 'denied';

export function permissionState(): PushState {
  if (!pushSupported()) return 'unsupported';
  return Notification.permission as PushState;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function api(path: string, body: unknown): Promise<Response> {
  return fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration();
  if (existing) return existing;
  return navigator.serviceWorker.register('/sw.js');
}

/**
 * Ask permission (parent-initiated), subscribe, and register with the backend.
 * @returns the resulting permission state.
 */
export async function enablePush(meta: {
  lastPlayedDate: string;
  streakDays: number;
}): Promise<PushState> {
  if (!pushSupported()) return 'unsupported';

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return permission as PushState;

  const reg = await getRegistration();
  await navigator.serviceWorker.ready;

  // Fetch the server's public VAPID key (avoids a build-time secret).
  const keyRes = await fetch(`${API}/api/vapid-public-key`);
  const { key } = (await keyRes.json()) as { key: string };

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key) as BufferSource,
    });
  }

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Bangkok';
  await api('/api/subscribe', {
    subscription: sub.toJSON(),
    tz,
    lastPlayedDate: meta.lastPlayedDate,
    streakDays: meta.streakDays,
  });
  return 'granted';
}

/** Turn off reminders: remove the subscription locally and on the server. */
export async function disablePush(): Promise<void> {
  if (!pushSupported()) return;
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  if (sub) {
    await api('/api/unsubscribe', { endpoint: sub.endpoint }).catch(() => {});
    await sub.unsubscribe().catch(() => {});
  }
}

/**
 * Heartbeat: tell the backend the latest streak state so it can skip users
 * who already played today. Safe no-op when push isn't enabled.
 */
export async function syncPush(meta: { lastPlayedDate: string; streakDays: number }): Promise<void> {
  if (!pushSupported() || Notification.permission !== 'granted') return;
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  if (!sub) return;
  await api('/api/sync', {
    endpoint: sub.endpoint,
    lastPlayedDate: meta.lastPlayedDate,
    streakDays: meta.streakDays,
  }).catch(() => {});
}
