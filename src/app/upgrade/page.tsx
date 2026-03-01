"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, X, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function UpgradePage() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);

        const url = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL;
        if (!url) {
            console.error("Missing NEXT_PUBLIC_POLAR_CHECKOUT_URL");
            toast.error("Payment link is not configured. Please contact support.");
            setLoading(false);
            return;
        }

        window.location.assign(url);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-blue-50/50 dark:from-blue-950/20 to-transparent pointer-events-none" />

            <div className="container px-6 mx-auto text-center relative z-10 max-w-5xl py-4 md:py-8">

                {/* Back link */}
                <div className="flex justify-start mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Compact header */}
                <div className="mb-8 text-center">
                    <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-2">Pricing</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                        Simple, transparent pricing.
                    </h1>
                </div>

                {/* Plan Cards */}
                <div className="flex flex-col md:flex-row gap-6 mx-auto mb-10 items-stretch justify-center">

                    {/* Trial Plan */}
                    <div className="flex-1 max-w-[400px] w-full bg-white dark:bg-zinc-900 rounded-[32px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-none p-6 md:p-8 flex flex-col border border-zinc-200 dark:border-white/8 hover:shadow-xl dark:hover:border-white/12 transition-all text-left">
                        <div className="mb-4">
                            <h3 className="text-[28px] font-extrabold text-black dark:text-white leading-tight tracking-tight">14-Day Trial</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-[14px] mt-1 font-medium">Try everything free. No credit card.</p>
                        </div>
                        <div className="flex items-baseline gap-1.5 mb-6">
                            <span className="text-[48px] font-extrabold tracking-tighter text-zinc-900 dark:text-white leading-none">$0</span>
                            <span className="text-zinc-500 dark:text-zinc-400 text-[14px] font-bold">/ 14 days</span>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {[
                                { text: "2 CVs", included: true },
                                { text: "4 Custom Cover Letters", included: true },
                                { text: "2 LinkedIn Job Searches / day", included: true },
                                { text: "Shareable links → cvoptimizerai.com after trial", included: true },
                                { text: "Branded shareable links", included: false },
                                { text: "Unlimited everything", included: false },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-[14px]">
                                    {item.included ? (
                                        <CheckCircle2 className="w-[20px] h-[20px] text-[#2563eb] shrink-0 mt-[2px]" strokeWidth={2.5} />
                                    ) : (
                                        <X className="w-[20px] h-[20px] text-zinc-300 dark:text-zinc-600 shrink-0 mt-[2px]" strokeWidth={2.5} />
                                    )}
                                    <span className={item.included ? "text-zinc-700 dark:text-zinc-300 font-bold" : "text-zinc-400 dark:text-zinc-500 font-medium"}>{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/dashboard" className="w-full">
                            <Button
                                variant="outline"
                                className="w-full h-14 rounded-full border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 font-bold text-[15px] hover:bg-zinc-50 dark:hover:bg-white/5 hover:border-zinc-300 dark:hover:border-white/20 transition-all shadow-sm"
                            >
                                Continue with Trial
                            </Button>
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="flex-1 max-w-[400px] w-full relative bg-white dark:bg-zinc-900 rounded-[32px] shadow-[0_12px_40px_-4px_rgba(37,99,235,0.15)] dark:shadow-[0_12px_40px_-4px_rgba(37,99,235,0.08)] border-[2.5px] border-[#2563eb] p-6 md:p-8 flex flex-col hover:scale-[1.02] transition-transform text-left">
                        {/* Most Popular badge */}
                        <div className="absolute top-0 right-10 -translate-y-1/2 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white text-[11px] font-extrabold tracking-wider px-4 py-1.5 rounded-full uppercase shadow-lg shadow-blue-600/20 z-20">
                            Most Popular
                        </div>

                        <div className="mb-4">
                            <h3 className="text-[28px] font-extrabold text-black dark:text-white leading-tight tracking-tight">Pro Plan</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-[14px] mt-1 font-medium">One-time payment. 3 years of access.</p>
                        </div>

                        <div className="flex flex-col mb-6">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-[48px] font-extrabold tracking-tighter text-zinc-900 dark:text-white leading-none">$99</span>
                                <span className="text-zinc-600 dark:text-zinc-400 text-[14px] font-bold">one-time · 3 years</span>
                            </div>
                            <p className="text-[10px] text-[#2563eb] font-black mt-2 uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 w-fit px-2.5 py-1 rounded-md">
                                ≈ $2.75 / month for 3 years
                            </p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {[
                                "Unlimited CVs",
                                "Unlimited Cover Letters",
                                "Unlimited Job Searches",
                                "Your own branded shareable letter links",
                                "Advanced AI Optimization",
                                "No Watermark PDF Exports",
                                "LinkedIn Integration",
                                "Premium Templates",
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-[14px]">
                                    <CheckCircle2 className="w-[20px] h-[20px] text-[#2563eb] shrink-0 mt-[2px]" strokeWidth={2.5} />
                                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full h-14 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold text-[15px] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                            ) : (
                                <>Upgrade to Pro <ArrowRight className="h-4 w-4" /></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Trust logos */}
                <div className="flex flex-col items-center gap-6 pb-4">
                    <p className="text-zinc-400 dark:text-zinc-500 text-sm font-bold tracking-tight uppercase">Trusted by candidates hired at</p>
                    <div className="flex items-center justify-center gap-8 md:gap-16 opacity-30 grayscale pointer-events-none flex-wrap">
                        <p className="font-extrabold text-2xl tracking-tighter">Google</p>
                        <p className="font-extrabold text-2xl tracking-tighter">Microsoft</p>
                        <p className="font-extrabold text-2xl tracking-tighter">Meta</p>
                        <p className="font-extrabold text-2xl tracking-tighter">Amazon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
