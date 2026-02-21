"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function UpgradePage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCheckout = () => {
        setLoading(true);
        // Placeholder for future integration
        setTimeout(() => {
            toast.info("Connecting to secure payment gateway...", {
                description: "Payment integration is currently being set up. Please try again later."
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 text-zinc-900 font-sans">
            <div className="max-w-md w-full flex flex-col items-center">

                {/* Header Section */}
                <div className="text-center mb-10 space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Upgrade to Pro
                    </h1>
                    <p className="text-[17px] text-zinc-500 max-w-sm mx-auto">
                        Unlock unlimited job optimizations and keep your CV links active forever.
                    </p>
                </div>

                {/* Pricing Card */}
                <div className="relative w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200 p-8 pb-10 overflow-hidden">

                    {/* Popular Badge */}
                    <div className="absolute top-0 right-0 bg-[#1a1a1a] text-white text-[11px] font-bold tracking-wider px-4 py-1.5 rounded-bl-xl">
                        POPULAR
                    </div>

                    {/* Card Content */}
                    <div className="mt-2">
                        <h2 className="text-2xl font-bold">Annual Pro</h2>
                        <p className="text-sm text-zinc-500 mt-1.5 font-medium">Everything you need to land your dream job</p>
                    </div>

                    <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-5xl font-extrabold tracking-tight">$99</span>
                        <span className="text-zinc-500 font-medium text-lg">/year</span>
                    </div>

                    <div className="mt-8 space-y-4">
                        {[
                            "Unlimited CV Generations",
                            "Unlimited Job Optimizations",
                            "Permanent Active Public Links",
                            "Priority AI Processing",
                            "Premium Templates (Coming Soon)",
                            "Email Support"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-emerald-500 shrink-0" strokeWidth={2.5} />
                                <span className="text-zinc-700 font-medium text-[15px]">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="mt-10 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : "Upgrade Now"}
                    </button>
                </div>

                {/* Footer Link */}
                <div className="mt-10">
                    <Link href="/dashboard" className="text-[15px] font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
