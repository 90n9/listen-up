import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'listenup.progress';

/** Day counts that trigger a full-screen milestone celebration. */
export const MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365];
/** A freeze is granted every time the streak crosses this many days. */
const FREEZE_GRANT_EVERY = 7;
/** Never hold more than this many freezes. */
const MAX_FREEZES = 2;

export interface RecentEntry {
  id: string;
  /** ISO datetime when last played. */
  ts: string;
}

export interface Progress {
  totalStars: number;
  completedSetIds: string[];
  streakDays: number;
  /** Highest streak ever reached. */
  bestStreak: number;
  /** Unused streak-freezes the player is holding. */
  streakFreezes: number;
  /** Local date (YYYY-MM-DD) of the last session, for streak math. */
  lastPlayedDate: string;
  /** Recent local dates (YYYY-MM-DD) played, newest last, capped at 60. */
  playedDates: string[];
  recent: RecentEntry[];
}

/** What changed in a single committed session — used to drive celebrations. */
export interface SessionSummary {
  prevStreak: number;
  newStreak: number;
  /** True the first time today's play is recorded (streak actually moved). */
  streakIncreased: boolean;
  /** A milestone day count just reached this session, else null. */
  milestone: number | null;
  /** A freeze was consumed to bridge a 1-day gap. */
  freezeUsed: boolean;
  /** A freeze was awarded this session. */
  freezeGranted: boolean;
  /** Base stars (correct answers) plus any combo bonus. */
  starsEarned: number;
  bonusStars: number;
}

const EMPTY: Progress = {
  totalStars: 0,
  completedSetIds: [],
  streakDays: 0,
  bestStreak: 0,
  streakFreezes: 0,
  lastPlayedDate: '',
  playedDates: [],
  recent: [],
};

export function localDate(d = new Date()): string {
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

/** True if no session has been recorded for the current local day yet. */
export function notPlayedToday(p: Progress): boolean {
  return p.lastPlayedDate !== localDate();
}

/**
 * The player has a live streak that will break unless they play today.
 * (A streak with a freeze in hand is not "at risk" — the freeze bridges it.)
 */
export function streakAtRisk(p: Progress): boolean {
  return p.streakDays > 0 && notPlayedToday(p);
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);
  // Mirror latest state so commitSession can compute + return a summary
  // synchronously without depending on a stale closure.
  const ref = useRef(progress);
  ref.current = progress;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore quota / private-mode errors
    }
  }, [progress]);

  /**
   * Record a finished session: award stars (+ optional combo bonus), mark
   * complete, advance the streak (honouring freezes), log recent play.
   * Returns a summary describing what changed so the UI can celebrate.
   */
  const commitSession = useCallback(
    (setId: string, correct: number, bonusStars = 0): SessionSummary => {
      const prev = ref.current;
      const today = localDate();
      const prevStreak = prev.streakDays;

      let streak = prevStreak;
      let freezes = prev.streakFreezes;
      let freezeUsed = false;
      const alreadyPlayedToday = prev.lastPlayedDate === today;

      if (alreadyPlayedToday) {
        // Replaying the same day never changes the streak.
        streak = Math.max(streak, 1);
      } else {
        const diff = prev.lastPlayedDate ? dayDiff(prev.lastPlayedDate, today) : Infinity;
        if (diff === 1) {
          streak = prevStreak + 1;
        } else if (diff === 2 && freezes > 0) {
          // Missed exactly one day, but a freeze bridges the gap.
          freezes -= 1;
          freezeUsed = true;
          streak = prevStreak + 1;
        } else {
          streak = 1;
        }
      }

      // Grant a freeze when the streak newly crosses a 7-day boundary.
      let freezeGranted = false;
      if (
        streak > prevStreak &&
        streak % FREEZE_GRANT_EVERY === 0 &&
        freezes < MAX_FREEZES
      ) {
        freezes += 1;
        freezeGranted = true;
      }

      const streakIncreased = streak > prevStreak;
      const milestone =
        streakIncreased && MILESTONES.includes(streak) ? streak : null;
      const starsEarned = correct + bonusStars;

      const playedDates = prev.playedDates.includes(today)
        ? prev.playedDates
        : [...prev.playedDates, today].slice(-60);

      const recent: RecentEntry[] = [
        { id: setId, ts: new Date().toISOString() },
        ...prev.recent.filter((r) => r.id !== setId),
      ].slice(0, 8);

      setProgress({
        totalStars: prev.totalStars + starsEarned,
        completedSetIds: prev.completedSetIds.includes(setId)
          ? prev.completedSetIds
          : [...prev.completedSetIds, setId],
        streakDays: streak,
        bestStreak: Math.max(prev.bestStreak, streak),
        streakFreezes: freezes,
        lastPlayedDate: today,
        playedDates,
        recent,
      });

      return {
        prevStreak,
        newStreak: streak,
        streakIncreased,
        milestone,
        freezeUsed,
        freezeGranted,
        starsEarned,
        bonusStars,
      };
    },
    [],
  );

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

/**
 * Build the last `days` local dates (oldest → newest) with a played flag,
 * for the home-screen week strip.
 */
export function weekStrip(p: Progress, days = 7): { date: string; played: boolean }[] {
  const played = new Set(p.playedDates);
  const today = new Date();
  const out: { date: string; played: boolean }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const iso = localDate(d);
    out.push({ date: iso, played: played.has(iso) });
  }
  return out;
}
