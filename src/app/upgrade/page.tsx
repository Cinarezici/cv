"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, X, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function UpgradePage() {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleCheckout = async (planId: string) => {
        setLoadingPlan(planId);

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId })
            });
            const data = await res.json();

            if (data.url) {
                window.location.assign(data.url);
            } else {
                toast.error(data.error || "Failed to start checkout");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 relative overflow-hidden pb-20">
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-blue-50/50 dark:from-blue-950/20 to-transparent pointer-events-none" />

            <div className="container px-6 mx-auto text-center relative z-10 max-w-5xl py-4 md:py-8">
                <div className="flex justify-start mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="mb-12 text-center">
                    <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-2">Upgrade Account</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                        Choose your career power-up.
                    </h1>
                </div>

                {/* 3 Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch text-left">
                  
                  {/* Starter */}
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-200 dark:border-white/10 p-8 flex flex-col hover:shadow-xl transition-shadow">
                    <h3 className="text-xl font-extrabold">Starter 🚀</h3>
                    <p className="text-sm text-zinc-500 mt-1 mb-6">Perfect for getting started</p>
                    <div className="mb-6">
                      <span className="text-4xl font-extrabold leading-none">$24</span>
                      <span className="text-zinc-500 font-bold">/month</span>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={() => handleCheckout('starter_monthly')}
                        disabled={loadingPlan !== null}
                        className="w-full h-12 rounded-full border-blue-200 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-bold mb-8"
                    >
                      {loadingPlan === 'starter_monthly' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Started"}
                    </Button>
                    <ul className="space-y-4 text-sm flex-1">
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="font-semibold">Unlimited CVs & Letters</span></li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="font-semibold">5 Basic Templates</span></li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="font-semibold">10 Keyword scans / day</span></li>
                    </ul>
                  </div>

                  {/* Professional */}
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)] border-2 border-blue-600 p-8 flex flex-col relative transform md:-translate-y-4">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[11px] font-extrabold tracking-widest px-4 py-1.5 rounded-full uppercase shadow-lg select-none whitespace-nowrap">
                      RECOMMENDED
                    </div>
                    <h3 className="text-xl font-extrabold">Professional ⭐</h3>
                    <p className="text-sm text-zinc-500 mt-1 mb-4">Best for active job seekers</p>
                    <div className="mb-2">
                      <span className="text-4xl font-extrabold leading-none">$89</span>
                      <span className="text-zinc-500 font-bold">/year</span>
                    </div>
                    <p className="text-[12px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded w-fit mb-6 uppercase tracking-tight">Only $7.42/mo — Save 69%</p>
                    
                    <Button 
                        onClick={() => handleCheckout('professional_yearly')}
                        disabled={loadingPlan !== null}
                        className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 font-bold mb-8"
                    >
                      {loadingPlan === 'professional_yearly' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Professional"}
                    </Button>
                    <ul className="space-y-4 text-sm flex-1">
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="font-bold">Everything in Starter, plus:</span></li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="font-semibold">12 Premium Templates</span></li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="font-semibold">Deep ATS Gap Analysis</span></li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="font-semibold">No Watermark on Exports</span></li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /><span className="font-semibold">Advanced GPT-4 AI</span></li>
                    </ul>
                  </div>

                  {/* Lifetime */}
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-purple-200 dark:border-purple-900 p-8 flex flex-col hover:shadow-xl transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-[10px] font-black tracking-widest px-3 py-1 rounded-bl-xl uppercase">
                      BEST VALUE
                    </div>
                    <h3 className="text-xl font-extrabold">Lifetime 🏆</h3>
                    <p className="text-sm text-zinc-500 mt-1 mb-6">Own it forever. Best ROI.</p>
                    <div className="mb-6 flex flex-col">
                      <div>
                        <span className="text-4xl font-extrabold leading-none">$139</span>
                        <span className="text-zinc-500 font-bold ml-1">once</span>
                      </div>
                    </div>
                    <Button 
                        variant="outline"
                        onClick={() => handleCheckout('lifetime_onetime')}
                        disabled={loadingPlan !== null}
                        className="w-full h-12 rounded-full border-purple-300 text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-bold mb-8"
                    >
                      {loadingPlan === 'lifetime_onetime' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Lifetime Access"}
                    </Button>
                    <ul className="space-y-4 text-sm flex-1">
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /><span className="font-bold">Everything in Professional</span></li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /><span className="font-semibold">Pay once, use forever</span></li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /><span className="font-semibold">AI Priority Queue</span></li>
                    </ul>
                  </div>
                  
                </div>

            </div>
        </div>
    );
}
