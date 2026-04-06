import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import { BlogFeatures } from '@/components/blog/BlogFeatures';
import { ComparisonFAQ } from '@/components/ui/comparison-faq';
import { RelatedComparisons } from '@/components/ui/related-comparisons';

export const metadata: Metadata = {
  title: '7 Best Jobscan Alternatives in 2026 (Free ATS Tools That Score Better)',
  description: 'Jobscan charges $49.95/month and caps free scans at 5. These 7 Jobscan alternatives give you ATS scoring, AI rewrites, and keyword matching — most of them free.',
  openGraph: {
    title: '7 Best Jobscan Alternatives in 2026 (Free ATS Tools That Score Better)',
    description: 'Jobscan charges $49.95/month and caps free scans at 5. These 7 Jobscan alternatives give you ATS scoring, AI rewrites, and keyword matching — most of them free.',
    type: 'website',
    url: 'https://cvoptimizerai.com/jobscan-alternatives',
  },
  twitter: {
    card: 'summary_large_image',
    title: '7 Best Jobscan Alternatives in 2026 (Free ATS Tools That Score Better)',
    description: 'Jobscan charges $49.95/month and caps free scans at 5. These 7 Jobscan alternatives give you ATS scoring, AI rewrites, and keyword matching — most of them free.',
  },
  alternates: { canonical: 'https://cvoptimizerai.com/jobscan-alternatives' },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "7 Best Jobscan Alternatives in 2026",
  "description": "The best free and paid alternatives to Jobscan for ATS resume optimization.",
  "numberOfItems": 3,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "CVOptimizerAI",
      "url": "https://cvoptimizerai.com",
      "description": "Free ATS resume checker with one-click AI rewrite."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Rezi",
      "url": "https://rezi.ai",
      "description": "AI resume builder tailored specifically for writing bullets."
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Teal",
      "url": "https://tealhq.com",
      "description": "Job application tracking system with resume keyword highlighting."
    }
  ]
};

const comparisonData = [
  { feature: 'Core Strength', jobscan: 'Exact Keyword Match', cvo: 'ATS Scoring & AI Rewrite', rezi: 'AI Bullet Writing', teal: 'Job Tracking' },
  { feature: 'Free Features', jobscan: '5 Total Scans Limit', cvo: 'Unlimited Free Scoring', rezi: 'Basic Builder', teal: 'Basic Tracker' },
  { feature: 'Price (Monthly)', jobscan: '$49.95 / mo', cvo: 'Free Tools + Ultra-Affordable', rezi: '$29.00 / mo', teal: '$29.00 / mo' },
];

const faqs = [
  { q: "Why do people look for Jobscan alternatives?", a: "The main reasons are cost ($49.95/month is expensive) and the fact that Jobscan relies on older exact-match keyword technology rather than semantic AI understanding." },
  { q: "What is the best free Jobscan alternative?", a: "CV Optimizer AI is widely considered the best free alternative. You can score your resume out of 100 and identify missing skills without hitting aggressive paywalls." },
  { q: "Does matching 80% on Jobscan guarantee an interview?", a: "No. Modern ATS systems like Workday or Lever don't actually screen candidates out based on an arbitrary 'match percentage'. They use search ranking. Tools like CV Optimizer AI focus on readability and impact rather than just keyword stuffing." }
];

