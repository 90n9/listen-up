/**
 * Small, consistent inline icon set (1.8 stroke for line icons, filled play).
 * Matching the approved design guideline; kept local so the app has no icon dep.
 */
type P = { className?: string };

const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};
const thick = { ...line, strokeWidth: 2.4 };

export const PlayIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const BookIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} aria-hidden>
    <path d="M2 5h7a3 3 0 0 1 3 3v11a2.5 2.5 0 0 0-2.5-2.5H2z" />
    <path d="M22 5h-7a3 3 0 0 0-3 3v11a2.5 2.5 0 0 1 2.5-2.5H22z" />
  </svg>
);

export const QuestionIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} aria-hidden>
    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3 2.5c-.6.2-1 .8-1 1.5" />
    <path d="M12 17h.01" />
  </svg>
);

export const ShuffleIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} aria-hidden>
    <path d="M16 3h5v5" />
    <path d="M4 20L21 3" />
    <path d="M21 16v5h-5" />
    <path d="M15 15l6 6" />
    <path d="M4 4l5 5" />
  </svg>
);

export const ClockIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const CardsIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} aria-hidden>
    <rect x="3" y="3" width="14" height="14" rx="2" />
    <path d="M21 7v12a2 2 0 0 1-2 2H7" />
  </svg>
);

export const StoreIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} aria-hidden>
    <path d="M3 9l1-4h16l1 4" />
    <path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
    <path d="M3 9h18" />
  </svg>
);

export const LeafIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} aria-hidden>
    <path d="M3 14c4 5 11 6 16 1" />
    <path d="M19 15c2-3 2-8-1-11" />
  </svg>
);

export const ChevronRight = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...thick} aria-hidden>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const ChevronLeft = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...thick} aria-hidden>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const ArrowRight = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...thick} aria-hidden>
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

export const EyeIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} strokeWidth={2} aria-hidden>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const CheckIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} strokeWidth={2.6} aria-hidden>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const CloseIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} strokeWidth={2.6} aria-hidden>
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

export const RotateIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} strokeWidth={2.2} aria-hidden>
    <path d="M1 4v6h6" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

export const MenuIcon = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" {...line} strokeWidth={2.2} aria-hidden>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
