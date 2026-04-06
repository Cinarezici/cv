import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { BlogFeatures } from '@/components/blog/BlogFeatures';
import { ComparisonFAQ } from '@/components/ui/comparison-faq';
import { RelatedComparisons } from '@/components/ui/related-comparisons';

export const metadata: Metadata = {
  title: 'Rezi vs Teal 2026: Which AI Resume Tool Is Better? | CVOptimizerAI',
  description: "Head-to-head: ATS scanning, AI rewrite quality, pricing, ease of use. Plus the free alternative that beats both.",
  alternates: { canonical: 'https://cvoptimizerai.com/rezi-vs-teal' },
  openGraph: {
    title: 'Rezi vs Teal 2026: Which AI Resume Tool Is Better?',
    description: "Head-to-head: ATS scanning, AI rewrite quality, pricing, ease of use. Plus the free alternative that beats both.",
    type: 'website',
    url: 'https://cvoptimizerai.com/rezi-vs-teal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rezi vs Teal 2026: Which AI Resume Tool Is Better?',
    description: "Head-to-head: ATS scanning, AI rewrite quality, pricing, ease of use.",
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
      "name": "Rezi vs Teal",
      "item": "https://cvoptimizerai.com/rezi-vs-teal"
    }
  ]
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Rezi vs Teal (2026): Which AI Resume Builder Is Worth Using?",
  "description": "Both Rezi and Teal are popular AI resume tools — but they serve very different needs. Here's a full feature-by-feature breakdown, plus the free option that beats both on ATS scoring.",
  "numberOfItems": 3,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "CVOptimizerAI",
      "url": "https://cvoptimizerai.com",
      "description": "Free ATS resume checker with one-click AI rewrite. No sign-up required."
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Rezi",
      "url": "https://rezi.ai",
      "description": "AI resume builder tailored specifically for writing your bullet points using GPT models."
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Teal",
      "url": "https://tealhq.com",
      "description": "Job application tracking system with a built-in Chrome extension and resume keyword highlighting."
    }
  ]
};

const comparisonData = [
  { feature: 'Primary Focus', rezi: 'AI Resume Writing', teal: 'Job Application Tracker', cvo: 'ATS Scoring & AI Rewrite' },
  { feature: 'ATS Analysis', rezi: 'Basic Keyword Check', teal: 'Yes (Job Description Match)', cvo: 'Deep Parser & Formatting Check' },
  { feature: 'AI Content Generation', rezi: 'Excellent', teal: 'Good', cvo: 'Exceptional (Role-Targeted)' },
  { feature: 'Pricing (Monthly)', rezi: '$29.00 / mo', teal: '$29.00 / mo', cvo: 'Free Tools + Pro Options' },
  { feature: 'Ease of Use', rezi: 'Moderate (Form-heavy)', teal: 'Moderate (Too many features)', cvo: 'High (Upload & Fix in 1 click)' },
];

const faqs = [
  { q: "Is Rezi better than Teal?", a: "Rezi is better for AI resume generation and creating bullet points from scratch. Teal is better for tracking your job application pipeline across various stages." },
  { q: "Do these tools check for ATS compatibility?", a: "Yes, but they approach it differently. Rezi focuses on keyword matching against a job description. CVOptimizerAI does a deep visual formatting and parsing check alongside keyword analysis." },
  { q: "Is there a free alternative to Rezi and Teal?", a: "CVOptimizerAI offers a free ATS checker and resume scoring tool that analyzes your resume against industry parser standards with no sign-up required." }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
};

export default function ReziVsTealPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 overflow-x-hidden selection:bg-blue-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
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
              Rezi vs Teal<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
                Which Tool Is Better?
              </span>
            </h1>

            <div className="flex items-start gap-3 mt-6 mb-12 max-w-xl mx-auto text-left">
              <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
              </div>
              <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">
                <span className="text-zinc-900 font-bold">2026 Comparison Guide.</span> While Rezi excels at AI writing and Teal leads in job tracking, CVOptimizerAI provides a unified, free ATS structural validator and keyword optimizer to bridge the gap between building and applying.
              </p>
            </div>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight mb-10 max-w-3xl mx-auto">
              If you’re applying for jobs in 2026, you need a resume optimizer. Rezi and Teal are two of the biggest names. But which one actually helps you beat Applicant Tracking Systems (ATS)? We break down the features, pricing, and the better alternative.
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
                    <th className="p-5 font-extrabold text-zinc-900 text-lg w-1/4">Rezi</th>
                    <th className="p-5 font-extrabold text-zinc-900 text-lg w-1/4">Teal</th>
                    <th className="p-5 font-extrabold text-blue-600 text-lg w-1/4 bg-blue-50/30">CVOptimizerAI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-5 font-bold text-zinc-700">{row.feature}</td>
                      <td className="p-5 font-medium text-zinc-600">{row.rezi}</td>
                      <td className="p-5 font-medium text-zinc-600">{row.teal}</td>
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
            
            {/* Rezi */}
            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-4">Rezi Overview</h3>
              <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                Rezi made its name by focusing strictly on AI resume generation. It uses OpenAI models to auto-write bullets based on standard job titles and provides a checklist of missing keywords to ensure you pass basic filters.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-emerald-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Pros
                  </h4>
                  <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Excellent AI writer generation.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Good baseline formatting templates.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Easy cover letter generation.</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-red-600 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Cons
                  </h4>
                  <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Form-heavy UI feels dated in 2026.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Lacks deep visual structural scanning.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Very expensive lifetime plan tier.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Teal */}
            <div className="bg-white p-8 md:p-10 rounded-[24px] border border-neutral-200 shadow-sm">
              <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-4">Teal Overview</h3>
              <p className="text-zinc-600 font-medium leading-relaxed mb-6">
                Teal is fundamentally a job tracking application that added a resume builder onto its platform. It lets you save jobs from LinkedIn using a Chrome extension, and highlights which keywords in the job description are missing from your loaded resume.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-emerald-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Pros
                  </h4>
                  <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Superb job tracker pipeline board.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Great Chrome extension for LinkedIn.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Clear visual keyword highlighting.</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-red-600 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Cons
                  </h4>
                  <ul className="space-y-2 text-zinc-600 text-sm font-medium">
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> ATS scanner does not check structural formatting.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> Too many tabs and features can cause friction.</li>
                    <li className="flex gap-2 items-start"><ChevronRight className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0"/> The resume builder feels like an afterthought.</li>
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
              If you solely want to <strong>track applications across a pipeline</strong>, Teal is excellent. If you just want an <strong>AI to auto-type bullet points</strong> for you, Rezi is a solid choice.
            </p>
            <p className="text-lg text-zinc-900 font-bold leading-relaxed mb-12">
              But if your goal is to bypass ATS filters, get a measurable score, and instantly rewrite your CV for a specific job... you need a purpose-built ATS scanner.
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
      <RelatedComparisons currentPath="/rezi-vs-teal" />

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
