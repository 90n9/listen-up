import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import AppShell from '../components/AppShell';
import { ArrowRight } from '../components/icons';
import { LIBRARY, getStoryById, storiesByLevel } from '../data/library';
import { pickRandomExcept } from '../lib/shuffle';
import { useProgress } from '../lib/useProgress';

interface ResultState {
  setId: string;
  correct: number;
  total: number;
}

const BRAND = ['#1AA9B0', '#F58220', '#5FBF3F', '#2E7DD1', '#1B3A6B'];

export default function ResultsScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultState | null;
  const { progress, commitSession } = useProgress();
  const committed = useRef(false);

  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!state || committed.current) return;
    committed.current = true;
    commitSession(state.setId, state.correct);

    if (!reduceMotion) {
      const fire = (ratio: number, opts: confetti.Options) =>
        confetti({ origin: { y: 0.6 }, colors: BRAND, particleCount: Math.floor(220 * ratio), ...opts });
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.35, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    }
  }, [state, commitSession, reduceMotion]);

  if (!state) return <Navigate to="/" replace />;

  const { setId, correct, total } = state;
  const ratio = correct / total;
  const message =
    ratio === 1 ? 'เก่งมาก!' : ratio >= 0.6 ? 'เยี่ยมมาก!' : 'ดีแล้ว ลองอีกครั้งนะ';
  const sub =
    ratio === 1
      ? 'ลูกตอบถูกทุกข้อเลย ลองเรื่องต่อไปกันไหม'
      : ratio >= 0.6
        ? 'เกือบเต็มแล้ว ฝึกอีกนิดก็เก่งสุดๆ'
        : 'ฟังอีกครั้งแล้วลองตอบใหม่ ค่อยๆเก่งขึ้นทุกวัน';

  // Stay within the level the parent picked for this session (the played
  // story's level); fall back to the whole library if it's somehow unknown.
  const playedLevel = getStoryById(setId)?.level;
  const pool = playedLevel ? storiesByLevel(playedLevel) : LIBRARY;
  const playAgain = () => navigate(`/play/${pickRandomExcept(pool, setId).id}`, { replace: true });

  return (
    <AppShell size="narrow" header={false}>
      <div className="relative px-6 lg:px-8 pt-10 pb-10 text-center">
        {/* celebrating mascot */}
        <div className="relative inline-flex items-center justify-center pop">
          <div className="absolute -inset-2 rounded-full bg-white/60 blur-md" />
          <div className="relative h-32 w-32 rounded-full bg-white ring-4 ring-orange/25 flex items-center justify-center shadow-float overflow-hidden">
            <img src="/mascot.png" alt="" className="h-28 w-auto object-contain float-slow" />
          </div>
          <span className="sparkle absolute -top-1 -right-1 text-orange text-2xl" aria-hidden>✦</span>
          <span className="sparkle absolute bottom-1 -left-2 text-teal text-lg" style={{ animationDelay: '.8s' }} aria-hidden>✦</span>
          <span className="sparkle absolute top-3 -left-4 text-grass text-base" style={{ animationDelay: '1.2s' }} aria-hidden>✦</span>
        </div>

        <h2 className="font-display mt-6 text-[30px] font-extrabold tracking-tight text-navy fade-in">{message}</h2>
        <p className="mt-2 text-[15px] text-mute fade-in max-w-[20rem] mx-auto">{sub}</p>

        {/* score */}
        <div className="mt-7 inline-flex flex-col items-center fade-in">
          <p className="text-[13px] font-semibold tracking-[0.16em] uppercase text-teal">คะแนนรอบนี้</p>
          <p className="font-display mt-1 text-[40px] font-extrabold text-navy leading-none">
            ได้ {correct}/{total} ดาว
          </p>
        </div>

        {/* star row */}
        <div className="mt-5 flex items-center justify-center gap-2.5 fade-in" aria-hidden>
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`text-3xl pop ${i < correct ? '' : 'grayscale opacity-30'}`}
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* streak strip */}
        {progress.streakDays > 0 && (
          <div className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-canvas/80 px-4 py-3 ring-1 ring-navy/5 fade-in">
            <span className="rounded-full bg-grass/12 px-2.5 py-1 text-[12.5px] font-bold text-grass-deep ring-1 ring-grass/20">
              สตรีค {progress.streakDays} วัน
            </span>
            <span className="rounded-full bg-orange/12 px-2.5 py-1 text-[12.5px] font-bold text-orange ring-1 ring-orange/20">
              รวม {progress.totalStars} ดาว
            </span>
          </div>
        )}

        {/* buttons */}
        <div className="mt-8 space-y-3 fade-in">
          <button
            onClick={playAgain}
            className="tap w-full min-h-[58px] rounded-full bg-orange text-white text-[18px] font-extrabold tracking-tight shadow-float hover:brightness-105 flex items-center justify-center gap-2"
          >
            เล่นอีก
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="tap w-full min-h-[54px] rounded-full bg-white text-navy text-[16px] font-extrabold ring-1 ring-navy/12 shadow-card hover:bg-canvas flex items-center justify-center"
          >
            กลับหน้าแรก
          </button>
        </div>
      </div>
    </AppShell>
  );
}
