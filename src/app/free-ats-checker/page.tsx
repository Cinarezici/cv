import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Upload, BarChart3, Sparkles, Zap, Shield, FileText, Type, Hash, AlignLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free ATS Resume Checker — Score & Fix Your CV in Seconds',
  description:
    'Free ATS resume checker. Score your CV out of 100, find missing keywords, and get an AI-optimized version instantly.',
  openGraph: {
    title: 'Free ATS Resume Checker — Score & Fix Your CV in Seconds',
    description:
      'Free ATS resume checker. Score your CV out of 100, find missing keywords, and get an AI-optimized version instantly.',
    type: 'website',
    url: 'https://cvoptimizerai.com/free-ats-checker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Checker — Score & Fix Your CV in Seconds',
    description:
      'Free ATS resume checker. Score your CV out of 100, find missing keywords, and get an AI-optimized version instantly.',
  },
  alternates: {
    canonical: 'https://cvoptimizerai.com/free-ats-checker',
  },
};

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload or Paste Your CV',
    desc: 'Drop your PDF or paste your CV text directly. No account needed to get your score.',
  },
  {
    icon: BarChart3,
    step: '02',
    title: 'Get Your ATS Score',
    desc: 'Instantly see a score out of 100 with a ranked list of every issue holding you back.',
  },
  {
    icon: Sparkles,
    step: '03',
    title: 'Fix It with AI in One Click',
    desc: 'Our AI rewrites your CV to be ATS-optimized and keyword-rich for the specific role you want.',
  },
];

const checks = [
  { icon: FileText, label: 'ATS Formatting', desc: 'Flags tables, columns, headers, and graphics that block parsers.' },
  { icon: Hash, label: 'Keyword Density', desc: 'Matches your CV against the job description and surfaces missing terms.' },
  { icon: AlignLeft, label: 'Bullet Structure', desc: 'Detects weak bullets missing measurable results or action verbs.' },
  { icon: Type, label: 'Readability', desc: 'Checks line length, section labels, and font/spacing indicators.' },
  { icon: Shield, label: 'Contact & Meta', desc: 'Verifies email, LinkedIn URL, phone, and location are present and parseable.' },
  { icon: Zap, label: 'AI Optimisation Score', desc: 'Comprehensive pass score on how likely an ATS system is to shortlist you.' },
];

const faqs = [
  {
    q: 'Is this ATS checker really free?',
    a: 'Yes. You can upload your CV and get a full ATS score for free, no credit card required. The AI rewrite feature is available on the Pro plan.',
  },
  {
    q: 'What is an ATS score?',
    a: 'An ATS (Applicant Tracking System) score tells you how well your resume will survive automated screening software used by 98% of Fortune 500 companies. A score above 80 significantly increases your chances of reaching a human recruiter.',
  },
  {
    q: 'How is the score calculated?',
    a: 'We analyse formatting, keyword coverage, bullet structure, section completeness, and readability. Each factor is weighted by its real-world impact on ATS filtering.',
  },
  {
    q: 'Do I need to create an account?',
    a: "You can see your ATS score immediately after signing up for a free 14-day trial. No credit card required — just your email.",
  },
  {
    q: 'Can I upload a PDF?',
    a: 'Yes. We parse PDFs, Word documents, and plain text. Our parser handles single and multi-column layouts.',
  },
];

