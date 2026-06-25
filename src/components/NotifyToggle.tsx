import { useState } from 'react';
import {
  enablePush,
  disablePush,
  permissionState,
  pushSupported,
  type PushState,
} from '../lib/push';
import type { Progress } from '../lib/useProgress';

/**
 * Parent-gated opt-in for come-back push reminders. Hidden entirely when the
 * push backend isn't configured or the browser can't do Web Push (e.g. iOS
 * Safari before "Add to Home Screen").
 */
export default function NotifyToggle({ progress }: { progress: Progress }) {
  const [state, setState] = useState<PushState>(permissionState());
  const [busy, setBusy] = useState(false);

  if (!pushSupported()) return null;

  const meta = { lastPlayedDate: progress.lastPlayedDate, streakDays: progress.streakDays };

  const enable = async () => {
    setBusy(true);
    try {
      setState(await enablePush(meta));
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      await disablePush();
      setState(permissionState());
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-canvas/70 px-4 py-3 ring-1 ring-navy/5">
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-navy">🔔 เตือนให้กลับมาเล่น</p>
        <p className="text-[11.5px] text-mute">
          {state === 'granted'
            ? 'เปิดอยู่ — เราจะเตือนช่วงเย็นถ้ายังไม่ได้เล่น'
            : state === 'denied'
              ? 'ถูกปิดในเบราว์เซอร์ เปิดได้จากการตั้งค่าเว็บไซต์'
              : 'สำหรับผู้ปกครอง — แจ้งเตือนวันละครั้งช่วงเย็น'}
        </p>
      </div>
      {state === 'granted' ? (
        <button
          onClick={disable}
          disabled={busy}
          className="tap shrink-0 rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-navy ring-1 ring-navy/12 shadow-card hover:bg-canvas disabled:opacity-50"
        >
          ปิด
        </button>
      ) : state === 'denied' ? (
        <span className="shrink-0 text-[12px] font-bold text-mute">ปิดอยู่</span>
      ) : (
        <button
          onClick={enable}
          disabled={busy}
          className="tap shrink-0 rounded-full bg-teal px-4 py-2 text-[13px] font-extrabold text-white shadow-card hover:bg-teal-deep disabled:opacity-50"
        >
          {busy ? '...' : 'เปิดเตือน'}
        </button>
      )}
    </div>
  );
}
