'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lock, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export type UpgradeReason = 
    | 'cv_limit' 
    | 'letter_limit' 
    | 'watermark' 
    | 'advanced_ai' 
    | 'linkedin_tailor' 
    | 'keyword_limit'
    | 'branded_link'
    | 'generic';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    reason?: UpgradeReason;
}

const reasonContent: Record<UpgradeReason, { title: string, desc: string, icon: React.ReactNode }> = {
    cv_limit: {
        title: "CV Limit Reached",
        desc: "You've hit your limit for creating CVs on your current plan. Upgrade to unlock unlimited CV creation.",
        icon: <Lock className="w-12 h-12 text-blue-500 mb-4" />
    },
    letter_limit: {
        title: "Cover Letter Limit Reached",
        desc: "Upgrade to Starter or Pro to generate unlimited, tailored cover letters.",
        icon: <Lock className="w-12 h-12 text-blue-500 mb-4" />
    },
    watermark: {
        title: "Remove Watermark",
        desc: "Upgrade to Professional to export clean, watermark-free PDFs.",
        icon: <Sparkles className="w-12 h-12 text-blue-500 mb-4" />
    },
    advanced_ai: {
        title: "Unlock Advanced AI",
        desc: "Professional users get access to our GPT-4 powered AI for superior optimization.",
        icon: <Sparkles className="w-12 h-12 text-amber-500 mb-4" />
    },
    linkedin_tailor: {
        title: "Unlock LinkedIn Tailoring",
        desc: "Automatically tailor your CV directly from a LinkedIn job post with Professional.",
        icon: <Sparkles className="w-12 h-12 text-blue-500 mb-4" />
    },
    keyword_limit: {
        title: "Daily Keyword Limit Reached",
        desc: "You've used all your keyword scans for today. Upgrade for unlimited scans.",
        icon: <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
    },
    branded_link: {
        title: "Branded Shareable Links",
        desc: "Professional users can create clean, branded links to share their CVs instantly.",
        icon: <Sparkles className="w-12 h-12 text-blue-500 mb-4" />
    },
    generic: {
        title: "Upgrade Your Experience",
        desc: "Take your career to the next level with our premium features.",
        icon: <Sparkles className="w-12 h-12 text-blue-500 mb-4" />
    }
};

export function UpgradeModal({ isOpen, onClose, reason = 'generic' }: UpgradeModalProps) {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const content = reasonContent[reason];

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
                setLoadingPlan(null);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Something went wrong. Please try again.");
            setLoadingPlan(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white text-zinc-900 border-0 rounded-3xl">
                <div className="flex flex-col md:flex-row">
                    
                    {/* Left Panel: Context */}
                    <div className="bg-zinc-50 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-zinc-200 w-full md:w-2/5">
                        {content.icon}
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-extrabold mb-2">{content.title}</DialogTitle>
                            <DialogDescription className="text-zinc-500 font-medium">
                                {content.desc}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* Right Panel: Quick Plans */}
                    <div className="p-8 w-full md:w-3/5 flex flex-col justify-center bg-white space-y-4">
                        
                        {/* Recommend Professional */}
                        <div className="border-[2px] border-blue-600 rounded-2xl p-5 relative cursor-default">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase shadow">
                                Recommended
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h4 className="font-extrabold text-lg flex items-center gap-1">Professional ⭐</h4>
                                    <p className="text-sm font-medium text-zinc-500">$89 / year</p>
                                </div>
                                <Button 
                                    onClick={() => handleCheckout('professional_yearly')}
                                    disabled={loadingPlan !== null}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg shadow-blue-500/20"
                                >
                                    {loadingPlan === 'professional_yearly' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade"}
                                </Button>
                            </div>
                            <ul className="text-sm text-zinc-600 space-y-2 mt-4">
                                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" /> Unlimited CVs & Letters</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" /> No Watermarks</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" /> Advanced GPT-4 AI</li>
                            </ul>
                        </div>

                        {/* Starter Alternative */}
                        <div className="border border-zinc-200 rounded-2xl p-5 hover:border-blue-200 transition-colors">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-zinc-900">Starter 🚀</h4>
                                    <p className="text-sm text-zinc-500">$24 / month</p>
                                </div>
                                <Button 
                                    variant="outline"
                                    onClick={() => handleCheckout('starter_monthly')}
                                    disabled={loadingPlan !== null}
                                    className="rounded-full border-zinc-200 hover:bg-zinc-50 font-bold"
                                >
                                    {loadingPlan === 'starter_monthly' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Choose Starter"}
                                </Button>
                            </div>
                        </div>

                        {/* Lifetime Alternative */}
                         <div className="border border-zinc-200 rounded-2xl p-5 hover:border-purple-200 transition-colors">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-zinc-900">Lifetime 🏆</h4>
                                    <p className="text-sm text-zinc-500">$139 once</p>
                                </div>
                                <Button 
                                    variant="ghost"
                                    onClick={() => handleCheckout('lifetime_onetime')}
                                    disabled={loadingPlan !== null}
                                    className="rounded-full hover:bg-purple-50 text-purple-700 hover:text-purple-800 font-bold"
                                >
                                    {loadingPlan === 'lifetime_onetime' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Lifetime"}
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
