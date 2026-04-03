import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, CheckCircle2, XCircle, ChevronRight, Star } from 'lucide-react';
import { BlogFeatures } from '@/components/blog/BlogFeatures';
import { ComparisonFAQ } from '@/components/ui/comparison-faq';
import { RelatedComparisons } from '@/components/ui/related-comparisons';

export const metadata: Metadata = {
  title: 'Best ATS Resume Checker in 2026 — Which Tool Should You Use?',
  description:
    'Compare the best ATS resume checker tools in 2026. See features, pricing, and which resume checker is best for job seekers.',
  openGraph: {
    title: 'Best ATS Resume Checker in 2026 — Which Tool Should You Use?',
    description:
      'Compare the best ATS resume checker tools in 2026. See features, pricing, and which resume checker is best for job seekers.',
    type: 'website',
    url: 'https://cvoptimizerai.com/best-ats-resume-checker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best ATS Resume Checker in 2026 — Which Tool Should You Use?',
    description:
      'Compare the best ATS resume checker tools in 2026. See features, pricing, and which resume checker is best for job seekers.',
  },
  alternates: { canonical: 'https://cvoptimizerai.com/best-ats-resume-checker' },
};

const comparisonData = [
  { item: 'Focus', jobscan: 'Keyword Match', rezi: 'AI Bullet Writing', teal: 'Job Tracking', resumeio: 'Aesthetics', cvo: 'ATS Scoring & AI Rewrite' },
  { item: 'ATS Parser Check', jobscan: 'No', rezi: 'No', teal: 'No', resumeio: 'No', cvo: 'Yes (Deep Structure)' },
  { item: 'AI Content Generation', jobscan: 'Basic', rezi: 'Excellent', teal: 'Good', resumeio: 'Basic', cvo: 'Exceptional' },
  { item: 'Pricing (Monthly)', jobscan: '$49.95', rezi: '$29.00', teal: '$29.00', resumeio: '$24.95', cvo: 'Free Tools + Pro Options' },
];

const faqs = [
  { q: "What is the best ATS resume checker in 2026?", a: "While tools like Jobscan and Rezi are popular, CV Optimizer AI is considered the best overall in 2026 because it combines deep ATS formatting parsing with GPT-4 AI rewriting features." },
  { q: "Do these checkers guarantee I will pass?", a: "No tool can guarantee a job offer, but using a modern ATS checker dramatically increases your chances of getting past initial automated screeners by ensuring your resume is readable." },
  { q: "Are ATS resume checkers free?", a: "Most offer a free trial or basic scan. CV Optimizer AI provides a comprehensive free ATS score and formatting check before requiring an upgrade for AI writing features." }
];

