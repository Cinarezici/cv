import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown, Zap } from "lucide-react";
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6 relative">
            <header className="fixed top-0 left-0 right-0 h-14 flex items-center border-b bg-white z-50 px-6">
                <Link className="flex items-center justify-center font-bold text-xl" href="/">
                    <Zap className="h-6 w-6 text-indigo-600 mr-2" />
                    Interview-Ready CV
                </Link>
                <nav className="ml-auto flex gap-6 items-center">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/templates">Templates</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">Pricing</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">Login</Link>
                </nav>
            </header>

            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-zinc-900">
                    Plans to <span className="text-indigo-600">Upgrade Your Career</span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto">
                    Choose the plan that's right for you. Start for free and upgrade as you grow.
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:px-12">
                {/* Free Plan */}
                <div className="bg-white rounded-3xl p-8 relative flex flex-col h-full border border-zinc-200 shadow-sm">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            <Zap className="text-zinc-400 w-6 h-6" /> Starter
                        </h2>
                        <p className="text-zinc-500 text-sm mb-6">Basic tools to get you started.</p>
                        <div className="text-5xl font-extrabold text-zinc-900">Free</div>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                        {['1 Resume', 'Basic Templates', 'Standard PDF Download', 'Public Share Link'].map((feat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-zinc-300" />
                                <span className="text-zinc-600 font-medium">{feat}</span>
                            </div>
                        ))}
                    </div>

                    <Link href="/signup" className="w-full mt-auto">
                        <Button variant="outline" className="w-full rounded-2xl h-12 text-base font-bold border-zinc-200 hover:bg-zinc-50">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Pro Plan */}
                <div className="bg-white rounded-3xl p-8 relative flex flex-col h-full border-2 border-indigo-600 shadow-xl transform md:-translate-y-4">
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-1 shadow-md">
                        <Crown className="w-3 h-3" /> MOST POPULAR
                    </div>

                    <div className="mb-8 mt-2">
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-indigo-600">
                            Pro <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded">Unlimited</span>
                        </h2>
                        <p className="text-zinc-500 text-sm mb-6">For professionals who want to stand out.</p>
                        <div className="text-5xl font-extrabold flex items-baseline gap-2 text-zinc-900">
                            $9 <span className="text-lg text-zinc-400 font-medium">/mo</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-2">Billed monthly. Cancel anytime.</p>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                        {[
                            'Unlimited Resumes',
                            'All Premium Templates',
                            'High-Res PDF (No Watermark)',
                            'Priority AI Support',
                            'Custom Bio Generation',
                            'Job Matching Insights',
                            'Cover Letter Builder'
                        ].map((feat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                <span className="text-zinc-800 font-medium">{feat}</span>
                            </div>
                        ))}
                    </div>

                    <Link href="/signup" className="w-full mt-auto">
                        <Button className="w-full rounded-2xl h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                            Upgrade to Pro
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="text-center mt-12 text-xs text-zinc-400 space-y-2 max-w-lg mx-auto">
                <p>Secure payments processed via Stripe. All data is encrypted.</p>
                <p>Cancel your subscription at any time from your account settings.</p>
            </div>
        </div>
    );
}
