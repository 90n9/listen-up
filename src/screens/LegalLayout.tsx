import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';

interface Props {
  title: string;
  updated: string;
  children: ReactNode;
}

// Shared reading layout for the Privacy Policy and Terms of Use pages.
export default function LegalLayout({ title, updated, children }: Props) {
  return (
    <AppShell size="wide">
      <main className="mx-auto max-w-[760px] px-5 lg:px-8 py-8 lg:py-12">
        <Link
          to="/"
          className="tap inline-flex items-center gap-1.5 text-sm font-bold text-teal hover:underline"
        >
          ← กลับหน้าแรก
        </Link>
        <h1 className="mt-4 text-3xl lg:text-4xl font-extrabold text-navy">{title}</h1>
        <p className="mt-1.5 text-sm text-navy/50">อัปเดตล่าสุด: {updated}</p>
        <div className="legal-doc mt-7 space-y-6 text-[15px] leading-relaxed text-navy/80">
          {children}
        </div>
      </main>
    </AppShell>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="space-y-2.5">
      <h2 className="text-lg lg:text-xl font-extrabold text-navy">{heading}</h2>
      {children}
    </section>
  );
}
