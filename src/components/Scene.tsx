/**
 * Decorative landscape pieces for the immersive kids-illustration direction.
 * Pure SVG, no deps. Everything is aria-hidden — purely ornamental.
 */
type P = { className?: string };

/** Soft puffy cloud */
export const Cloud = ({ className }: P) => (
  <svg className={className} viewBox="0 0 120 60" fill="#FFFFFF" aria-hidden>
    <path d="M30 50a18 18 0 0 1 .8-35.9A24 24 0 0 1 78 16a16 16 0 0 1 14 34z" />
  </svg>
);

/** Smiling sun */
export const Sun = ({ className }: P) => (
  <svg className={className} viewBox="0 0 100 100" aria-hidden>
    <circle cx="50" cy="50" r="26" fill="#FFCB45" />
    <circle cx="50" cy="50" r="20" fill="#FFD86B" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI) / 6;
      const x1 = 50 + Math.cos(a) * 30;
      const y1 = 50 + Math.sin(a) * 30;
      const x2 = 50 + Math.cos(a) * 40;
      const y2 = 50 + Math.sin(a) * 40;
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFCB45" strokeWidth="5" strokeLinecap="round" />
      );
    })}
  </svg>
);

/** Chunky round tree */
export const Tree = ({ className }: P) => (
  <svg className={className} viewBox="0 0 60 80" aria-hidden>
    <rect x="26" y="48" width="8" height="26" rx="4" fill="#9A6234" />
    <circle cx="30" cy="32" r="22" fill="#5FBF3F" />
    <circle cx="18" cy="40" r="13" fill="#4A9E2F" />
    <circle cx="42" cy="40" r="13" fill="#6FCB4F" />
  </svg>
);

/** Little sailboat */
export const Boat = ({ className }: P) => (
  <svg className={className} viewBox="0 0 80 70" aria-hidden>
    <path d="M14 46h52l-8 16H22z" fill="#F58220" />
    <path d="M40 8l22 32H40z" fill="#FFFFFF" />
    <path d="M38 6L16 40h22z" fill="#2E7DD1" />
    <rect x="38" y="6" width="4" height="40" rx="2" fill="#9A6234" />
  </svg>
);

/**
 * Rolling green hills + blue water with white foam edge.
 * Sits at the bottom of the hero, full bleed.
 */
export const HillsWater = ({ className }: P) => (
  <svg
    className={className}
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
    aria-hidden
  >
    {/* back hill */}
    <path
      d="M0 120 C 260 60 460 150 720 120 C 980 90 1180 150 1440 110 L1440 320 L0 320 Z"
      fill="#6FCB4F"
    />
    {/* front hill */}
    <path
      d="M0 190 C 300 130 520 210 760 185 C 1040 156 1240 215 1440 180 L1440 320 L0 320 Z"
      fill="#5FBF3F"
    />
    {/* water foam edge */}
    <path
      d="M0 250 C 220 225 360 275 620 255 C 900 233 1080 280 1440 250 L1440 270 C 1080 300 900 253 620 275 C 360 295 220 245 0 270 Z"
      fill="#FFFFFF"
      opacity="0.9"
    />
    {/* water */}
    <path
      d="M0 262 C 220 237 360 287 620 267 C 900 245 1080 292 1440 262 L1440 320 L0 320 Z"
      fill="#39B6E6"
    />
  </svg>
);

/** Wavy section divider — flips to face up or down */
export const WaveDivider = ({ className, color = '#F2FAF4', flip = false }: P & { color?: string; flip?: boolean }) => (
  <svg
    className={className}
    viewBox="0 0 1440 80"
    preserveAspectRatio="none"
    aria-hidden
    style={flip ? { transform: 'scaleY(-1)' } : undefined}
  >
    <path
      d="M0 40 C 240 0 480 80 720 50 C 960 20 1200 70 1440 35 L1440 80 L0 80 Z"
      fill={color}
    />
  </svg>
);
