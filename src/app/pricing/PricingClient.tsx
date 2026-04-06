'use client';

import Link from 'next/link';
import { CheckCircle2, X, ArrowRight, Sparkles, ChevronDown, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import clsx from "clsx";

const faqs = [
  {
    q: "What's the difference between Starter & Professional?",
    a: "Starter is great for quickly building basic CVs if you only want to apply to a few jobs. Professional gives you our advanced GPT-4 AI, deep ATS gap analysis, unlimited keyword tailoring, and 12 premium templates — designed for active job seekers looking for the best results."
  },
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Yes! If you start on the Starter plan and realize you need more power, you can easily upgrade to Professional from your dashboard, and we'll prorate the cost."
  },
  {
    q: "What happens after my 14-day free trial?",
    a: "You'll keep all the CVs and data you created. However, your account will revert to the Free tier (1 CV limit, watermarked PDFs, basic AI) unless you choose to upgrade to one of our premium plans."
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "Yes. Our Lifetime plan comes with a 30-day money-back guarantee. If you're not getting more interviews, let us know and we'll refund you."
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. All uploaded CVs are encrypted at rest and in transit. We never sell or share your data with third parties. Our infrastructure is GDPR compliant."
  },
];

const comparisonFeatures = [
  { feature: "ATS Score", free: "3 Scans", starter: "10 Scans", pro: "Unlimited", lifetime: "Unlimited" },
  { feature: "AI CV Rewrite", free: "1 / once", starter: "Basic", pro: "Advanced (GPT-4)", lifetime: "Advanced (GPT-4)" },
  { feature: "Templates", free: "5 Basic", starter: "12 Templates", pro: "12 Premium", lifetime: "12 Premium" },
  { feature: "Keyword Scans", free: "3 / day", starter: "10 / day", pro: "Unlimited", lifetime: "Unlimited" },
  { feature: "PDF Export", free: "Watermarked", starter: "Clean", pro: "Clean", lifetime: "Clean" },
  { feature: "Shareable Links", free: false, starter: true, pro: true, lifetime: true },
  { feature: "Priority AI Queue", free: false, starter: false, pro: true, lifetime: true },
  { feature: "VIP Support", free: false, starter: false, pro: false, lifetime: true },
];

