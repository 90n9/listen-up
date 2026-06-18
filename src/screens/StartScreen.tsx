import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { ChevronLeft, ArrowRight, LeafIcon, BookIcon, QuestionIcon } from '../components/icons';
import { storiesByLevel } from '../data/library';
import { pickRandomExcept } from '../lib/shuffle';
import { LEVEL_LABELS, type Level } from '../data/types';

interface LevelCard {
  level: Level;
  desc: string;
  icon: typeof BookIcon;
  surface: string;
  chip: string;
}

const LEVEL_CARDS: LevelCard[] = [
  {
    level: 1,
    desc: 'ประโยคสั้น ฟังง่าย เหมาะกับการเริ่มต้น',
    icon: LeafIcon,
    surface: 'bg-grass',
    chip: 'text-grass-deep',
  },
  {
    level: 2,
    desc: 'เรื่องยาวขึ้นนิด มีรายละเอียดมากขึ้น',
    icon: BookIcon,
    surface: 'bg-teal',
    chip: 'text-teal',
  },
  {
    level: 3,
    desc: 'เรื่องยาว คำถามชวนคิด ท้าทายขึ้น',
    icon: QuestionIcon,
    surface: 'bg-orange',
    chip: 'text-orange',
  },
];

export default function StartScreen() {
  const navigate = useNavigate();

  const startLevel = (level: Level) => {
    const story = pickRandomExcept(storiesByLevel(level));
    navigate(`/play/${story.id}`);
  };

  return (
    <AppShell size="narrow">
      <div className="px-2 lg:px-4 pt-2 pb-6">
        {/* back */}
        <button
          onClick={() => navigate('/')}
          className="tap inline-flex items-center gap-1.5 text-[14px] font-bold text-teal hover:text-teal-deep mb-5"
        >
          <ChevronLeft className="w-4 h-4" />
          กลับหน้าแรก
        </button>

        {/* heading */}
        <div className="text-center fade-in">
          <h1 className="font-display text-[28px] lg:text-[34px] font-extrabold tracking-tight text-navy">
            วันนี้อยากฝึกระดับไหน?
          </h1>
          <p className="mt-2 text-[15px] text-ink/75 font-medium max-w-[24rem] mx-auto">
            เลือกระดับให้เหมาะกับลูก แล้วเราจะสุ่มเรื่องในระดับนั้นมาให้
          </p>
        </div>

        {/* level cards */}
        <div className="mt-7 space-y-4">
          {LEVEL_CARDS.map((c) => {
            const Icon = c.icon;
            const count = storiesByLevel(c.level).length;
            return (
              <button
                key={c.level}
                onClick={() => startLevel(c.level)}
                className={`card-pop group relative overflow-hidden w-full text-left rounded-[26px] ${c.surface} p-5 shadow-float flex items-center gap-4`}
              >
                <span className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/20" />
                <span className="relative shrink-0 h-16 w-16 rounded-2xl bg-white/90 flex items-center justify-center shadow-card">
                  <Icon className={`w-8 h-8 ${c.chip}`} />
                </span>
                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[22px] font-extrabold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]">
                      ระดับ {c.level}
                    </span>
                    <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[12px] font-extrabold text-navy">
                      {LEVEL_LABELS[c.level]}
                    </span>
                  </div>
                  <p className="mt-1 text-[14px] font-medium text-white/90 leading-snug">{c.desc}</p>
                  <p className="mt-1 text-[12px] font-semibold text-white/75">{count} เรื่อง</p>
                </div>
                <ArrowRight className="relative w-6 h-6 text-white/90 group-hover:translate-x-0.5 transition-transform" />
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
