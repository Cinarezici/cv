import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown, Zap, ShieldCheck, Heart, Star } from "lucide-react";
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 pt-32 pb-24 px-6 flex flex-col selection:bg-blue-500/30">
            {/* Header consistent with Landing Page */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 px-6 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
                <Link className="flex items-center gap-2 group" href="/">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 transition-transform group-hover:scale-110 shadow-lg shadow-blue-600/20">
                        <Zap className="h-5 w-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-zinc-900">CV Optimizer</span>
                </Link>
                <nav className="ml-auto hidden md:flex gap-8 items-center text-sm font-bold text-zinc-500">
                    <Link className="hover:text-blue-600 transition-colors" href="/templates">Templates</Link>
                    <Link className="hover:text-blue-600 transition-colors" href="/pricing">Pricing</Link>
                    <Link className="hover:text-blue-600 transition-colors" href="/login">Login</Link>
                    <Link href="/signup">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-xl px-6">
                            Get Started
                        </Button>
                    </Link>
                </nav>
            </header>

            <div className="max-w-7xl mx-auto flex-1 w-full relative">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[13px] font-semibold mb-6">
                        <Crown className="h-4 w-4" /> Professional Tier Subscriptions
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8 text-zinc-900">
                        Honest, <span className="text-blue-600">Simple</span> Pricing
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                        No hidden fees. No complicated tiers. Choose the plan that fits your career goals and start landing interviews today.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24 items-stretch">
                    {/* Free Plan */}
                    <div className="p-12 rounded-[40px] bg-zinc-50 border border-zinc-200 flex flex-col items-center">
                        <div className="size-16 rounded-3xl bg-white border border-zinc-100 flex items-center justify-center mb-8 shadow-sm">
                            <Zap className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-black mb-2 text-zinc-900">Free Starter</h3>
                        <p className="text-zinc-500 mb-10 text-center font-medium">Test our premium builder features</p>

                        <div className="flex items-baseline gap-1 mb-10">
                            <span className="text-6xl font-black text-zinc-900">$0</span>
                            <span className="text-zinc-400 font-bold">/forever</span>
                        </div>

                        <div className="w-full space-y-5 mb-12 flex-1">
                            <div className="flex items-center gap-4 text-zinc-600 font-bold"><CheckCircle2 className="h-6 w-6 text-blue-500" /> Create up to 2 CVs</div>
                            <div className="flex items-center gap-4 text-zinc-600 font-bold"><CheckCircle2 className="h-6 w-6 text-blue-500" /> Industry Score Analysis</div>
                            <div className="flex items-center gap-4 text-zinc-400 font-medium italic"><ShieldCheck className="h-6 w-6 opacity-30" /> Watermarked Exports</div>
                        </div>

                        <Link href="/signup" className="w-full">
                            <Button variant="outline" className="w-full h-16 rounded-2xl border-zinc-200 hover:bg-zinc-100 font-black text-lg transition-all">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Pro Lifetime Plan */}
                    <div className="p-12 rounded-[40px] bg-white border-4 border-blue-600 flex flex-col items-center relative shadow-2xl shadow-blue-500/10">
                        <div className="absolute top-8 right-10 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                            Recommended
                        </div>

                        <div className="size-16 rounded-3xl bg-blue-50 flex items-center justify-center mb-8 shadow-sm">
                            <Crown className="h-8 w-8 text-blue-600" />
                        </div>

                        <h3 className="text-2xl font-black mb-2 text-zinc-900">Lifetime Pro</h3>
                        <p className="text-zinc-500 mb-10 text-center font-medium">Unlock the full power of AI career tools</p>

                        <div className="flex flex-col items-center mb-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-6xl font-black text-zinc-900">$99</span>
                                <span className="text-zinc-400 font-bold">/one-time</span>
                            </div>
                            <p className="text-[11px] text-blue-600 font-black mt-2 uppercase tracking-wider">
                                Approx. $8.25/mo for 12 months
                            </p>
                        </div>

                        <div className="w-full space-y-5 mb-12 flex-1">
                            <div className="flex items-center gap-4 text-zinc-800 font-black"><CheckCircle2 className="h-6 w-6 text-blue-600" /> Unlimited Everything</div>
                            <div className="flex items-center gap-4 text-zinc-800 font-black"><CheckCircle2 className="h-6 w-6 text-blue-600" /> Advanced AI Power</div>
                            <div className="flex items-center gap-4 text-zinc-800 font-black"><CheckCircle2 className="h-6 w-6 text-blue-600" /> Premium Exports</div>
                            <div className="flex items-center gap-4 text-zinc-800 font-black"><Star className="h-6 w-6 text-blue-600" /> Priority Support</div>
                        </div>

                        <Link href="/signup" className="w-full">
                            <Button className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-500/20 transition-transform hover:scale-[1.02]">
                                Upgrade to Pro
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* FAQ/Trust Markers */}
                <div className="grid md:grid-cols-3 gap-12 text-center pt-24 border-t border-zinc-100">
                    <div className="space-y-4">
                        <div className="size-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="font-black text-zinc-900">Secure Payments</h4>
                        <p className="text-sm text-zinc-500 font-medium">Industry standard encryption for all transactions.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="size-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="font-black text-zinc-900">100% Satisfaction</h4>
                        <p className="text-sm text-zinc-500 font-medium">Join 10,000+ happy professionals worldwide.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="size-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                            <Zap className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="font-black text-zinc-900">Instant Access</h4>
                        <p className="text-sm text-zinc-500 font-medium">Unlock all features immediately after purchase.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
