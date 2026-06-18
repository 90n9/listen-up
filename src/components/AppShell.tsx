import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon } from './icons';
import { Cloud, HillsWater } from './Scene';

interface Props {
  children: ReactNode;
  /** 'wide' for the home/browse launcher, 'narrow' for focused play/results flows. */
  size?: 'wide' | 'narrow';
  /** Render the logo header bar. */
  header?: boolean;
}

function Header() {
  return (
    <header className="bg-white/85 backdrop-blur-xl sticky top-0 z-40 shadow-[0_4px_20px_-12px_rgba(27,58,107,0.18)]">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-10 flex items-center justify-between py-3 lg:py-4">
        <Link to="/" className="tap inline-flex items-center gap-2.5" aria-label="ListenUp หน้าแรก">
          <span className="h-11 w-11 lg:h-13 lg:w-13 rounded-2xl bg-teal/12 ring-1 ring-teal/15 flex items-center justify-center overflow-hidden">
            <img src="/mascot.png" alt="" className="h-10 lg:h-12 w-auto object-contain" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              <span className="text-navy">Listen</span><span className="text-orange">Up</span>
            </span>
            <span className="mt-0.5 text-[11px] lg:text-xs font-bold text-teal">
              ฟังเป็น ตอบได้
            </span>
          </span>
        </Link>
        <Link
          to="/browse"
          className="tap hidden lg:inline-flex items-center rounded-full bg-grass text-white px-5 py-2.5 text-[15px] font-extrabold shadow-card hover:brightness-105"
        >
          คลังเรื่อง
        </Link>
        <Link
          to="/browse"
          className="lg:hidden h-11 w-11 rounded-2xl bg-grass/12 flex items-center justify-center text-grass-deep hover:bg-grass/20 transition-colors"
          aria-label="คลังเรื่อง"
        >
          <MenuIcon className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}

export default function AppShell({ children, size = 'wide', header = true }: Props) {
  if (size === 'narrow') {
    return (
      <div className="sky relative min-h-[100dvh] flex flex-col overflow-hidden">
        {header && <Header />}
        {/* ambient sky */}
        <Cloud className="absolute top-8 left-[8%] w-20 lg:w-28 opacity-90 float-mid pointer-events-none" />
        <Cloud className="absolute top-20 right-[10%] w-16 lg:w-24 opacity-80 float-slow pointer-events-none" />
        <main className="relative z-10 flex-1 w-full max-w-[620px] mx-auto px-4 py-6 lg:py-10 flex flex-col justify-center">
          {children}
        </main>
        {/* hills footer */}
        <HillsWater className="relative z-0 w-full h-[120px] lg:h-[150px] pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      {header && <Header />}
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-navy/8 bg-white">
      <div className="mx-auto max-w-[1240px] px-5 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-sm text-navy/50">© 2026 ListenUp · ฟังเป็น ตอบได้</span>
        <nav className="flex items-center gap-5 text-sm font-bold text-navy/60">
          <Link to="/privacy" className="hover:text-teal">นโยบายความเป็นส่วนตัว</Link>
          <Link to="/terms" className="hover:text-teal">ข้อกำหนดการใช้งาน</Link>
        </nav>
      </div>
    </footer>
  );
}
