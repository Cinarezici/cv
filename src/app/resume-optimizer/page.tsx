import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, CheckCircle2, Upload, Sparkles,
  Zap, FileText, Target, Shield, MousePointerClick, BarChart3
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Resume Optimizer — Rewrite Your CV for Any Job Instantly',
  description:
    'Optimize your resume for any job description in seconds. Our AI resume optimizer fixes formatting, injects keywords, and writes high-impact bullet points.',
  openGraph: {
    title: 'AI Resume Optimizer — Rewrite Your CV for Any Job Instantly',
    description:
      'Optimize your resume for any job description in seconds. Our AI resume optimizer fixes formatting, injects keywords, and writes high-impact bullet points.',
    type: 'website',
    url: 'https://cvoptimizerai.com/resume-optimizer',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Resume Optimizer — Rewrite Your CV for Any Job Instantly',
    description:
      'Optimize your resume for any job description in seconds. Our AI resume optimizer fixes formatting, injects keywords, and writes high-impact bullet points.',
  },
  alternates: { canonical: 'https://cvoptimizerai.com/resume-optimizer' },
};

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Your Resume',
    desc: 'Paste your text or upload a PDF. We automatically extract and organize your entire work history.',
  },
  {
    icon: Target,
    step: '02',
    title: 'Add a Job Description',
    desc: 'Paste the exact job you want to apply for. Our AI analyzes the core requirements and missing keywords.',
  },
  {
    icon: Sparkles,
    step: '03',
    title: 'One-Click Optimization',
    desc: 'The AI rewrites your bullet points, fixes formatting, and perfectly aligns your CV with the role.',
  },
];

const features = [
  { icon: FileText, label: 'ATS Formatting', desc: 'Converts your resume into a clean, single-column design that ATS bots can easily read.' },
  { icon: Target, label: 'Keyword Injection', desc: 'Naturally weaves in required skills and terminology from the exact job description.' },
  { icon: Sparkles, label: 'Impact Rewrite', desc: 'Transforms weak, passive bullet points into strong, achievement-oriented statements.' },
  { icon: Shield, label: 'Grammar & Tone', desc: 'Fixes typos and ensures a professional, confident tone throughout the document.' },
  { icon: MousePointerClick, label: 'Instant PDF Export', desc: 'Download your optimized resume immediately as a perfectly formatted, recruiter-ready PDF.' },
  { icon: BarChart3, label: 'Score Improvement', desc: 'Watch your ATS compatibility score jump from <50 to 90+ in a matter of seconds.' },
];

const faqs = [
  {
    q: 'How does the resume optimizer work?',
    a: 'It uses advanced AI (similar to GPT-4) to read your existing resume and a target job description. It then rewrites your bullet points to highlight the exact skills and experiences the employer is looking for.',
  },
  {
    q: 'Will the AI makeup fake experience?',
    a: 'No. The AI is strictly instructed to rewrite your existing responsibilities and achievements to sound more impactful and relevant, without lying or inventing new experience.',
  },
  {
    q: 'Is it free to use?',
    a: 'You can upload your resume and get a free ATS score and gap analysis. The full AI rewrite feature is available through our highly affordable premium plan or trial.',
  },
  {
    q: 'Can it optimize my resume for multiple different jobs?',
    a: 'Yes! You can create unlimited variations of your resume. Apply for a Project Manager role today and a Scrum Master role tomorrow, each perfectly tailored.',
  }
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

export default function ResumeOptimizerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
                Optimize My CV <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
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
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#2563eb] to-[#34d399] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
          </div>

          <div className="container px-6 mx-auto max-w-4xl text-center relative z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-[13px] font-semibold mb-8 shadow-sm">
              <Sparkles className="h-3 w-3 text-blue-500" />
              Powered by advanced AI models
            </div>

            <h1 className="font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-6 text-5xl md:text-[68px]">
              The Ultimate<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
                Resume Optimizer
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight mb-10 max-w-2xl mx-auto">
              Stop sending the exact same resume to 100 different jobs. Upload your baseline CV, paste a job description, and watch our AI instantly rewrite your bullets to match the role perfectly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold text-[15px] shadow-[0_0_24px_rgba(59,130,246,0.3)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] transition-all hover:scale-[1.02] active:scale-95 border border-blue-400/20">
                  Optimize My Resume Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-[14px] font-bold text-zinc-600 tracking-tight">
              Takes less than 60 seconds · Download as PDF instantly
            </p>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="w-full bg-[#fbfcfd] py-28 border-y border-zinc-100/80">
          <div className="container px-6 mx-auto max-w-6xl">
            <div className="max-w-3xl mb-16 text-center mx-auto">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">The Process</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-5">
                How optimization works
              </h2>
              <p className="text-lg md:text-xl text-zinc-500 font-medium tracking-tight leading-relaxed">
                We remove the manual grind of writing and rewriting.
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

        {/* ── Features ── */}
        <section className="w-full bg-[#fafafa] py-28">
          <div className="container px-6 mx-auto max-w-6xl">
            <div className="max-w-3xl mb-16 text-center mx-auto">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">Complete Polish</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-5">
                What the AI fixes
              </h2>
              <p className="text-lg md:text-xl text-zinc-500 font-medium tracking-tight leading-relaxed">
                It's not just a spell-checker. It's an intelligent restructuring of your professional history.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.label} className="bg-white p-8 rounded-[24px] border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="size-12 rounded-[16px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center mb-6">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900 mb-3 tracking-tight">{feature.label}</h3>
                    <p className="text-zinc-500 leading-relaxed font-medium text-[15px]">{feature.desc}</p>
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
              Stop rewriting manually.{' '}
              <span className="text-[#2563eb]">Let AI optimize it.</span>
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full bg-zinc-900 hover:bg-black text-white h-14 px-10 text-[15px] font-bold shadow-xl shadow-zinc-900/20 hover:shadow-2xl transition-all hover:scale-[1.03] active:scale-95">
                Optimize Your Resume <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