export default function PricingPageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const renderCell = (val: boolean | string) => {
    if (val === true) return <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto" />;
    if (val === false) return <X className="w-5 h-5 text-zinc-300 mx-auto" />;
    return <span className="text-zinc-700 font-semibold text-sm">{val}</span>;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 overflow-x-hidden selection:bg-blue-500/30">

      {/* ── Floating Navbar ── */}

      <main className="flex-1 pt-36 pb-24">
        <div className="container px-6 mx-auto max-w-6xl">

          {/* ── Hero ── */}
          <div className="text-center mb-16">
            <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">Pricing</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-5 tracking-tight">
              Simple, honest pricing.
            </h1>

            <div className="flex items-start gap-3 mt-6 mb-12 max-w-lg mx-auto text-left">
              <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
              </div>
              <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">
                <span className="text-zinc-900 font-bold">Simple, scalable pricing.</span> Start with a free ATS score or unlock full Professional features including GPT-4 AI rewrites and 12 premium templates for as low as $7.42/mo.
              </p>
            </div>

            <p className="text-lg text-zinc-500 font-medium max-w-xl mx-auto">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          {/* ── Trial banner ── */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white border border-blue-100 px-6 py-2.5 rounded-full shadow-sm shadow-blue-500/5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <p className="text-[14px] font-bold text-zinc-900">
                Risk-free 14-day trial <span className="text-zinc-500 font-medium ml-1">on all Professional features</span>
              </p>
              <div className="w-px h-4 bg-zinc-200 mx-1" />
              <Link href="/signup" className="text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Start now →
              </Link>
            </div>
          </div>

          {/* ── 3 Pricing Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch mb-24">
            
            {/* Starter */}
            <div className="bg-white rounded-3xl shadow-lg border border-zinc-200 p-8 flex flex-col hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-extrabold text-zinc-900">Starter 🚀</h3>
              <p className="text-sm text-zinc-500 font-medium mt-1 mb-6">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-zinc-900 leading-none">$24</span>
                <span className="text-zinc-500 font-bold">/month</span>
              </div>
              <Link href="/signup?plan=starter_monthly" className="w-full mb-8">
                <Button variant="outline" className="w-full h-12 rounded-full border-blue-200 text-blue-700 hover:bg-blue-50 font-bold">
                  Get Started
                </Button>
              </Link>
              <ul className="space-y-4 text-sm flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">Unlimited CVs & Letters</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">12 Premium Templates</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">10 Keyword scans / day</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">No Watermark on PDF</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">Branded Shareable Links</span></li>
              </ul>
            </div>

            {/* Professional */}
            <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)] border-2 border-blue-600 p-8 flex flex-col relative transform md:-translate-y-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[11px] font-extrabold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-lg select-none whitespace-nowrap">
                RECOMMENDED
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900">Professional ⭐</h3>
              <p className="text-sm text-zinc-500 font-medium mt-1 mb-4">Best for active job seekers</p>
              <div className="mb-2">
                <span className="text-4xl font-extrabold text-zinc-900 leading-none">$89</span>
                <span className="text-zinc-500 font-bold">/year</span>
              </div>
              <p className="text-[12px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded w-fit mb-6 uppercase tracking-tight">Only $7.42/mo — Save 69%</p>
              
              <Link href="/signup?plan=professional_yearly" className="w-full mb-8">
                <Button className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 font-bold">
                  Get Professional
                </Button>
              </Link>
              <ul className="space-y-4 text-sm flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-900 font-bold">Everything in Starter, plus:</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">12 Premium Templates</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">Deep ATS Gap Analysis</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">Unlimited Keyword Scans</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">No Watermark on Exports</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">Advanced GPT-4 AI</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">Branded Shareable Links</span></li>
              </ul>
            </div>

            {/* Lifetime */}
            <div className="bg-white rounded-3xl shadow-lg border border-purple-200 bg-gradient-to-b from-white to-purple-50/30 p-8 flex flex-col hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-100 text-purple-800 text-[10px] font-black tracking-widest px-3 py-1 rounded-bl-xl uppercase">
                BEST VALUE
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900">Lifetime 🏆</h3>
              <p className="text-sm text-zinc-500 font-medium mt-1 mb-6">Own it forever. Best ROI.</p>
              <div className="mb-6 flex flex-col">
                <div>
                  <span className="text-4xl font-extrabold text-zinc-900 leading-none">$139</span>
                  <span className="text-zinc-500 font-bold ml-1">once</span>
                </div>
              </div>
              <Link href="/signup?plan=lifetime_onetime" className="w-full mb-8">
                <Button variant="outline" className="w-full h-12 rounded-full border-purple-300 text-purple-700 hover:bg-purple-50 font-bold">
                  Get Lifetime Access
                </Button>
              </Link>
              <ul className="space-y-4 text-sm flex-1">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /><span className="text-zinc-900 font-bold">Everything in Professional</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /><span className="text-zinc-700 font-semibold">Pay once, use forever</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /><span className="text-zinc-700 font-semibold">AI Priority Queue (3x Faster)</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /><span className="text-zinc-700 font-semibold">VIP Support Response</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /><span className="text-zinc-700 font-semibold">Future Feature Access</span></li>
              </ul>
            </div>

          </div>

          {/* ── Free vs Pro Comparison Table ── */}
          <div className="max-w-5xl mx-auto mb-24">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-8 text-center">
              Compare all features
            </h2>
            <div className="overflow-x-auto rounded-[24px] border border-neutral-200 shadow-sm bg-white">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-neutral-200 text-[14px]">
                    <th className="p-4 font-bold text-zinc-600 w-[30%]">Feature</th>
                    <th className="p-4 font-extrabold text-zinc-900 text-center w-[17.5%]">Free</th>
                    <th className="p-4 font-extrabold text-zinc-900 text-center w-[17.5%]">Starter</th>
                    <th className="p-4 font-extrabold text-zinc-900 text-center w-[17.5%]">Professional</th>
                    <th className="p-4 font-extrabold text-zinc-900 text-center w-[17.5%]">Lifetime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-[14px]">
                  {comparisonFeatures.map((row) => (
                    <tr key={row.feature} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-4 font-bold text-zinc-700">{row.feature}</td>
                      <td className="p-4 text-center">{renderCell(row.free)}</td>
                      <td className="p-4 text-center">{renderCell(row.starter)}</td>
                      <td className="p-4 text-center">{renderCell(row.pro)}</td>
                      <td className="p-4 text-center">{renderCell(row.lifetime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="max-w-3xl mx-auto mb-24">
            <h2 className="text-3xl font-extrabold text-center mb-10 tracking-tight text-zinc-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border text-left border-zinc-200 rounded-2xl overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-zinc-900 outline-none"
                  >
                    <span className="pr-4">{faq.q}</span>
                    <ChevronDown className={clsx("w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300", openFaq === i && "rotate-180")} />
                  </button>
                  <div
                    className={clsx(
                      "px-6 text-zinc-600 font-medium leading-relaxed overflow-hidden transition-all duration-300",
                      openFaq === i ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Final CTA ── */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-6">
              Ready to land more interviews?
            </h2>
            <p className="text-lg text-zinc-500 font-medium mb-8 max-w-lg mx-auto">
              Get your ATS score in seconds and start optimizing your CV with AI.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white h-14 px-10 text-[15px] font-bold shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.03] active:scale-95">
                Start Your 14-Day Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="text-[13px] text-zinc-400 font-medium mt-4">
              No credit card required · Cancel anytime
            </p>
            <div className="flex items-center gap-2 mt-2 justify-center">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <p className="text-[12px] text-zinc-400 font-medium">
                Your data is encrypted and never shared with third parties
              </p>
            </div>
          </div>

        </div>
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
