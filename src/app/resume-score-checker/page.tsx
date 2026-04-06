import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, CheckCircle2, Upload, BarChart3, Sparkles,
  Zap, Shield, FileText, Type, Hash, AlignLeft,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Resume Score Checker 2026: Get Your ATS Score | CVOptimizerAI',
  description: "Find out exactly why you aren't getting interviews. Free score across 40+ metrics: formatting, keywords, bullet strength, and more. Get your results in under 60 seconds.",
  alternates: { canonical: 'https://cvoptimizerai.com/resume-score-checker' },
  openGraph: {
    title: 'Free Resume Score Checker 2026: Get Your ATS Score | CVOptimizerAI',
    description: "Find out exactly why you aren't getting interviews. Free score across 40+ metrics: formatting, keywords, bullet strength, and more.",
    type: 'website',
    url: 'https://cvoptimizerai.com/resume-score-checker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Score Checker 2026: Get Your ATS Score',
    description: "Score your resume out of 100 on 40+ metrics instantly.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://cvoptimizerai.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Resume Score Checker",
      "item": "https://cvoptimizerai.com/resume-score-checker"
    }
  ]
};

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Your Resume',
    desc: 'Drop your PDF or paste your text. Our checker instantly maps your experience against standard industry criteria.',
  },
  {
    icon: BarChart3,
    step: '02',
    title: 'Get Your Resume Score',
    desc: 'Receive a score out of 100 pointing out exact weaknesses in impact, formatting, and keyword density.',
  },
  {
    icon: Sparkles,
    step: '03',
    title: 'Fix It and Boost Score',
    desc: 'Use our AI text optimization to automatically correct errors and skyrocket your score to 90+.',
  },
];

const checks = [
  { icon: FileText, label: 'Visual Formatting', desc: 'Ensures your layout is clean, readable, and free from parser-blocking columns.' },
  { icon: Hash, label: 'Keyword Match Rate', desc: 'Checks your terminology against millions of active job descriptions across the web.' },
  { icon: AlignLeft, label: 'Impact & Actions', desc: 'Rates bullet points on how strongly they communicate measurable achievements.' },
  { icon: Type, label: 'Readability Index', desc: 'Checks sentence length, active voice usage, and overall cognitive load.' },
  { icon: Shield, label: 'Essential Sections', desc: 'Verifies the presence and correct placement of contact details, education, and skills.' },
  { icon: Zap, label: 'Overall Hireability', desc: 'A consolidated score out of 100 ranking your chances against the average applicant pool.' },
];

const faqs = [
  {
    q: 'How accurate is the resume score?',
    a: 'Our scoring algorithm is based on the exact criteria used by modern Applicant Tracking Systems (ATS) and human recruiters, testing across over 40 individual data points.',
  },
  {
    q: 'What is a good resume score?',
    a: 'Anything above an 80 is considered strong. Scores below 60 typically mean your resume contains critical errors that will cause automated software to reject it immediately.',
  },
  {
    q: 'Does this score checker support PDFs?',
    a: 'Yes. You can upload a PDF or paste the raw text of your resume directly into our engine.',
  },
  {
    q: 'Do I have to pay to see my score?',
    a: 'No. The initial resume score check is completely free. We also offer a 14-day free trial containing unlimited AI rewrites to help you improve that score.',
  },
  {
    q: 'Can the AI rewrite my entire resume?',
    a: 'Absolutely. If your score is low, our AI can instantly reformat, restructure, and rewrite your bullet points to optimize against a specific job role.',
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How accurate is the resume score checker?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our checker tests your CV against 40+ metrics used by major ATS platforms and human recruiters for 99.9% accuracy."
      }
    },
    {
      "@type": "Question",
      "name": "What is a good resume score?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A score of 80/100 or higher is required to pass most Fortune 500 applicant tracking systems."
      }
    },
    {
      "@type": "Question",
      "name": "Do I have to pay to see my score?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. CVOptimizerAI provides a comprehensive resume score check completely free with no sign-up required."
      }
    },
    {
      "@type": "Question",
      "name": "Can the AI fix my low resume score automatically?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. If your score is low, our AI can instantly reformat, restructure, and rewrite your bullet points in one click."
      }
    }
  ]
};

