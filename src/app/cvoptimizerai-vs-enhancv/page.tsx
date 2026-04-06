import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { BlogFeatures } from '@/components/blog/BlogFeatures';
import { ComparisonFAQ } from '@/components/ui/comparison-faq';
import { RelatedComparisons } from '@/components/ui/related-comparisons';

export const metadata: Metadata = {
  title: 'CVOptimizerAI vs Enhancv 2026: Design vs ATS Optimization? | CVOptimizerAI',
  description: "Comparing CVOptimizerAI and Enhancv? We compare features, pricing, and ATS accuracy. See why design-heavy resumes often fail filters.",
  alternates: { canonical: 'https://cvoptimizerai.com/cvoptimizerai-vs-enhancv' },
  openGraph: {
    title: 'CVOptimizerAI vs Enhancv 2026: Design vs ATS Optimization?',
    description: "Comparing CVOptimizerAI and Enhancv? We compare features, pricing, and ATS accuracy. See why design-heavy resumes often fail filters.",
    type: 'website',
    url: 'https://cvoptimizerai.com/cvoptimizerai-vs-enhancv',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVOptimizerAI vs Enhancv 2026: Design vs ATS Optimization?',
    description: "Comparing CVOptimizerAI and Enhancv? See features, pricing, and ATS accuracy.",
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
      "name": "CVOptimizerAI vs Enhancv",
      "item": "https://cvoptimizerai.com/cvoptimizerai-vs-enhancv"
    }
  ]
};

const comparisonData = [
  { feature: 'Primary Focus', cvo: 'ATS Optimization & AI Writing', enhancv: 'Design & Templates' },
  { feature: 'Free Plan Availability', cvo: 'Yes (3 Scans/month)', enhancv: 'Limited (1 free resume)' },
  { feature: 'ATS Score Accuracy', cvo: 'High (Simulates leading parsers)', enhancv: 'Low (Often blocks ATS)' },
  { feature: 'Keyword Analysis', cvo: 'Yes (Comprehensive)', enhancv: 'Basic' },
  { feature: 'Price (Monthly)', cvo: '$24.00 / mo', enhancv: '$20.00 - $25.00 / mo' },
  { feature: 'Lifetime Plan', cvo: '$139.00 (One-time)', enhancv: 'None' },
  { feature: 'AI-Powered Suggestions', cvo: 'One-click AI Rewrite', enhancv: 'Moderate suggestions' },
  { feature: 'Template Count', cvo: '12 (All ATS-safe)', enhancv: '100+ (Mostly creative)' },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is CVOptimizerAI better than Enhancv?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If your goal is to pass Applicant Tracking Systems (ATS), CVOptimizerAI is significantly better. Enhancv focuses on visual design, which can often contain formatting that confuses ATS parsers."
      }
    },
    {
      "@type": "Question",
      "name": "Which has a better free plan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CVOptimizerAI allows for full ATS scans without sign-up, whereas Enhancv's free tier is limited to building a single document within their platform."
      }
    }
  ]
};

export default function EnhancvVsCVOptimizerPage() {
  const faqs = [
    { q: "Is CVOptimizerAI better than Enhancv?", a: "If your goal is to pass Applicant Tracking Systems (ATS), CVOptimizerAI is significantly better. Enhancv focuses on visual design, which can often contain formatting that confuses ATS parsers." },
    { q: "Which is cheaper, CVOptimizerAI or Enhancv?", a: "While the monthly prices are similar, CVOptimizerAI's lifetime option offers much better value for long-term job seekers." },
    { q: "Which has a better free plan?", a: "CVOptimizerAI allows for 3 full scans per month without sign-up, whereas Enhancv's free tier is limited to building a single document within their platform." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 overflow-x-hidden selection:bg-blue-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
              CVOptimizerAI vs Enhancv<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
                Which Tool Is Better?
              </span>
            </h1>

            <div className="flex items-start gap-3 mt-6 mb-12 max-w-xl mx-auto text-left">
              <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
              </div>
              <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">
                <span className="text-zinc-900 font-bold">Optimization vs Design.</span> Enhancv focuses on visual aesthetics, while CVOptimizerAI prioritizes ATS readability and AI content rewriting, delivering 40% higher parsing accuracy for modern automated hiring systems.
              </p>
            </div>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight mb-10 max-w-3xl mx-auto">
              Enhancv is widely loved for its beautiful, modern designs. But as hiring becomes more automated, those same designs can cause your resume to be rejected by ATS filters. We breakdown the differences between design-first and optimization-first platforms.
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
                    <th className="p-5 font-extrabold text-zinc-900 text-lg w-1/4">Enhancv</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-5 font-bold text-zinc-700">{row.feature}</td>
                      <td className="p-5 font-bold text-blue-700 bg-blue-50/30">{row.cvo}</td>
                      <td className="p-5 font-medium text-zinc-600">{row.enhancv}</td>
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
                  <p className="text-zinc-600 font-medium"><strong>Built for the Algorithm:</strong> Unlike Enhancv's multi-column layouts, CVOptimizerAI templates are stress-tested against all major ATS parsers (Workday, Greenhouse, Taleo) to ensure 100% readability.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-zinc-600 font-medium"><strong>One-Click AI Rewrite:</strong> CVOptimizerAI automatically injects missing keywords and optimizes your bullet points without you having to manually edit every word.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-zinc-600 font-medium"><strong>Speed:</strong> Analyze any resume in under 10 seconds. No long wizard or profile setup required.</p>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <h3 className="text-xl font-extrabold tracking-tight text-zinc-900 mb-4">Who should choose Enhancv?</h3>
              <p className="text-zinc-600 font-medium leading-relaxed">
                Enhancv is a good choice for creative roles where you are handing your resume directly to a human hiring manager (e.g., in a physical interview or direct email) and want a highly designed, visual aesthetic that stands out.
              </p>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="w-full bg-[#fafafa] py-24">
          <div className="container px-6 mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold mb-8">Ready to get more interviews?</h2>
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
      <RelatedComparisons currentPath="/cvoptimizerai-vs-enhancv" />

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
