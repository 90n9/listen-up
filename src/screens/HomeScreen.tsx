import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import {
  PlayIcon,
  BookIcon,
  QuestionIcon,
  ShuffleIcon,
  ClockIcon,
  ChevronRight,
  StoreIcon,
  LeafIcon,
  ArrowRight,
} from '../components/icons';
import { Cloud, Sun, Tree, Boat, HillsWater, WaveDivider } from '../components/Scene';
import { getStoryById } from '../data/library';
import { useProgress, formatThaiRelative } from '../lib/useProgress';
import type { StorySet } from '../data/types';

interface Mode {
  key: string;
  title: string;
  desc: string;
  cta: string;
  icon: typeof BookIcon;
  /** chunky color-block card surface + accents */
  surface: string;
  chip: string;
  pill: string;
  onClick: () => void;
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { progress } = useProgress();

  const startPractice = () => navigate('/start');

  const modes: Mode[] = [
    {
      key: 'stories',
      title: 'เรื่องสั้น',
      desc: 'ฟังเรื่องสั้น แล้วตอบคำถาม',
      cta: 'เลือกเรื่อง',
      icon: BookIcon,
      surface: 'bg-[#FFC23C]',
      chip: 'text-[#B26A00]',
      pill: 'bg-white/90 text-[#B26A00]',
      onClick: () => navigate('/browse'),
    },
    {
      key: 'questions',
      title: 'คำถาม',
      desc: 'ฝึกตอบคำถามหลากหลายแบบ',
      cta: 'เริ่มฝึก',
      icon: QuestionIcon,
      surface: 'bg-grass',
      chip: 'text-grass-deep',
      pill: 'bg-white/90 text-grass-deep',
      onClick: () => navigate('/browse'),
    },
    {
      key: 'random',
      title: 'สุ่มการ์ด',
      desc: 'สุ่มเรื่องมาลองเล่นเลย',
      cta: 'สุ่มเลย',
      icon: ShuffleIcon,
      surface: 'bg-orange',
      chip: 'text-orange',
      pill: 'bg-white/90 text-orange',
      onClick: startPractice,
    },
  ];

  const recent = progress.recent
    .map((r) => ({ entry: r, story: getStoryById(r.id) }))
    .filter((x): x is { entry: typeof x.entry; story: StorySet } => Boolean(x.story));

