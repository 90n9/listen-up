import { weekStrip, streakAtRisk, localDate, type Progress } from '../lib/useProgress';
import NotifyToggle from './NotifyToggle';

/** Thai single-letter weekday labels, Sunday-first. */
const THAI_DOW = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

/**
 * Daily-streak summary for the home screen: flame count, a 7-day strip of
 * played days, freeze count, and a gentle nudge when the streak is at risk.
 */
export default function StreakCard({ progress }: { progress: Progress }) {
  const strip = weekStrip(progress, 7);
  const today = localDate();
  const atRisk = streakAtRisk(progress);
  const hasStreak = progress.streakDays > 0;

  return (
    <div className="rounded-[26px] bg-white ring-1 ring-navy/8 shadow-card p-5 lg:p-6">
      {/* headline row */}
      <div className="flex items-center gap-4">
        <div
          className={`shrink-0 h-16 w-16 rounded-2xl flex flex-col items-center justify-center ${
            hasStreak ? 'bg-orange/12' : 'bg-navy/5'
          }`}
        >
          <span className={`text-3xl leading-none ${hasStreak ? '' : 'grayscale opacity-50'}`}>🔥</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[26px] lg:text-[30px] font-extrabold text-navy leading-none">
            {progress.streakDays}{' '}
            <span className="text-[16px] font-bold text-mute">วันติดกัน</span>
          </p>
          <p className="mt-1 text-[13px] text-mute">
            {atRisk
              ? 'เล่นวันนี้เพื่อรักษาสตรีคไว้นะ'
              : hasStreak
                ? 'เยี่ยม! วันนี้เล่นแล้ว มาต่อพรุ่งนี้กันนะ'
                : 'เริ่มเล่นวันนี้เพื่อสร้างสตรีค'}
          </p>
        </div>
        {progress.streakFreezes > 0 && (
          <span
            className="shrink-0 inline-flex items-center gap-1 rounded-full bg-ring2/10 px-2.5 py-1 text-[12px] font-extrabold text-ring2 ring-1 ring-ring2/20"
            title="ป้องกันสตรีคขาด 1 วัน"
          >
            🛡️ {progress.streakFreezes}
          </span>
        )}
      </div>

      {/* 7-day strip */}
      <div className="mt-5 flex items-center justify-between gap-1.5">
        {strip.map(({ date, played }) => {
          const dow = THAI_DOW[new Date(date + 'T00:00:00').getDay()];
          const isToday = date === today;
          return (
            <div key={date} className="flex flex-1 flex-col items-center gap-1.5">
              <span className={`text-[11px] font-semibold ${isToday ? 'text-orange' : 'text-mute'}`}>
                {dow}
              </span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[14px] transition-colors ${
                  played
                    ? 'bg-orange text-white shadow-card'
                    : isToday
                      ? 'bg-white ring-2 ring-dashed ring-orange/50 text-orange/60'
                      : 'bg-navy/5 text-transparent'
                }`}
              >
                {played ? '🔥' : '·'}
              </span>
            </div>
          );
        })}
      </div>

      {progress.bestStreak > progress.streakDays && (
        <p className="mt-4 text-center text-[12px] text-mute">
          สถิติสูงสุด {progress.bestStreak} วัน
        </p>
      )}

      <NotifyToggle progress={progress} />
    </div>
  );
}