export default function FreeATSCheckerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 overflow-x-hidden">

      {/* ── Navbar ───────────────────────────────────── */}
      <div className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-5xl z-50 flex justify-center pointer-events-none">
        <header className="flex items-center justify-between w-full h-16 px-4 md:px-6 border border-zinc-200/80 bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] pointer-events-auto">
          <Link className="flex items-center gap-2 group" href="/">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 group-hover:scale-110 transition-transform shadow-md shadow-blue-600/20 flex-shrink-0">
              <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-zinc-900">CV Optimizer AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block text-[14px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors">Login</Link>
            <Link href="/signup" className="h-10 px-5 rounded-full bg-zinc-900 text-white text-[14px] font-bold flex items-center hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-sm">
              Try Free
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────── */}
        <section className="relative w-full min-h-[640px] flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden bg-[#fafafa]">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_80%,transparent_100%)] opacity-25 pointer-events-none" />

          <div className="container px-6 mx-auto max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[12px] font-bold mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Free — No credit card required
            </div>

            <h1 className="font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-6 text-5xl md:text-[68px]">
              Free ATS Resume Checker<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">Score Your CV Instantly</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium max-w-2xl mx-auto mb-10">
              Paste your CV and get an ATS score out of 100 in seconds. See exactly which keywords are missing, what&apos;s wrong with your formatting, and how to fix it — with one click.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <button className="h-14 px-10 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white font-bold text-[15px] shadow-[0_0_24px_rgba(59,130,246,0.35)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                  Check My ATS Score Free <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="h-14 px-8 rounded-full bg-white border border-zinc-200 text-zinc-700 font-bold text-[15px] hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm">
                  See how it works
                </button>
              </Link>
            </div>

            {/* Proof bar */}
            <p className="mt-8 text-[13px] text-zinc-400 font-medium">
              Joined by <strong className="text-zinc-600">20,313+</strong> professionals · 14-day free trial · No card required
            </p>
          </div>
        </section>

        {/* ── Score Example ─────────────────────────────── */}
        <section className="w-full py-20 bg-white border-y border-zinc-100">
          <div className="container px-6 mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-3">Real results</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">
                From rejected to shortlisted.
              </h2>
              <p className="text-zinc-500 font-medium mt-3 max-w-lg mx-auto">This is what a typical scan looks like — and what happens after the AI rewrite.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto items-stretch">
              {/* Before */}
              <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Before</span>
                  <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">Needs Work</span>
                </div>
                {/* Gauge */}
                <div className="flex flex-col items-center py-2">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#fee2e2" strokeWidth="10" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 40 * 0.63} ${2 * Math.PI * 40 * 0.37}`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-3xl font-black text-zinc-900 leading-none">63</p>
                      <p className="text-[10px] text-zinc-400 font-bold">/100</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { sev: 'HIGH', color: 'text-red-500 bg-red-50 border-red-200', text: 'Missing keywords for target role' },
                    { sev: 'MED', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', text: 'No measurable results in bullets' },
                    { sev: 'LOW', color: 'text-blue-600 bg-blue-50 border-blue-200', text: 'Section header not ATS-readable' },
                  ].map(item => (
                    <div key={item.sev} className={`flex items-start gap-2.5 rounded-xl px-3 py-2 border ${item.color}`}>
                      <span className={`text-[9px] font-black mt-0.5 shrink-0 ${item.color.split(' ')[0]}`}>{item.sev}</span>
                      <p className="text-[12px] font-medium text-zinc-600 leading-snug">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center shrink-0">
                <ArrowRight className="w-6 h-6 text-zinc-400" />
              </div>

              {/* After */}
              <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_32px_-8px_rgba(16,185,129,0.2)]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">After AI Fix</span>
                  <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Excellent</span>
                </div>
                <div className="flex flex-col items-center py-2">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#d1fae5" strokeWidth="10" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 40 * 0.91} ${2 * Math.PI * 40 * 0.09}`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-3xl font-black text-zinc-900 leading-none">91</p>
                      <p className="text-[10px] text-zinc-400 font-bold">/100</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    'All high-impact keywords added',
                    'CAR method applied to all bullets',
                    'Section headers ATS-optimised',
                  ].map(line => (
                    <div key={line} className="flex items-center gap-2.5 bg-white/70 border border-emerald-200 rounded-xl px-3 py-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={2.5} />
                      <p className="text-[12px] font-semibold text-zinc-700 leading-snug">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link href="/signup">
                <button className="h-13 px-8 py-3.5 rounded-full bg-zinc-900 text-white font-bold text-[14px] hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-2 mx-auto">
                  Get My ATS Score <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────── */}
        <section id="how-it-works" className="w-full py-20 bg-[#fafafa]">
          <div className="container px-6 mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-3">Simple process</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">How it works</h2>
              <p className="text-zinc-500 font-medium mt-3">Three steps. Under two minutes. Real results.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 relative">
              <div className="hidden md:block absolute top-10 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="relative bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{step.step}</span>
                    </div>
                    <h3 className="text-[17px] font-extrabold text-zinc-900 mb-2">{step.title}</h3>
                    <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── What we check ────────────────────────────── */}
        <section className="w-full py-20 bg-white border-y border-zinc-100">
          <div className="container px-6 mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-3">Full audit</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">What we analyse</h2>
              <p className="text-zinc-500 font-medium mt-3 max-w-lg mx-auto">Every dimension that determines whether your CV gets filtered out or shortlisted.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {checks.map(check => {
                const Icon = check.icon;
                return (
                  <div key={check.label} className="bg-[#fafafa] rounded-2xl border border-zinc-200 p-5 flex gap-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-extrabold text-zinc-900 mb-1">{check.label}</p>
                      <p className="text-[13px] text-zinc-500 font-medium leading-snug">{check.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Mid-page CTA ─────────────────────────────── */}
        <section className="w-full py-20 bg-gradient-to-br from-[#0f1728] to-[#1a2744]">
          <div className="container px-6 mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-5">
              Most CVs fail before<br />a human sees them.
            </h2>
            <p className="text-lg text-zinc-400 font-medium mb-10 max-w-xl mx-auto">
              98% of Fortune 500 companies use ATS software. The average candidate has a 75% chance of being automatically rejected. Find out where you stand — free.
            </p>
            <Link href="/signup">
              <button className="h-14 px-10 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white font-bold text-[15px] shadow-[0_0_24px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 mx-auto">
                Check My CV Now — Free <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <p className="text-[13px] text-zinc-500 font-medium mt-5">No credit card required · See your score in under 60 seconds</p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────── */}
        <section className="w-full py-20 bg-[#fafafa]">
          <div className="container px-6 mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-3">Got questions?</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">Frequently asked</h2>
            </div>
            <div className="space-y-4">
              {faqs.map(faq => (
                <div key={faq.q} className="bg-white rounded-2xl border border-zinc-200 p-6">
                  <p className="text-[15px] font-extrabold text-zinc-900 mb-2">{faq.q}</p>
                  <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────── */}
        <section className="w-full py-24 bg-white border-t border-zinc-100">
          <div className="container px-6 mx-auto max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-zinc-900 mb-5">
              Stop guessing.{' '}
              <span className="text-[#2563eb]">Start scoring.</span>
            </h2>
            <p className="text-lg text-zinc-500 font-medium mb-10 max-w-xl mx-auto">
              Get your free ATS score, find every issue ranked by impact, and fix your CV with AI — all in under two minutes.
            </p>
            <Link href="/signup">
              <button className="h-14 px-10 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white font-bold text-[15px] shadow-[0_0_24px_rgba(59,130,246,0.35)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 mx-auto">
                Get My Free ATS Score <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <p className="text-[13px] text-zinc-400 font-medium mt-5">14-day free trial · No credit card required · Cancel anytime</p>
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-zinc-100 bg-[#fafafa]">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
          <Link className="flex items-center gap-2" href="/">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600">
              <Zap className="h-3.5 w-3.5 text-white fill-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-zinc-900">CV Optimizer AI</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-bold text-zinc-600">
            <Link className="hover:text-zinc-900 transition-colors" href="/">Home</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/blog">Blog</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/upgrade">Pricing</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/login">Login</Link>
          </nav>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">© {new Date().getFullYear()} CV Optimizer AI</p>
        </div>
      </footer>

    </div>
  );
}