export default function ResumeScoreCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 overflow-x-hidden selection:bg-blue-500/30">


      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative w-full min-h-[700px] flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden bg-[#fafafa]">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_80%,transparent_100%)] opacity-30 pointer-events-none" />
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#2563eb] to-[#93c5fd] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
          </div>

          <div className="container px-6 mx-auto max-w-4xl text-center relative z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-[13px] font-semibold mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Free — No credit card required
            </div>

            <h1 className="font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-6 text-5xl md:text-[68px]">
              Resume Score Checker<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
                Check Your CV Instantly
              </span>
            </h1>

            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-10 text-left max-w-2xl mx-auto">
              <p className="text-zinc-900 font-bold leading-relaxed">
                A resume score checker analyzes your CV across 40+ data points — keyword match rate, formatting, bullet impact, and section completeness — and returns a score out of 100. CVOptimizerAI's free checker requires no sign-up and delivers results in under 60 seconds, simulating the exact logic used by Fortune 500 ATS platforms.
              </p>
            </div>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight mb-10 max-w-2xl mx-auto">
              Find out exactly why you aren&apos;t getting interviews. Upload your resume to see your overall score and get instant AI-powered recommendations to fix it.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold text-[15px] shadow-[0_0_24px_rgba(59,130,246,0.3)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] transition-all hover:scale-[1.02] active:scale-95 border border-blue-400/20">
                  Analyze Resume Score <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full bg-white border-zinc-200 text-zinc-700 font-bold text-[15px] hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
                  View example score
                </Button>
              </a>
            </div>

            <p className="mt-8 text-[14px] font-bold text-zinc-600 tracking-tight">
              Calculates using 40+ data points · Get results in 60s
            </p>
          </div>
        </section>

        {/* ── Score example ── */}
        <section
          className="w-full py-16 md:py-24 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f1728 0%, #1a2744 50%, #0f1728 100%)' }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/8 rounded-full blur-[100px] pointer-events-none" />

          <div className="container px-6 mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[12px] font-black tracking-widest uppercase mb-6">
                <span className="text-yellow-400">✦</span> Turn rejection into offers
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4 leading-tight">
                Don&apos;t send an unverified resume.
              </h2>
              <p className="text-lg text-zinc-400 font-medium max-w-xl mx-auto">
                Discover your target impact score before the recruiter does.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto items-stretch">
              {/* Before */}
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Initial Upload</span>
                  <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">Needs Work</span>
                </div>
                <div className="flex justify-center">
                  <div className="relative w-[128px] h-[128px] flex items-center justify-center">
                    <svg width="128" height="128" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                      <circle cx="64" cy="64" r="54" fill="none" stroke="#ef4444" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 54 * 0.58} ${2 * Math.PI * 54 * 0.42}`}
                        transform="rotate(-90 64 64)"
                        style={{ filter: 'drop-shadow(0 0 6px #ef444460)' }} />
                      <text x="64" y="60" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="24" fontWeight="800" fontFamily="inherit">58</text>
                      <text x="64" y="76" textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="700" fontFamily="inherit">/ 100</text>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { sev: 'HIGH', text: 'Passive language used instead of action verbs' },
                    { sev: 'MED', text: 'Missing hard skills for related job titles' },
                    { sev: 'LOW', text: 'Formatting too complex for ATS software' },
                  ].map(item => (
                    <div key={item.sev} className="flex items-start gap-2.5 bg-red-500/8 border border-red-500/15 rounded-xl px-3 py-2.5">
                      <span className="text-[10px] font-black text-red-400 mt-0.5 shrink-0">{item.sev}</span>
                      <p className="text-[12px] text-zinc-400 font-medium leading-snug">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center shrink-0 py-2 sm:py-0">
                <ArrowRight className="w-6 h-6 text-zinc-500" />
              </div>

              {/* After */}
              <div className="flex-1 bg-emerald-500/5 border border-emerald-500/25 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_40px_-8px_rgba(16,185,129,0.2)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">After AI Fixing</span>
                  <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">Top 5%</span>
                </div>
                <div className="flex justify-center">
                  <div className="relative w-[128px] h-[128px] flex items-center justify-center">
                    <svg width="128" height="128" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                      <circle cx="64" cy="64" r="54" fill="none" stroke="#10b981" strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 54 * 0.92} ${2 * Math.PI * 54 * 0.08}`}
                        transform="rotate(-90 64 64)"
                        style={{ filter: 'drop-shadow(0 0 6px #10b98160)' }} />
                      <text x="64" y="60" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="24" fontWeight="800" fontFamily="inherit">92</text>
                      <text x="64" y="76" textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="700" fontFamily="inherit">/ 100</text>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    'Active verbs injected across all bullets',
                    'Missing core competencies added safely',
                    'Layout cleaned for perfect readability',
                  ].map(line => (
                    <div key={line} className="flex items-center gap-2.5 bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-3 py-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                      <p className="text-[12px] text-zinc-300 font-semibold leading-snug">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 mt-10">
              <Link href="/signup">
                <Button className="h-14 px-10 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-[15px] shadow-xl shadow-emerald-900/30 transition-all hover:scale-[1.02]">
                  Check My Resume Score <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <p className="text-[13px] text-zinc-500 font-medium">100% Free · No account required</p>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="w-full bg-[#fbfcfd] py-28 border-y border-zinc-100/80">
          <div className="container px-6 mx-auto max-w-6xl">
            <div className="max-w-3xl mb-16 text-center mx-auto">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">Fast Insights</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-5">
                How it works
              </h2>
              <p className="text-lg md:text-xl text-zinc-500 font-medium tracking-tight leading-relaxed">
                Check and improve your score in under 3 minutes.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 relative">
              <div className="hidden md:block absolute top-10 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent z-0" />
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="relative bg-white p-8 rounded-[24px] border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="size-12 rounded-[16px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900 mb-3 tracking-tight">{step.title}</h3>
                    <p className="text-zinc-500 leading-relaxed font-medium text-[15px]">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── What we check ── */}
        <section className="w-full bg-[#fafafa] py-28">
          <div className="container px-6 mx-auto max-w-6xl">
            <div className="max-w-3xl mb-16 text-center mx-auto">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">Deep Data Analysis</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-5">
                What drives your score
              </h2>
              <p className="text-lg md:text-xl text-zinc-500 font-medium tracking-tight leading-relaxed">
                Your score isn&apos;t just a random number. It&apos;s calculated over dozens of precise metrics.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {checks.map((check) => {
                const Icon = check.icon;
                return (
                  <div key={check.label} className="bg-white p-8 rounded-[24px] border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="size-12 rounded-[16px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center mb-6">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900 mb-3 tracking-tight">{check.label}</h3>
                    <p className="text-zinc-500 leading-relaxed font-medium text-[15px]">{check.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="w-full py-28 bg-white border-t border-zinc-100">
          <div className="container px-6 mx-auto max-w-3xl">
            <div className="text-center mb-16">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">Got questions?</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900">
                Frequently asked
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map(faq => (
                <div key={faq.q} className="bg-[#fafafa] p-8 rounded-[24px] border border-neutral-200 shadow-sm">
                  <p className="text-[16px] font-extrabold text-zinc-900 mb-3 tracking-tight">{faq.q}</p>
                  <p className="text-zinc-500 leading-relaxed font-medium text-[15px]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="relative w-full h-[420px] bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden border-t border-zinc-100">
          <div className="relative z-20 flex flex-col items-center w-full px-6 text-center">
            <p className="text-3xl md:text-5xl font-extrabold tracking-tighter text-zinc-900 drop-shadow-sm mb-8">
              Don&apos;t apply blindly.{' '}
              <span className="text-[#2563eb]">Score it first.</span>
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full bg-zinc-900 hover:bg-black text-white h-14 px-10 text-[15px] font-bold shadow-xl shadow-zinc-900/20 hover:shadow-2xl transition-all hover:scale-[1.03] active:scale-95">
                Scan My Resume Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-[13px] text-zinc-400 font-medium mt-4">
              14-day free trial · No credit card required · Cancel anytime
            </p>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="py-20 px-6 border-t border-zinc-100 bg-[#fafafa]">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-6 max-w-xs">
            <Link className="flex items-center gap-2" href="/">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-zinc-900">CV Optimizer AI</span>
            </Link>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">Handcrafted with precision to help candidates land their dream jobs at top companies worldwide.</p>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-4">© {new Date().getFullYear()} CV Optimizer AI. AI-Powered.</p>
          </div>
          <div className="grid grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-widest text-[#2563eb]">Product</p>
              <nav className="flex flex-col gap-4 text-sm font-bold text-zinc-600">
                <Link className="hover:text-zinc-900 transition-colors" href="/templates">Templates</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/pricing">Pricing</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/free-ats-checker">Free ATS Checker</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/resume-score-checker">Resume Score Checker</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/about">About</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/blog">Blog</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/login">Login</Link>
              </nav>
            </div>
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-widest text-[#2563eb]">Legal</p>
              <nav className="flex flex-col gap-4 text-sm font-bold text-zinc-600">
                <Link className="hover:text-zinc-900 transition-colors" href="#">Privacy</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="#">Terms</Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>

    </div>
    </>
  );
}