  return (
    <AppShell size="wide">
      {/* ── Immersive hero scene ─────────────────────────── */}
      <section className="sky relative overflow-hidden">
        {/* sky ornaments */}
        <Sun className="absolute -top-3 right-6 lg:right-20 w-24 lg:w-36 float-slow" />
        <Cloud className="absolute top-10 left-[6%] w-24 lg:w-32 opacity-95 float-mid" />
        <Cloud className="absolute top-24 right-[34%] w-16 lg:w-24 opacity-90 float-slow" />
        <Cloud className="absolute top-6 left-[44%] w-20 lg:w-28 opacity-80 float-mid" />

        <div className="relative z-10 mx-auto max-w-[1240px] px-5 lg:px-10 pt-10 pb-44 lg:pt-16 lg:pb-56 grid lg:grid-cols-2 gap-8 items-center">
          {/* copy */}
          <div className="order-2 lg:order-1 fade-in">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur px-3.5 py-1.5 text-[13px] font-bold text-teal-deep ring-1 ring-white/80 shadow-card">
              <PlayIcon className="w-3.5 h-3.5" /> ฝึกฟังภาษาไทย
            </span>
            <h1 className="mt-4 font-display text-[33px] leading-[1.14] lg:text-[52px] lg:leading-[1.08] font-extrabold tracking-tight text-navy drop-shadow-[0_2px_0_rgba(255,255,255,0.6)]">
              ฝึกฟังกับลูก<br className="hidden lg:block" /> วันละ <span className="text-orange">5</span> นาที
            </h1>
            <p className="mt-3 lg:mt-4 text-[16px] lg:text-[19px] leading-relaxed text-ink/80 font-medium max-w-[26rem]">
              ฟังเรื่องราวสนุก ๆ แล้วตอบคำถาม ฝึกได้ทุกวัน
            </p>
            <button
              onClick={startPractice}
              className="tap mt-6 lg:mt-8 inline-flex items-center gap-2.5 rounded-full bg-orange text-white pl-2 pr-7 py-2 lg:py-2.5 text-[18px] lg:text-[20px] font-extrabold shadow-float hover:brightness-105"
            >
              <span className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white/25 flex items-center justify-center">
                <PlayIcon className="w-5 h-5 lg:w-6 lg:h-6 ml-0.5" />
              </span>
              เริ่มฝึกเลย
            </button>

            {progress.totalStars > 0 && (
              <div className="mt-6 flex items-center gap-2">
                <span className="rounded-full bg-white/80 px-3.5 py-1.5 text-[13px] font-extrabold text-orange ring-1 ring-orange/20 shadow-card">
                  ⭐ {progress.totalStars} ดาว
                </span>
                {progress.streakDays > 0 && (
                  <span className="rounded-full bg-white/80 px-3.5 py-1.5 text-[13px] font-extrabold text-grass-deep ring-1 ring-grass/25 shadow-card">
                    🔥 สตรีค {progress.streakDays} วัน
                  </span>
                )}
              </div>
            )}
          </div>

          {/* mascot + speech bubble */}
          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
            <div className="absolute -top-2 left-1/2 lg:left-auto lg:right-4 -translate-x-1/2 lg:translate-x-0 z-20 bubble-pop">
              <div className="relative rounded-2xl bg-white px-4 py-2.5 shadow-float ring-1 ring-navy/5">
                <p className="font-display text-[15px] lg:text-[17px] font-extrabold text-navy whitespace-nowrap">
                  มาฟังกันเถอะ!
                </p>
                <span className="absolute -bottom-1.5 left-8 h-4 w-4 rotate-45 bg-white ring-1 ring-navy/5" />
              </div>
            </div>
            <img
              src="/mascot.png"
              alt=""
              className="relative z-10 w-full max-w-[290px] lg:max-w-[430px] object-contain float-slow drop-shadow-[0_22px_44px_rgba(27,58,107,0.18)]"
            />
          </div>
        </div>

        {/* landscape base */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <Tree className="absolute bottom-16 left-[5%] w-12 lg:w-16 sway" />
          <Tree className="absolute bottom-20 left-[15%] w-9 lg:w-12 sway" />
          <Boat className="absolute bottom-1 right-[12%] w-14 lg:w-20 bob" />
          <HillsWater className="w-full h-[180px] lg:h-[230px]" />
        </div>
      </section>

      {/* ── Mode cards on soft canvas ───────────────────── */}
      <div className="bg-[#F2FAF4]">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-10 pt-4 pb-12 lg:pb-16">
          <div className="flex items-center gap-2.5 mb-5 lg:mb-7">
            <span className="h-9 w-9 rounded-xl bg-teal/15 flex items-center justify-center text-teal text-xl">🎧</span>
            <h2 className="font-display text-[22px] lg:text-[26px] font-extrabold text-navy">เลือกการ์ดเพื่อเล่น</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 lg:gap-5">
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.key}
                  onClick={m.onClick}
                  className={`card-pop group relative overflow-hidden text-left rounded-[28px] ${m.surface} p-5 lg:p-6 shadow-float`}
                >
                  {/* soft glow blob */}
                  <span className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/20" />
                  <span className="relative shrink-0 h-16 w-16 lg:h-18 lg:w-18 rounded-2xl bg-white/90 flex items-center justify-center shadow-card">
                    <Icon className={`w-8 h-8 lg:w-9 lg:h-9 ${m.chip}`} />
                  </span>
                  <p className="relative mt-4 font-display text-[22px] lg:text-[24px] font-extrabold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]">
                    {m.title}
                  </p>
                  <p className="relative mt-1 text-[14px] lg:text-[15px] font-medium text-white/90 leading-snug">
                    {m.desc}
                  </p>
                  <span className={`relative mt-4 inline-flex items-center gap-1.5 rounded-full ${m.pill} px-4 py-2 text-[14px] font-extrabold shadow-card group-hover:gap-2.5 transition-all`}>
                    {m.cta}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Recently played */}
          <div className="flex items-center justify-between mt-10 lg:mt-14 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="h-9 w-9 rounded-xl bg-ring2/12 flex items-center justify-center text-ring2">
                <ClockIcon className="w-5 h-5" />
              </span>
              <h2 className="font-display text-[22px] lg:text-[26px] font-extrabold text-navy">เล่นล่าสุด</h2>
            </div>
            <button
              onClick={() => navigate('/browse')}
              className="inline-flex items-center gap-1 text-[14px] font-bold text-ring2 hover:text-navy transition-colors"
            >
              ดูทั้งหมด
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {recent.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {recent.slice(0, 4).map(({ entry, story }, i) => (
                <button
                  key={entry.id}
                  onClick={() => navigate(`/play/${story.id}`)}
                  className="card-pop text-left rounded-3xl bg-white ring-1 ring-navy/8 shadow-card p-4 flex items-center gap-3.5 hover:ring-teal/30"
                >
                  <span className={`shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center ${i % 2 === 0 ? 'bg-teal/14 text-teal' : 'bg-grass/16 text-grass-deep'}`}>
                    {i % 2 === 0 ? <StoreIcon className="w-6 h-6" /> : <LeafIcon className="w-6 h-6" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[16px] font-bold text-navy truncate">{story.title}</p>
                    <p className="text-[12.5px] text-mute">ระดับ {story.level}</p>
                  </div>
                  <span className="text-[12.5px] text-mute whitespace-nowrap">{formatThaiRelative(entry.ts)}</span>
                  <ChevronRight className="w-4 h-4 text-mute/60" />
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white ring-1 ring-navy/8 shadow-card px-5 py-7 text-center">
              <p className="text-[14px] text-mute">ยังไม่มีประวัติการเล่น กดเริ่มฝึกเลยเพื่อเริ่มเรื่องแรก</p>
            </div>
          )}
        </div>

        {/* footer wave into white */}
        <WaveDivider className="w-full h-12 lg:h-16" color="#FFFFFF" />
      </div>
    </AppShell>
  );
}
