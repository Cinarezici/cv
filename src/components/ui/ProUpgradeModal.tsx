"use client";

import { useRouter } from "next/navigation";
import { X, Lock, CheckCircle2, ArrowRight } from "lucide-react";

interface ProUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateName?: string;
}

export function ProUpgradeModal({ isOpen, onClose, templateName }: ProUpgradeModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleUpgrade = () => {
        router.push("/upgrade");
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-blue-500/20 rounded-2xl shadow-2xl shadow-blue-900/20 overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-400" />

                {/* Content */}
                <div className="p-6">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Icon */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-5">
                        <Lock className="w-5 h-5 text-blue-400" />
                    </div>

                    {/* Heading */}
                    <h2 className="text-[18px] font-extrabold text-white tracking-tight mb-1">
                        Pro Template Only
                    </h2>
                    <p className="text-[13px] text-zinc-400 font-medium mb-5 leading-relaxed">
                        <span className="text-blue-400 font-bold">{templateName || "This template"}</span> is part of the Pro Plan.
                        Upgrade to unlock editing, saving, and exporting.
                    </p>

                    {/* Feature list */}
                    <ul className="space-y-2.5 mb-6">
                        {[
                            "Unlimited CVs & Cover Letters",
                            "No Watermark PDF Exports",
                            "All 10 Premium Templates",
                            "Your own branded shareable links",
                            "Advanced AI Optimization",
                        ].map((feat) => (
                            <li key={feat} className="flex items-center gap-2.5 text-[13px] text-zinc-300 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" strokeWidth={2.5} />
                                {feat}
                            </li>
                        ))}
                    </ul>

                    {/* Price note */}
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-500/8 border border-blue-500/20 rounded-xl mb-5">
                        <span className="text-[22px] font-black text-white tracking-tight">$2.75</span>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">/ month</span>
                            <span className="text-[10px] text-zinc-500 font-medium">Billed as $99 one-time · 3 years access</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <button
                        onClick={handleUpgrade}
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-900/40 mb-3"
                    >
                        Upgrade to Pro <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full h-10 rounded-xl text-zinc-500 hover:text-zinc-300 font-bold text-[13px] transition-colors hover:bg-white/5"
                    >
                        Continue with free template
                    </button>
                </div>
            </div>
        </div>
    );
}