export default function BestAtsCheckerPage() {
  return (
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
            <Link href="/free-ats-checker">
              <Button className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold rounded-full px-6 h-10 shadow-sm transition-all hover:scale-105 active:scale-95">
                Check ATS Score Free <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative w-full min-h-[550px] flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden bg-[#fafafa]">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_80%,transparent_100%)] opacity-30 pointer-events-none" />
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#2563eb] to-[#93c5fd] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
          </div>

          <div className="container px-6 mx-auto max-w-4xl text-center relative z-20 mt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-[13px] font-semibold mb-8 shadow-sm">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              2026 Ultimate Guide
            </div>

            <h1 className="font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-6 text-5xl md:text-[64px]">
              Best ATS Resume Checker<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
                Which Tool Should You Use?
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight mb-10 max-w-3xl mx-auto">
              With 98% of Fortune 500 companies filtering resumes through Applicant Tracking Systems, you need a checker you can trust. We analyzed Jobscan, Rezi, Teal, Resume.io, and CVOptimizerAI to find the absolute best tool to land you interviews in 2026.
            </p>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="w-full bg-white py-20 border-y border-zinc-100/80">
          <div className="container px-6 mx-auto max-w-6xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-8 text-center">
              Top 5 Tools Compared
            </h2>

            <div className="overflow-x-auto rounded-[24px] border border-neutral-200 shadow-sm">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-neutral-200 text-[15px]">
                    <th className="p-4 font-bold text-zinc-600 w-1/6">Feature</th>
                    <th className="p-4 font-extrabold text-zinc-900 w-1/6">Jobscan</th>
                    <th className="p-4 font-extrabold text-zinc-900 w-1/6">Rezi</th>
                    <th className="p-4 font-extrabold text-zinc-900 w-1/6">Teal</th>
                    <th className="p-4 font-extrabold text-zinc-900 w-1/6">Resume.io</th>
                    <th className="p-4 font-extrabold text-blue-600 bg-blue-50/30 w-1/6">CVOptimizerAI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-[14px]">
                  {comparisonData.map((row) => (
                    <tr key={row.item} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-4 font-bold text-zinc-700">{row.item}</td>
                      <td className="p-4 font-medium text-zinc-600">{row.jobscan}</td>
                      <td className="p-4 font-medium text-zinc-600">{row.rezi}</td>
                      <td className="p-4 font-medium text-zinc-600">{row.teal}</td>
                      <td className="p-4 font-medium text-zinc-600">{row.resumeio}</td>
                      <td className="p-4 font-bold text-blue-700 bg-blue-50/30">{row.cvo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Reviews & Analysis ── */}
        <section className="w-full bg-[#fbfcfd] py-24">
          <div className="container px-6 mx-auto max-w-4xl space-y-16">
            
            {/* Jobscan */}
            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900">Jobscan</h3>
                <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-full uppercase tracking-widest">Best for keyword mapping</span>
              </div>
              <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                Jobscan is the oldest and most well-known ATS keyword scanner. It computes a direct percentage match between your resume and a target job description based on word frequency and hard skills.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                  <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> Extremely thorough hard skills analysis.</li>
                  <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> Includes LinkedIn profile scanning.</li>
                </ul>
                <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                  <li className="flex gap-2 items-start"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0"/> Very expensive ($49.95/mo).</li>
                  <li className="flex gap-2 items-start"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0"/> Poor visual resume templates.</li>
                </ul>
              </div>
            </div>

            {/* Rezi */}
            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900">Rezi</h3>
                <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-full uppercase tracking-widest">Best for AI writing</span>
              </div>
              <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                Rezi focuses entirely on using AI to write your resume for you. It relies heavily on standard templates and generates bullet points tailored to the job title you designate.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                  <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> Writes acceptable bullet points automatically.</li>
                  <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> Simple block-based formatting.</li>
                </ul>
                <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                  <li className="flex gap-2 items-start"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0"/> Form-heavy data entry process.</li>
                  <li className="flex gap-2 items-start"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0"/> Does not scan existing visual layouts.</li>
                </ul>
              </div>
            </div>

            {/* Teal */}
            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900">Teal</h3>
                <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-full uppercase tracking-widest">Best for job tracking</span>
              </div>
              <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                Teal is a phenomenal platform for organizing your job search. Its Chrome extension lets you bookmark jobs directly from LinkedIn, and its builder highlights keywords from the saved listing missing in your text.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                  <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> Pipeline board organizes applications perfectly.</li>
                  <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> Easy-to-read keyword highlighting.</li>
                </ul>
                <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                  <li className="flex gap-2 items-start"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0"/> Cluttered interface loaded with too many tabs.</li>
                  <li className="flex gap-2 items-start"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0"/> Lackluster ATS structural analysis.</li>
                </ul>
              </div>
            </div>

            {/* Resume.io */}
            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900">Resume.io</h3>
                <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-full uppercase tracking-widest">Best for aesthetics</span>
              </div>
              <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                Resume.io lets you build incredibly beautiful resumes using a sleek drag-and-drop builder. It focuses heavily on aesthetics and design rather than technical ATS keyword scoring.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                  <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> Stunning array of modern templates.</li>
                  <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> Generates summary paragraphs easily.</li>
                </ul>
                <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                  <li className="flex gap-2 items-start"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0"/> Zero parsing evaluation or keyword matching.</li>
                  <li className="flex gap-2 items-start"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0"/> Some multi-column templates fail ATS software.</li>
                </ul>
              </div>
            </div>

            {/* CVOptimizerAI */}
            <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-200/60 p-8 md:p-10 rounded-[24px] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900">CVOptimizerAI</h3>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-sm">The All-in-One Solution</span>
                </div>
                <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                  CVOptimizerAI uses deep structural scanning to test how an ATS actually reads your layout, calculates a 100-point impact score, and then utilizes target-specific AI to instantly rewrite bullet points so they pass filters.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> Scans structural integrity (tables, columns, etc).</li>
                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> Supercharged contextual AI rewriting.</li>
                    <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> Professional, ATS-safe templates built-in.</li>
                  </ul>
                  <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0"/> Available completely free to start testing.</li>
                  </ul>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* ── Summary Matrix ── */}
        <section className="w-full bg-white py-24 border-y border-zinc-100/80">
          <div className="container px-6 mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-10">
              Which ATS checker is best for different types of users?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="p-6 rounded-2xl bg-[#fafafa] border border-zinc-100">
                <p className="font-extrabold text-lg text-zinc-900 mb-2">If you crave deep data...</p>
                <p className="text-zinc-600 font-medium leading-relaxed text-sm">Choose <strong className="text-zinc-900">Jobscan</strong> if you have a massive budget and want to manually tweak your resume word-by-word against your target job listing to maximize keyword intersection percentages.</p>
              </div>
              <div className="p-6 rounded-2xl bg-[#fafafa] border border-zinc-100">
                <p className="font-extrabold text-lg text-zinc-900 mb-2">If you want aesthetics...</p>
                <p className="text-zinc-600 font-medium leading-relaxed text-sm">Choose <strong className="text-zinc-900">Resume.io</strong> to quickly export a visually stunning, colored template when you plan to pass your resume directly to a human and bypass applicant tracking portals.</p>
              </div>
              <div className="p-6 rounded-2xl bg-[#fafafa] border border-zinc-100">
                <p className="font-extrabold text-lg text-zinc-900 mb-2">If you are hyper-organizing...</p>
                <p className="text-zinc-600 font-medium leading-relaxed text-sm">Choose <strong className="text-zinc-900">Teal</strong> to manage hundreds of job applications in a clean Kanban board style while receiving surface-level keyword recommendations.</p>
              </div>
              <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100">
                <p className="font-extrabold text-lg text-blue-900 mb-2">If you want guaranteed interviews...</p>
                <p className="text-zinc-600 font-medium leading-relaxed text-sm">Choose <strong className="text-blue-600 text-base">CVOptimizerAI</strong> to instantly detect structural ATS flaws and use intelligent AI to auto-rewrite your experience into powerful, high-impact bullet points perfectly tailored to your target job.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Conclusion / The Better Alternative ── */}
        <section className="w-full bg-[#fafafa] py-24 border-t border-zinc-100">
          <div className="container px-6 mx-auto max-w-4xl text-center">
            <p className="text-lg text-zinc-900 font-bold leading-relaxed mb-12">
              Start by testing your current setup today. See if your resume actually parses correctly through modern systems.
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-200/60 p-10 rounded-[32px] shadow-lg shadow-blue-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-[13px] font-black tracking-widest uppercase mb-6 shadow-md shadow-blue-600/20">
                  <Zap className="w-4 h-4" /> Rated #1 in 2026
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-zinc-900 mb-5">
                  CVOptimizerAI
                </h3>
                <p className="text-lg text-zinc-600 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
                  Get your ATS score in seconds and instantly improve your resume with AI.
                </p>

                <Link href="/free-ats-checker">
                  <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 text-[16px] font-bold shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.03] active:scale-95">
                    Check Your ATS Score Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-[13px] text-blue-200/70 font-medium mt-4">
                  No credit card required · Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Feature Showcase ─────────────────────────────── */}
      <BlogFeatures />

      <ComparisonFAQ faqs={faqs} />
      <RelatedComparisons currentPath="/best-ats-resume-checker" />

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
                <Link className="hover:text-zinc-900 transition-colors" href="/privacy">Privacy Policy</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/terms">Terms of Service</Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
