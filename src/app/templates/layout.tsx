import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free ATS-Friendly Resume Templates (2026) — Download or Edit Instantly | CVOptimizerAI',
  description: 'Choose from Modern, Executive, Creative, and Professional resume templates — all ATS-tested and recruiter-approved. Edit with AI in one click. Export as PDF. Free.',
  openGraph: {
    title: 'Free ATS-Friendly Resume Templates (2026) — Download or Edit Instantly | CVOptimizerAI',
    description: 'Choose from Modern, Executive, Creative, and Professional resume templates — all ATS-tested and recruiter-approved. Edit with AI in one click. Export as PDF. Free.',
    type: 'website',
    url: 'https://cvoptimizerai.com/templates',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS-Friendly Resume Templates (2026) — Download or Edit Instantly | CVOptimizerAI',
    description: 'Choose from Modern, Executive, Creative, and Professional resume templates — all ATS-tested and recruiter-approved. Edit with AI in one click. Export as PDF. Free.',
  },
  alternates: { canonical: 'https://cvoptimizerai.com/templates' },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
