import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/noto-sans-thai/400.css';
import '@fontsource/noto-sans-thai/600.css';
import '@fontsource/noto-sans-thai/700.css';
import '@fontsource/noto-sans-thai/800.css';
import '@fontsource/ibm-plex-sans-thai/400.css';
import '@fontsource/ibm-plex-sans-thai/500.css';
import '@fontsource/ibm-plex-sans-thai/600.css';
import '@fontsource/ibm-plex-sans-thai/700.css';
import './index.css';
import App from './App';
import { initAnalytics } from './lib/analytics';
import { getConsent } from './lib/consent';
import { pushConfigured } from './lib/push';

// Load GA on boot only if the user previously accepted cookies.
// Fresh visitors get GA only after accepting in the consent banner.
if (getConsent() === 'accepted') initAnalytics();

// Register the service worker so the PWA is installable and can receive push.
// Only when a push backend is configured; otherwise there's nothing to power it.
if (pushConfigured() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
