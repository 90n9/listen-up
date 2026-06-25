// ListenUp service worker — installability + Web Push come-back reminders.
// Intentionally cache-free: index.html is served no-cache and assets are
// content-hashed, so a pass-through fetch handler is enough for install.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// A (no-op) fetch handler is required for PWA installability in some browsers.
self.addEventListener('fetch', () => {});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'ListenUp', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'ListenUp';
  const options = {
    body: data.body || 'มาฝึกฟังกันวันนี้นะ',
    icon: '/logo.png',
    badge: '/mascot.png',
    data: { url: data.url || '/' },
    tag: 'listenup-reminder',
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
