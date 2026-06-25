import { useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { ChevronLeft, ChevronRight, EyeIcon, CheckIcon, CloseIcon, RotateIcon } from '../components/icons';
import { getStoryById } from '../data/library';

export default function PlayScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const story = id ? getStoryById(id) : undefined;

  const [phase, setPhase] = useState<'sentence' | 'questions'>('sentence');
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  if (!story) return <Navigate to="/" replace />;

  const total = story.questions.length;
  const question = story.questions[index];

  const grade = (isCorrect: boolean) => {
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    const nextCombo = isCorrect ? combo + 1 : 0;
    const nextMax = Math.max(maxCombo, nextCombo);
    if (index + 1 >= total) {
      navigate('/results', {
        replace: true,
        state: { setId: story.id, correct: nextCorrect, total, maxCombo: nextMax },
      });
      return;
    }
    setCorrect(nextCorrect);
    setCombo(nextCombo);
    setMaxCombo(nextMax);
    setIndex(index + 1);
    setRevealed(false);
  };

  return (
    <AppShell size="narrow" header={false}>
      <div className="relative px-6 lg:px-8 pt-6 pb-8">
        {/* top bar */}
        <div className="flex items-center justify-between fade-in">
          <button
            onClick={() => navigate('/')}
            className="tap h-10 w-10 rounded-full bg-canvas ring-1 ring-navy/8 flex items-center justify-center text-navy hover:bg-white"
            aria-label="กลับหน้าแรก"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-orange text-white px-3 py-1.5 text-[12px] font-extrabold shadow-card">ระดับ {story.level}</span>
            <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-navy ring-1 ring-navy/8 shadow-card">{story.title}</span>
          </div>
        </div>

        {/* sentence card (parent reads aloud) */}
        <div className="mt-6 fade-in">
          <div className="inline-flex items-center gap-1.5 mb-2.5 rounded-full bg-teal text-white px-3 py-1 text-[11.5px] font-extrabold shadow-card">
            🔊 อ่านให้ลูกฟัง
          </div>
          <div className="relative rounded-[26px] bg-white ring-1 ring-teal/20 p-6 shadow-float">
            <span className="absolute inset-x-0 top-0 h-1.5 rounded-t-[26px] bg-teal" />
            <p className="font-display text-[22px] lg:text-[24px] leading-[1.55] font-bold text-navy">{story.sentence}</p>
          </div>
        </div>

        {phase === 'sentence' ? (
          <div className="mt-5 fade-in">
            <button
              onClick={() => setPhase('questions')}
              className="tap w-full min-h-[58px] rounded-full bg-teal text-white text-[18px] font-extrabold tracking-tight shadow-float hover:bg-teal-deep flex items-center justify-center gap-2"
            >
              พร้อมแล้ว เริ่มถาม
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-center text-[13px] text-mute">อ่านประโยคให้ลูกฟัง 1-2 ครั้ง แล้วกดเริ่มถาม</p>
          </div>
        ) : (
          <div className="mt-5">
            <button
              onClick={() => {
                setPhase('sentence');
                setRevealed(false);
              }}
              className="tap inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal hover:text-teal-deep mb-5"
            >
              <RotateIcon className="w-4 h-4" />
              อ่านอีกครั้ง
            </button>

            {/* combo meter */}
            {combo >= 2 && (
              <div className="mb-3 flex items-center justify-center pop">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange text-white px-4 py-1.5 text-[14px] font-extrabold shadow-float">
                  🔥 คอมโบ x{combo}
                </span>
              </div>
            )}

            {/* question */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold text-navy/60">
                ข้อ {index + 1}/{total}
              </span>
              <div className="flex items-center gap-1.5">
                {story.questions.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-7 rounded-full ${i < index ? 'bg-teal' : i === index ? 'bg-teal/60' : 'bg-navy/12'}`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[26px] bg-white ring-1 ring-navy/8 p-6 shadow-float">
              <p className="font-display text-[21px] leading-snug font-bold text-navy">{question.q}</p>

              {!revealed ? (
                <button
                  onClick={() => setRevealed(true)}
                  className="tap mt-5 w-full min-h-[52px] rounded-full bg-ring2 text-white text-[16px] font-extrabold tracking-tight shadow-float hover:bg-[#2a72bd] flex items-center justify-center gap-2"
                >
                  <EyeIcon className="w-5 h-5" />
                  เฉลย
                </button>
              ) : (
                <div className="reveal shown mt-4">
                  <div>
                    <div className="rounded-2xl bg-grass/8 ring-1 ring-grass/25 px-5 py-4">
                      <p className="text-[11px] font-semibold tracking-widest uppercase text-grass-deep/80">คำตอบที่ถูกต้อง</p>
                      <p className="font-display mt-1 text-[20px] font-bold text-navy">{question.answer}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* grading */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => grade(true)}
                disabled={!revealed}
                className="tap min-h-[58px] rounded-full bg-grass text-white text-[18px] font-extrabold tracking-tight shadow-float hover:bg-[#54ab37] flex items-center justify-center gap-2 disabled:opacity-40 disabled:shadow-none"
              >
                <CheckIcon className="w-5 h-5" />
                ถูก
              </button>
              <button
                onClick={() => grade(false)}
                disabled={!revealed}
                className="tap min-h-[58px] rounded-full bg-white text-navy text-[18px] font-extrabold tracking-tight ring-1 ring-navy/15 hover:bg-canvas flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <CloseIcon className="w-5 h-5 text-mute" />
                ผิด
              </button>
            </div>
            {!revealed && (
              <p className="mt-3 text-center text-[12.5px] text-mute">ให้ลูกตอบก่อน แล้วกดเฉลยเพื่อให้คะแนน</p>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
