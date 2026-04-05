import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, Upload, BarChart3, Sparkles,
  Zap, Shield, FileText, Type, Hash, AlignLeft, Bot
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free AI Resume Checker — Instant ATS Score & Smart Rewrite | CVOptimizerAI',
  description:
    'Upload your resume and get an AI-powered compatibility score in seconds. Our AI resume checker identifies keyword gaps, formatting issues, and rewrites your CV for any role.',
  openGraph: {
    title: 'Free AI Resume Checker — Instant ATS Score & Smart Rewrite | CVOptimizerAI',
    description:
      'Upload your resume and get an AI-powered compatibility score in seconds. Our AI resume checker identifies keyword gaps, formatting issues, and rewrites your CV for any role.',
    type: 'website',
    url: 'https://cvoptimizerai.com/ai-resume-checker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Resume Checker — Instant ATS Score & Smart Rewrite | CVOptimizerAI',
    description:
      'Upload your resume and get an AI-powered compatibility score in seconds. Our AI resume checker identifies keyword gaps, formatting issues, and rewrites your CV for any role.',
  },
  alternates: { canonical: 'https://cvoptimizerai.com/ai-resume-checker' },
};

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Your Resume',
    desc: 'Feed your PDF or text into our AI parsing engine.',
  },
  {
    icon: Bot,
    step: '02',
    title: 'The AI Reads It',
    desc: 'The AI mimics how a corporate tracking system parses your data, looking for structural flaws.',
  },
  {
    icon: Sparkles,
    step: '03',
    title: 'Get Your Action Plan',
    desc: 'Receive a score out of 100 with precise AI-generated steps to fix every highlighted error.',
  },
];

const checks = [
  { icon: Bot, label: 'Robotic Parsing', desc: 'Predicts how cleanly an enterprise ATS will extract your name, email, and experience.' },
  { icon: Hash, label: 'Keyword Detection', desc: 'Uses natural language processing (NLP) to detect implicit and explicit skills.' },
  { icon: AlignLeft, label: 'Action Verb Check', desc: 'The AI identifies weak phrasing and suggests stronger verbs to lead your bullet points.' },
  { icon: Type, label: 'Readability Scoring', desc: 'Evaluates the cognitive load of your sentences to ensure recruiters can easily scan it.' },
  { icon: Shield, label: 'Formatting Safety', desc: 'Flags risky elements like multi-column layouts, tables, and non-standard fonts.' },
  { icon: Zap, label: 'AI Optimization', desc: 'If your score is low, our AI rewrites it for you with a single click.' },
];

const faqs = [
  {
    q: 'What makes this an "AI" resume checker?',
    a: 'Unlike older tools that just look for exact word matches, our AI checker uses Large Language Models (LLMs) to understand context. It knows that "managed a database" and "oversaw SQL clusters" are related skills.',
  },
  {
    q: 'Does it cost money to run the AI scan?',
    a: 'No. The AI resume checker provides a comprehensive score and error breakdown entirely for free, with no sign-up required.',
  },
  {
    q: 'Will employers know I used an AI checker?',
    a: 'No. The scanner provides feedback on formatting and wording. It does not leave any watermarks or hidden metadata on your exported PDF unless you use our specific AI rewrite tool (and even then, it is indistinguishable from human writing).',
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "CVOptimizerAI AI Resume Checker",
  "operatingSystem": "Web",
  "applicationCategory": "BusinessApplication",
  "url": "https://cvoptimizerai.com/ai-resume-checker",
  "description": "AI-powered resume checker that identifies keyword gaps, formatting issues, and rewrites CV for job roles.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "842"
  }
};

