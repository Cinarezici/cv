"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function UpgradePage() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-zinc-900 font-sans">
            <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">Upgrade your Plan</h1>
            </div>

            {/* Two-column plan cards */}
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-[800px] items-stretch">

                {/* ── Free Plan ───────────────────────────────────────── */}
                <div className="flex-1 bg-white rounded-[20px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-8 flex flex-col min-w-[320px]">
                    <div className="mb-4">
                        <h2 className="text-[26px] font-semibold text-black leading-tight">Free</h2>
                        <p className="text-zinc-500 text-[15px] mt-1">Perfect for testing the platform.</p>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-6">
                        <span className="text-[40px] font-bold tracking-tight text-black leading-none">$0</span>
                        <span className="text-zinc-500 text-[15px] font-medium">/forever</span>
                    </div>

                    <ul className="space-y-[14px] flex-1">
                        {[
                            { text: "2 CVs (Resets every 14 days)", included: true },
                            { text: "2 Cover Letters (Resets every 14 days)", included: true },
                            { text: "2 Daily Job Searches", included: true },
                            { text: "PDF Export (Watermarked)", included: true },
                            { text: "Unlimited History (Items Lock)", included: false },
                            { text: "No Watermark", included: false },
                            { text: "Advanced AI Optimization", included: false },
                            { text: "LinkedIn Analysis", included: false },
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-[14px]">
                                {item.included ? (
                                    <Check className="w-[18px] h-[18px] text-[#16a34a] shrink-0 mt-[2px]" strokeWidth={2.5} />
                                ) : (
                                    <X className="w-[18px] h-[18px] text-zinc-300 shrink-0 mt-[2px]" strokeWidth={2.5} />
                                )}
                                <span className={item.included ? "text-zinc-700" : "text-zinc-400"}>{item.text}</span>
                            </li>
                        ))}
                    </ul>

                    <Link
                        href="/dashboard"
                        className="mt-8 w-full flex items-center justify-center py-3.5 rounded-[12px] border border-zinc-200 text-black font-semibold text-[15px] hover:bg-zinc-50 transition-colors"
                    >
                        Start for Free
                    </Link>
                </div>

                {/* ── Pro Plan (One-time) ───────────────────────────────── */}
                <div className="flex-1 relative bg-white rounded-[20px] shadow-[0_8px_30px_-4px_rgba(37,99,235,0.15)] border-2 border-[#2563eb] p-8 flex flex-col min-w-[320px]">
                    {/* Best Value badge */}
                    <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:-translate-y-0 md:top-4 md:right-4 bg-[#2563eb] text-white text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full uppercase">
                        BEST VALUE
                    </div>

                    <div className="mb-4 mt-2">
                        <h2 className="text-[26px] font-semibold text-black leading-tight">Pro Plan (Lifetime)</h2>
                        <p className="text-zinc-500 text-[15px] mt-1">Single payment for unlimited access.</p>
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-6">
                        <span className="text-[40px] font-bold tracking-tight text-black leading-none">$99</span>
                        <span className="text-zinc-600 text-[15px] font-medium">one-time</span>
                    </div>

                    <ul className="space-y-[14px] flex-1">
                        {[
                            "Unlimited CVs & Cover Letters",
                            "Unlimited Job Searches",
                            "No Watermark",
                            "Access to All History (No Locking)",
                            "Advanced AI Optimization",
                            "LinkedIn Analysis & Integration",
                            "PDF & Word Export",
                        ].map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 text-[14px]">
                                <Check className="w-[18px] h-[18px] text-[#16a34a] shrink-0 mt-[2px]" strokeWidth={2.5} />
                                <span className="text-zinc-800">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={loading}
                        className="mt-8 w-full flex items-center justify-center py-3.5 rounded-[12px] bg-[#1a1a1a] hover:bg-black text-white font-semibold text-[15px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</> : "Buy Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}
