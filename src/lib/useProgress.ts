import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'listenup.progress';

export interface RecentEntry {
  id: string;
  /** ISO datetime when last played. */
  ts: string;
}

export interface Progress {
  totalStars: number;
  completedSetIds: string[];
  streakDays: number;
  /** Local date (YYYY-MM-DD) of the last session, for streak math. */
  lastPlayedDate: string;
  recent: RecentEntry[];
}

const EMPTY: Progress = {
  totalStars: 0,
  completedSetIds: [],
  streakDays: 0,
  lastPlayedDate: '',
  recent: [],
};

function localDate(d = new Date()): string {
  // YYYY-MM-DD in local time
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function dayDiff(fromISODate: string, toISODate: string): number {
  const a = new Date(fromISODate + 'T00:00:00');
  const b = new Date(toISODate + 'T00:00:00');
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Progress>) };
  } catch {
    return EMPTY;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore quota / private-mode errors
    }
  }, [progress]);

  /** Record a finished session: award stars, mark complete, bump streak, log recent. */
  const commitSession = useCallback((setId: string, starsEarned: number) => {
    setProgress((prev) => {
      const today = localDate();
      let streak = prev.streakDays;
      if (prev.lastPlayedDate === today) {
        // already played today, keep streak
        streak = Math.max(streak, 1);
      } else {
        const diff = prev.lastPlayedDate ? dayDiff(prev.lastPlayedDate, today) : Infinity;
        streak = diff === 1 ? prev.streakDays + 1 : 1;
      }

      const recent: RecentEntry[] = [
        { id: setId, ts: new Date().toISOString() },
        ...prev.recent.filter((r) => r.id !== setId),
      ].slice(0, 8);

      return {
        totalStars: prev.totalStars + starsEarned,
        completedSetIds: prev.completedSetIds.includes(setId)
          ? prev.completedSetIds
          : [...prev.completedSetIds, setId],
        streakDays: streak,
        lastPlayedDate: today,
        recent,
      };
    });
  }, []);

  const reset = useCallback(() => setProgress(EMPTY), []);

  return { progress, commitSession, reset };
}

/** Thai relative-time label for the recently-played list. */
export function formatThaiRelative(ts: string): string {
  const diff = dayDiff(localDate(new Date(ts)), localDate());
  if (diff <= 0) return 'วันนี้';
  if (diff === 1) return 'เมื่อวานนี้';
  if (diff < 7) return `${diff} วันแล้ว`;
  if (diff < 30) return `${Math.floor(diff / 7)} สัปดาห์แล้ว`;
  return `${Math.floor(diff / 30)} เดือนแล้ว`;
}