export default function AiResumeCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 overflow-x-hidden selection:bg-blue-500/30">

      {/* ── Minimal conversion navbar ── */}
      <div className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-5xl z-50 flex justify-center pointer-events-none">
        <header className="flex items-center justify-between w-full h-16 px-4 md:px-6 border border-zinc-200/80 bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] pointer-events-auto transition-all">
          <Link className="flex items-center gap-2 group" href="/">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 transition-transform group-hover:scale-110 shadow-md shadow-blue-600/20 flex-shrink-0">
              <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-zinc-900 hidden sm:block">CV Optimizer AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[14px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors hidden md:block">
              Login
            </Link>
            <Link href="/signup">
              <Button className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold rounded-full px-6 h-10 shadow-sm transition-all hover:scale-105 active:scale-95">
                Scan Resume Free <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative w-full min-h-[700px] flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden bg-[#fafafa]">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_80%,transparent_100%)] opacity-30 pointer-events-none" />
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#93c5fd] to-[#8b5cf6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
          </div>

          <div className="container px-6 mx-auto max-w-4xl text-center relative z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-[13px] font-semibold mb-8 shadow-sm">
              <Bot className="h-3 w-3 text-violet-500" />
              Machine Learning Powered Checker
            </div>

            <h1 className="font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-6 text-5xl md:text-[68px]">
              AI Resume Checker:<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6]">
                Find the Errors Humans Miss
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight mb-10 max-w-2xl mx-auto">
              Recruiters use AI to filter your resume. You should use AI to check it first. Find out if your formatting blocks the parser or if you lack semantic keyword matches.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] hover:from-[#7c3aed] hover:to-[#2563eb] text-white font-bold text-[15px] shadow-[0_0_24px_rgba(139,92,246,0.3)] hover:shadow-[0_0_32px_rgba(139,92,246,0.5)] transition-all hover:scale-[1.02] active:scale-95 border border-violet-400/20">
                  Run AI Scan Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full bg-white border-zinc-200 text-zinc-700 font-bold text-[15px] hover:bg-white hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm hover:shadow-md">
                  View how it works
                </Button>
              </a>
            </div>

            <p className="mt-8 text-[14px] font-bold text-zinc-600 tracking-tight">
              Calculates using 40+ NLP data points · Get results instantly
            </p>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="w-full bg-[#fbfcfd] py-28 border-y border-zinc-100/80">
          <div className="container px-6 mx-auto max-w-6xl">
            <div className="max-w-3xl mb-16 text-center mx-auto">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-violet-600 mb-4">Under the Hood</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-5">
                How our AI reads your CV
              </h2>
              <p className="text-lg md:text-xl text-zinc-500 font-medium tracking-tight leading-relaxed">
                It's deeper than a simple keyword checker.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 relative">
              <div className="hidden md:block absolute top-10 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent z-0" />
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="relative bg-white p-8 rounded-[24px] border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="size-12 rounded-[16px] bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100/50 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-violet-600" />
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
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-violet-600 mb-4">Deep Data Analysis</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-5">
                What drives your AI score
              </h2>
              <p className="text-lg md:text-xl text-zinc-500 font-medium tracking-tight leading-relaxed">
                The scanner simulates how Applicant Tracking Systems behave in 2026.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {checks.map((check) => {
                const Icon = check.icon;
                return (
                  <div key={check.label} className="bg-white p-8 rounded-[24px] border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="size-12 rounded-[16px] bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100/50 flex items-center justify-center mb-6">
                      <Icon className="h-6 w-6 text-violet-600" />
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
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-violet-600 mb-4">Got questions?</p>
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
              <span className="text-[#8b5cf6]">Let the AI Check It.</span>
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full bg-zinc-900 hover:bg-black text-white h-14 px-10 text-[15px] font-bold shadow-xl shadow-zinc-900/20 hover:shadow-2xl transition-all hover:scale-[1.03] active:scale-95">
                Start AI Scan Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-[13px] text-zinc-400 font-medium mt-4">
              100% Free · No credit card required · Instant Results
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
                <Link className="hover:text-zinc-900 transition-colors" href="/privacy">Privacy</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/terms">Terms</Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>

    </div>
    </>
  );
}
