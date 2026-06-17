import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { PlayIcon, CheckIcon, ChevronLeft } from '../components/icons';
import { Cloud, WaveDivider } from '../components/Scene';
import { LIBRARY } from '../data/library';
import { THEME_LABELS } from '../data/types';
import type { Level, Theme } from '../data/types';
import { useProgress } from '../lib/useProgress';

const LEVELS: {
  value: Level;
  tint: string;
  text: string;
  ring: string;
  solid: string;
  active: string;
}[] = [
  { value: 1, tint: 'bg-teal/12', text: 'text-teal', ring: 'ring-teal/30', solid: 'bg-teal', active: 'bg-teal text-white ring-teal' },
  { value: 2, tint: 'bg-ring2/12', text: 'text-ring2', ring: 'ring-ring2/30', solid: 'bg-ring2', active: 'bg-ring2 text-white ring-ring2' },
  { value: 3, tint: 'bg-orange/12', text: 'text-orange', ring: 'ring-orange/30', solid: 'bg-orange', active: 'bg-orange text-white ring-orange' },
];

const ALL_THEMES = Object.keys(THEME_LABELS) as Theme[];

export default function BrowseScreen() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [level, setLevel] = useState<Level | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);

  const filtered = useMemo(
    () =>
      LIBRARY.filter(
        (s) => (level === null || s.level === level) && (theme === null || s.themes.includes(theme)),
      ),
    [level, theme],
  );

  const levelMeta = (lv: Level) => LEVELS.find((l) => l.value === lv)!;

  return (
    <AppShell size="wide">
      {/* sky band */}
      <section className="sky relative overflow-hidden">
        <Cloud className="absolute top-6 right-[12%] w-20 lg:w-28 opacity-85 float-mid" />
        <Cloud className="absolute top-16 left-[6%] w-16 lg:w-24 opacity-75 float-slow" />
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 lg:px-10 pt-7 pb-10 lg:pt-9 lg:pb-12">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="tap h-11 w-11 rounded-2xl bg-white ring-1 ring-navy/8 flex items-center justify-center text-navy shadow-card hover:bg-canvas"
              aria-label="กลับ"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-[26px] lg:text-[32px] font-extrabold tracking-tight text-navy drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">คลังเรื่อง</h1>
            <span className="ml-auto rounded-full bg-white/80 px-3.5 py-1.5 text-[13px] font-extrabold text-teal-deep shadow-card">{filtered.length} เรื่อง</span>
          </div>
        </div>
        <WaveDivider className="w-full h-10 lg:h-14" color="#F2FAF4" />
      </section>

      <div className="bg-[#F2FAF4] min-h-[60vh]">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-10 pt-2 pb-14">
          {/* level filter */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Chip active={level === null} onClick={() => setLevel(null)}>
              ทุกระดับ
            </Chip>
            {LEVELS.map((l) => (
              <Chip
                key={l.value}
                active={level === l.value}
                activeClass={l.active}
                onClick={() => setLevel(level === l.value ? null : l.value)}
              >
                ระดับ {l.value}
              </Chip>
            ))}
          </div>

          {/* theme filter */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Chip active={theme === null} onClick={() => setTheme(null)}>
              ทุกหมวด
            </Chip>
            {ALL_THEMES.map((t) => (
              <Chip key={t} active={theme === t} onClick={() => setTheme(theme === t ? null : t)}>
                {THEME_LABELS[t]}
              </Chip>
            ))}
          </div>

          {/* story grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {filtered.map((s) => {
              const done = progress.completedSetIds.includes(s.id);
              const lm = levelMeta(s.level);
              return (
                <button
                  key={s.id}
                  onClick={() => navigate(`/play/${s.id}`)}
                  className="card-pop group relative overflow-hidden text-left rounded-[26px] bg-white ring-1 ring-navy/8 shadow-card p-5 flex flex-col gap-3 hover:ring-teal/30"
                >
                  {/* level color accent bar */}
                  <span className={`absolute inset-x-0 top-0 h-1.5 ${lm.solid}`} />
                  <div className="flex items-center gap-2 pt-1">
                    <span className={`rounded-full ${lm.tint} ${lm.text} ring-1 ${lm.ring} px-3 py-1 text-[12px] font-extrabold`}>
                      ระดับ {s.level}
                    </span>
                    {done && (
                      <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-grass/14 text-grass-deep px-2.5 py-1 text-[11.5px] font-extrabold ring-1 ring-grass/25">
                        <CheckIcon className="w-3.5 h-3.5" />
                        เล่นแล้ว
                      </span>
                    )}
                  </div>
                  <p className="font-display text-[20px] font-extrabold text-navy">{s.title}</p>
                  <p className="text-[13.5px] text-mute leading-snug line-clamp-2">{s.sentence}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {s.themes.map((t) => (
                        <span key={t} className="rounded-full bg-[#F2FAF4] px-2.5 py-0.5 text-[11.5px] font-semibold text-mute ring-1 ring-navy/8">
                          {THEME_LABELS[t]}
                        </span>
                      ))}
                    </div>
                    <span className={`shrink-0 h-10 w-10 rounded-full ${lm.solid} flex items-center justify-center text-white shadow-card group-hover:scale-110 transition-transform`}>
                      <PlayIcon className="w-4 h-4 ml-0.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-[26px] bg-white ring-1 ring-navy/8 shadow-card px-5 py-10 text-center">
              <p className="text-[14px] text-mute">ไม่พบเรื่องที่ตรงกับตัวกรอง ลองเลือกใหม่อีกครั้ง</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Chip({
  children,
  active,
  activeClass,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  activeClass?: string;
  onClick: () => void;
}) {
  const base = 'tap rounded-full px-4 py-2 text-[13.5px] font-bold ring-1 shadow-card transition-colors';
  const on = activeClass ?? 'bg-navy text-white ring-navy';
  const off = 'bg-white text-mute ring-navy/10 hover:text-navy hover:bg-white';
  return (
    <button onClick={onClick} className={`${base} ${active ? on : off}`}>
      {children}
    </button>
  );
}