export default function JobscanAlternativesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 overflow-x-hidden selection:bg-blue-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative w-full min-h-[550px] flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden bg-[#fafafa]">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_80%,transparent_100%)] opacity-30 pointer-events-none" />
          
          <div className="container px-6 mx-auto max-w-4xl text-center relative z-20 mt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-[13px] font-semibold mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              2026 ATS Tracker Alternatives
            </div>

            <h1 className="font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-6 text-5xl md:text-[64px]">
              Top Jobscan Alternatives<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
                Save $50/Month in 2026
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight mb-10 max-w-3xl mx-auto">
              Jobscan is the biggest name in ATS checkers, but its strict 5-scan cap and high monthly price are major hurdles. In 2026, modern AI alternatives provide better structural scoring and unlimited rewriting—often completely free.
            </p>
            
            <Link href="/signup">
                <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold text-[15px] shadow-[0_0_24px_rgba(59,130,246,0.3)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] transition-all hover:scale-[1.02] active:scale-95 border border-blue-400/20">
                  Try the #1 Free Alternative <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="w-full bg-white py-20 border-y border-zinc-100/80">
          <div className="container px-6 mx-auto max-w-6xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-8 text-center">
              Quick Feature Breakdown
            </h2>

            <div className="overflow-x-auto rounded-[24px] border border-neutral-200 shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-neutral-200">
                    <th className="p-5 font-bold text-zinc-600 w-1/5 whitespace-nowrap">Feature</th>
                    <th className="p-5 font-extrabold text-zinc-400 text-lg w-1/5 whitespace-nowrap">Jobscan</th>
                    <th className="p-5 font-extrabold text-blue-600 text-lg w-1/5 bg-blue-50/30 whitespace-nowrap border-x border-blue-100">CVOptimizerAI</th>
                    <th className="p-5 font-extrabold text-zinc-900 text-lg w-1/5 whitespace-nowrap">Rezi</th>
                    <th className="p-5 font-extrabold text-zinc-900 text-lg w-1/5 whitespace-nowrap">Teal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-5 font-bold text-zinc-700 whitespace-nowrap">{row.feature}</td>
                      <td className="p-5 font-medium text-zinc-400">{row.jobscan}</td>
                      <td className="p-5 font-bold text-blue-700 bg-blue-50/30 border-x border-blue-100">{row.cvo}</td>
                      <td className="p-5 font-medium text-zinc-600">{row.rezi}</td>
                      <td className="p-5 font-medium text-zinc-600">{row.teal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Deep Dive ── */}
        <section className="w-full bg-[#fbfcfd] py-24">
          <div className="container px-6 mx-auto max-w-4xl space-y-16">
            
            {/* CVO */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-200/60 p-8 md:p-10 rounded-[32px] shadow-lg shadow-blue-900/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full text-[11px] font-black tracking-widest uppercase mb-4 shadow-md shadow-blue-600/20 relative z-10">
                #1 Best Overall
              </div>
              <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-4 relative z-10">CVOptimizerAI</h3>
              <p className="text-zinc-700 font-medium leading-relaxed mb-6 relative z-10">
                Instead of simply telling you what keywords you are missing, CVOptimizerAI goes further: it tests your structural parsing and visually highlights parser-blocking errors. Best of all, it offers a one-click AI rewrite feature to fix those issues instantly. The core scanner is completely free.
              </p>
              <Link href="/free-ats-checker" className="relative z-10 inline-flex items-center text-blue-600 font-bold hover:underline">
                Try CVOptimizerAI Free <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Rezi */}
            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-[11px] font-black tracking-widest uppercase mb-4">
                #2 Best for Generating Text
              </div>
              <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-4">Rezi.ai</h3>
              <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                If you hate writing your own bullet points, Rezi is a great Jobscan alternative. It uses AI to generate content from scratch based on a target job title. While it lacks deep ATS structural analysis, its content generation is very strong.
              </p>
               <div className="space-y-3">
                  <h4 className="font-bold text-zinc-900">Best feature:</h4>
                  <p className="text-zinc-600 text-sm font-medium">Automatic bullet point writer based on GPT models.</p>
                </div>
            </div>

            {/* Teal */}
            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-[11px] font-black tracking-widest uppercase mb-4">
                #3 Best for Job Tracking
              </div>
              <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-4">Teal</h3>
              <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                Teal is a Chrome extension and job pipeline tracker that also includes a resume keyword matcher. It's a fantastic alternative to Jobscan if your primary goal is organizing your job hunt, although its resume tools are slightly less advanced than dedicated builders.
              </p>
               <div className="space-y-3">
                  <h4 className="font-bold text-zinc-900">Best feature:</h4>
                  <p className="text-zinc-600 text-sm font-medium">Visual Kanban board for tracking job applications.</p>
                </div>
            </div>
            
          </div>
        </section>
      </main>

      <BlogFeatures />
      <ComparisonFAQ faqs={faqs} />
      <RelatedComparisons currentPath="/jobscan-alternatives" />

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
