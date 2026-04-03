'use client';

import { CheckCircle2, X, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";
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
  }
];

export function LandingPricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="pricing" className="w-full py-28 bg-[#fafafa] border-t border-zinc-100 relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-blue-50/50 to-transparent pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10 max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-5 tracking-tight">
            Simple, honest pricing.
          </h2>
          <p className="text-lg text-zinc-500 font-medium max-w-xl mx-auto">
            Experience the full power of CV Optimizer AI. Choose a plan that fits your career goals.
          </p>
        </div>

        {/* Re-designed, non-overwhelming but visible Trial Banner */}
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

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
          
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
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">5 Basic Templates</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="text-zinc-700 font-semibold">10 Keyword scans / day</span></li>
              <li className="flex items-start gap-3"><X className="w-5 h-5 text-zinc-400 shrink-0" /><span className="text-zinc-500">Basic AI (Standard)</span></li>
              <li className="flex items-start gap-3"><X className="w-5 h-5 text-zinc-400 shrink-0" /><span className="text-zinc-500">Watermark on PDF</span></li>
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

        {/* Compare Plans Link */}
        <div className="flex justify-center mt-12 mb-4">
          <Link href="/pricing">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[14px] font-bold shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-purple-300 group">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse duration-1000"></span>
              ✦ Compare plans in detail
              <ArrowRight className="h-4 w-4 text-purple-500 group-hover:text-purple-700 transition-colors group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-24">
          <h3 className="text-3xl font-extrabold text-center mb-10 tracking-tight text-zinc-900">Frequently Asked Questions</h3>
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

      </div>
    </section>
  );
}
