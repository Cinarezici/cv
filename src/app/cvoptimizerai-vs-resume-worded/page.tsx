import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { BlogFeatures } from '@/components/blog/BlogFeatures';
import { ComparisonFAQ } from '@/components/ui/comparison-faq';
import { RelatedComparisons } from '@/components/ui/related-comparisons';

export const metadata: Metadata = {
  title: 'CVOptimizerAI vs Resume Worded (2025): Full Comparison',
  description:
    "Comparing CVOptimizerAI and Resume Worded? See features, pricing, and ATS accuracy side by side. Find the best resume checker for your job search.",
  openGraph: {
    title: 'CVOptimizerAI vs Resume Worded (2025): Full Comparison',
    description:
      "Comparing CVOptimizerAI and Resume Worded? See features, pricing, and ATS accuracy side by side. Find the best resume checker for your job search.",
    type: 'website',
    url: 'https://cvoptimizerai.com/cvoptimizerai-vs-resume-worded',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVOptimizerAI vs Resume Worded (2025): Full Comparison',
    description:
      "Comparing CVOptimizerAI and Resume Worded? See features, pricing, and ATS accuracy side by side. Find the best resume checker for your job search.",
  },
  alternates: { canonical: 'https://cvoptimizerai.com/cvoptimizerai-vs-resume-worded' },
};

const comparisonData = [
  { feature: 'Free Plan Availability', cvo: 'Yes (3 Scans/month)', rw: 'Limited (No longer truly free)' },
  { feature: 'ATS Score Accuracy', cvo: 'High (Simulates leading parsers)', rw: 'Moderate' },
  { feature: 'Keyword Analysis', cvo: 'Yes (Job Title & Skill match)', rw: 'Yes' },
  { feature: 'Resume Rewrite Suggestions', cvo: 'Yes (One-click AI Rewrite)', rw: 'Basic (Bullet point scoring)' },
  { feature: 'Price (Monthly)', cvo: '$24.00 / mo', rw: '$19.00 - $39.00 / mo' },
  { feature: 'Price (Annual)', cvo: '$89.00 / yr', rw: '$149.00 - $249.00 / yr' },
  { feature: 'Lifetime Plan', cvo: '$139.00 (One-time)', rw: 'None' },
  { feature: 'Speed of Analysis', cvo: '< 10 Seconds', rw: '30-60 Seconds' },
  { feature: 'AI-Powered Suggestions', cvo: 'Full Rewrite & Formatting', rw: 'Limited Line Edits' },
];

const faqs = [
  { q: "Is CVOptimizerAI better than Resume Worded?", a: "CVOptimizerAI is superior for actual ATS optimization and one-click AI rewriting. While Resume Worded provides good feedback on writing style, CVOptimizerAI focuses on the technical requirements needed to pass automated filters." },
  { q: "Which is cheaper, CVOptimizerAI or Resume Worded?", a: "CVOptimizerAI offers a more affordable annual plan and a lifetime access option, which Resume Worded currently lacks. Resume Worded's pricing has increased significantly in recent months." },
  { q: "Which has a better free plan?", a: "Resume Worded recently removed its true free tier, making it very restrictive. CVOptimizerAI allows for 3 full ATS analyses per month on the free plan with no sign-up required." }
];

export default function ResumeWordedVsCVOptimizerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 overflow-x-hidden selection:bg-blue-500/30">
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative w-full min-h-[550px] flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden bg-[#fafafa]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_80%,transparent_100%)] opacity-30 pointer-events-none" />
          
          <div className="container px-6 mx-auto max-w-4xl text-center relative z-20 mt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-[13px] font-semibold mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              2025 Industry Comparison
            </div>

            <h1 className="font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-6 text-5xl md:text-[64px]">
              CVOptimizerAI vs Resume Worded<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
                Which ATS Checker is Better in 2025?
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight mb-10 max-w-3xl mx-auto">
              Resume Worded has been a staple in the industry, but with recent pricing hikes and the removal of their free plan, job seekers are looking for better alternatives. We compare features, accuracy, and value.
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
                    <th className="p-5 font-extrabold text-blue-600 text-lg w-1/4 bg-blue-50/30">CVOptimizerAI</th>
                    <th className="p-5 font-extrabold text-zinc-900 text-lg w-1/4">Resume Worded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-5 font-bold text-zinc-700">{row.feature}</td>
                      <td className="p-5 font-bold text-blue-700 bg-blue-50/30">{row.cvo}</td>
                      <td className="p-5 font-medium text-zinc-600">{row.rw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Detailed Breakdown ── */}
        <section className="w-full bg-[#fbfcfd] py-24">
          <div className="container px-6 mx-auto max-w-4xl space-y-16">
            
            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-6">Why CVOptimizerAI Wins</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-zinc-600 font-medium"><strong>One-Click AI Rewrite:</strong> CVOptimizerAI doesn't just tell you what's wrong; it fixes it. Our AI can completely rewrite your resume to match a specific job description in seconds.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-zinc-600 font-medium"><strong>Superior Value:</strong> With a Lifetime access option for $139, CVOptimizerAI is significantly more cost-effective than Resume Worded's subscription model for long-term job seekers.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-zinc-600 font-medium"><strong>No Sign-up Required for Scoring:</strong> Get your ATS score instantly without handing over your email address first. We prioritize speed and low friction.</p>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <h3 className="text-xl font-extrabold tracking-tight text-zinc-900 mb-4">Who should choose Resume Worded?</h3>
              <p className="text-zinc-600 font-medium leading-relaxed">
                Resume Worded is a good choice for those who are highly focused on academic-style writing metrics and want deep line-by-line feedback on specific bullet point language rather than a full structural optimization.
              </p>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="w-full bg-[#fafafa] py-24">
          <div className="container px-6 mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold mb-8">Ready to beat the ATS?</h2>
            <Link href="/signup">
              <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 text-[16px] font-bold shadow-xl transition-all hover:scale-[1.03]">
                Try CVOptimizerAI Free — No Credit Card Required <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <BlogFeatures />
      <ComparisonFAQ faqs={faqs} />
      <RelatedComparisons currentPath="/cvoptimizerai-vs-resume-worded" />

      {/* ── Footer ── */}
      <footer className="py-20 px-6 border-t border-zinc-100 bg-[#fafafa]">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
            <Link className="flex items-center gap-2" href="/">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
                    <Zap className="h-4 w-4 text-white fill-white" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-zinc-900">CV Optimizer AI</span>
            </Link>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">© {new Date().getFullYear()} CV Optimizer AI</p>
        </div>
      </footer>
    </div>
  );
}
