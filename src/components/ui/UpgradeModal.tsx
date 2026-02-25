"use client";

import { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

export function UpgradeModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-upgrade-modal', handleOpen);
        return () => window.removeEventListener('open-upgrade-modal', handleOpen);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                        <Sparkles className="w-8 h-8" />
                    </div>

                    <h2 className="text-2xl font-bold text-zinc-900 mb-3">
                        Upgrade to Pro
                    </h2>
                    <p className="text-zinc-600 mb-8">
                        Unlock premium themes, unlimited CV exports, and AI-powered writing assistance to land your dream job faster.
                    </p>

                    <div className="space-y-4 mb-8 text-left">
                        {[
                            "Unlimited CV creations",
                            "Access to all Premium Visual Themes",
                            "50 AI optimization requests per day",
                            "Remove 'Built with CV Optimizer' watermark",
                            "Export to DOCX format"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-zinc-700">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        onClick={() => {
                            // Redirect to polar checkout
                            window.location.href = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL!;
                        }}
                    >
                        Buy Now - $99 one-time
                    </button>
                </div>
            </div>
        </div>
    );
}
