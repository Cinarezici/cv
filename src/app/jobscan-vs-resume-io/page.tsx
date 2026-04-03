import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { BlogFeatures } from '@/components/blog/BlogFeatures';
import { ComparisonFAQ } from '@/components/ui/comparison-faq';
import { RelatedComparisons } from '@/components/ui/related-comparisons';

export const metadata: Metadata = {
  title: 'Jobscan vs Resume.io — Which Resume Tool Is Better in 2026?',
  description:
    'Compare Jobscan and Resume.io side by side. See features, pricing, and which resume tool is best for ATS optimization in 2026.',
  openGraph: {
    title: 'Jobscan vs Resume.io — Which Resume Tool Is Better in 2026?',
    description:
      'Compare Jobscan and Resume.io side by side. See features, pricing, and which resume tool is best for ATS optimization in 2026.',
    type: 'website',
    url: 'https://cvoptimizerai.com/jobscan-vs-resume-io',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobscan vs Resume.io — Which Resume Tool Is Better in 2026?',
    description:
      'Compare Jobscan and Resume.io side by side. See features, pricing, and which resume tool is best for ATS optimization in 2026.',
  },
  alternates: { canonical: 'https://cvoptimizerai.com/jobscan-vs-resume-io' },
};

const comparisonData = [
  { feature: 'Primary Focus', jobscan: 'ATS Optimization (Matching)', resumeio: 'Visual Template Builder', cvo: 'ATS Scoring & AI Rewrite' },
  { feature: 'ATS Analysis', jobscan: 'High (Word frequency)', resumeio: 'None', cvo: 'Deep Parser & Formatting Check' },
  { feature: 'Resume Building', jobscan: 'Basic text editor', resumeio: 'Excellent (Drag-and-drop)', cvo: 'Exceptional (Role-Targeted AI)' },
  { feature: 'Pricing (Monthly)', jobscan: '$49.95 / mo', resumeio: '$24.95 / mo', cvo: 'Free Tools + Pro Options' },
  { feature: 'Ease of Use', jobscan: 'Moderate (complex UI)', resumeio: 'High (very intuitive)', cvo: 'High (Upload & Fix in 1 click)' },
];

const faqs = [
  { q: "Is Jobscan better than Resume.io?", a: "Jobscan is better if your primary goal is matching keywords from a job description to beat ATS systems. Resume.io is better if you need a quickly generated, beautiful visual template." },
  { q: "Do Resume.io templates pass ATS parsers?", a: "Some do, but many of their highly visual, multi-column templates can struggle with older Applicant Tracking Systems that prefer standard top-to-bottom text matching." },
  { q: "Is there a free alternative to both?", a: "CV Optimizer AI provides a free ATS checker and combines beautiful modern templates with deep ATS parsing logic, solving the issues of both tools." }
];

export default function JobscanVsResumeIoPage() {
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
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              2026 Resume Tool Comparison
            </div>

            <h1 className="font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-6 text-5xl md:text-[64px]">
              Jobscan vs Resume.io<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
                Which Resume Tool Is Better?
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight mb-10 max-w-3xl mx-auto">
              You want to land more interviews, but you are stuck choosing between Jobscan's deep ATS matching and Resume.io's beautiful templates. Which tool should you use in 2026, and is there a third option that combines the best of both worlds?
            </p>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="w-full bg-white py-20 border-y border-zinc-100/80">
          <div className="container px-6 mx-auto max-w-5xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-8 text-center">
              Head-to-Head Comparison
            </h2>

            <div className="overflow-x-auto rounded-[24px] border border-neutral-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-neutral-200">
                    <th className="p-5 font-bold text-zinc-600 w-1/4">Feature</th>
                    <th className="p-5 font-extrabold text-zinc-900 text-lg w-1/4">Jobscan</th>
                    <th className="p-5 font-extrabold text-zinc-900 text-lg w-1/4">Resume.io</th>
                    <th className="p-5 font-extrabold text-blue-600 text-lg w-1/4 bg-blue-50/30">CVOptimizerAI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-5 font-bold text-zinc-700">{row.feature}</td>
                      <td className="p-5 font-medium text-zinc-600">{row.jobscan}</td>
                      <td className="p-5 font-medium text-zinc-600">{row.resumeio}</td>
                      <td className="p-5 font-bold text-blue-700 bg-blue-50/30">{row.cvo}</td>
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
              <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-4">Jobscan Overview</h3>
              <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                Jobscan is the veteran in the ATS optimization space. It works by analyzing the job description you paste in and matching it against the exact words in your resume, calculating a precise "match rate" percentage.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-emerald-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Pros
                  </h4>
                  <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> The most thorough keyword matching engine available.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Gives concrete feedback on hard and soft skills.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Useful LinkedIn profile optimization tool included.</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-red-600 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Cons
                  </h4>
                  <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Extremely expensive at almost $50/month.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> The interface is clunky and feels outdated.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> The generated resumes look very plain.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Resume.io */}
            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-4">Resume.io Overview</h3>
              <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                Resume.io is built for speed and aesthetics. It provides a massive library of gorgeous, modern templates and a smooth drag-and-drop editor that lets you build a beautiful CV with zero prior design experience. 
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-emerald-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Pros
                  </h4>
                  <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> One of the best template libraries on the market.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Incredibly smooth and fast user experience.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Auto-generates summary statements easily.</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-red-600 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Cons
                  </h4>
                  <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> No true ATS scanning or keyword comparison.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Some visually complex templates fail ATS parsers.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Very difficult to export for free.</li>
                  </ul>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* ── Conclusion / The Better Alternative ── */}
        <section className="w-full bg-[#fafafa] py-24 border-t border-zinc-100">
          <div className="container px-6 mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 mb-6">
              Which one should you choose?
            </h2>
            <p className="text-lg text-zinc-600 font-medium leading-relaxed mb-6">
              If you just want your resume to <strong>look beautiful and modern</strong> quickly, use Resume.io. If you have the budget and need to <strong>painstakingly match keywords</strong> to a job description, use Jobscan.
            </p>
            <p className="text-lg text-zinc-900 font-bold leading-relaxed mb-12">
              But what if you want a beautiful, ATS-safe template AND advanced AI scanning that automatically rewrites your bullet points to match the job description?
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-200/60 p-10 rounded-[32px] shadow-lg shadow-blue-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-[13px] font-black tracking-widest uppercase mb-6 shadow-md shadow-blue-600/20">
                  <Zap className="w-4 h-4" /> The Modern Alternative
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
      <RelatedComparisons currentPath="/jobscan-vs-resume-io" />

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
