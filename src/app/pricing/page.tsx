import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown, Zap, ShieldCheck, Heart, Star, X } from "lucide-react";
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
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8 text-zinc-900 leading-tight">
                        Honest, <span className="text-blue-600">Simple</span> Pricing
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                        Upgrade your career standard. No complicated tiers, just one powerful lifetime plan.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-8 max-w-[850px] mx-auto mb-24 items-stretch">
                    {/* Free Plan */}
                    <div className="flex-1 bg-white rounded-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] p-10 flex flex-col border border-zinc-100 hover:shadow-xl transition-shadow">
                        <div className="text-left mb-6">
                            <h2 className="text-[28px] font-bold text-black leading-tight">Free</h2>
                            <p className="text-zinc-500 text-[15px] mt-1">Perfect for testing the platform.</p>
                        </div>
                        <div className="flex items-baseline gap-1.5 mb-8 text-left">
                            <span className="text-[44px] font-bold tracking-tight text-zinc-900 leading-none">$0</span>
                            <span className="text-zinc-500 text-[15px] font-medium">/forever</span>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1 text-left">
                            {[
                                { text: "2 CVs (Resets every 14 days)", included: true },
                                { text: "2 Cover Letters (Resets 14 days)", included: true },
                                { text: "2 Daily Job Searches", included: true },
                                { text: "PDF Export (Watermarked)", included: true },
                                { text: "Advanced AI Optimization", included: false },
                                { text: "LinkedIn Analysis & Integration", included: false },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-[14px]">
                                    {item.included ? (
                                        <CheckCircle2 className="w-[18px] h-[18px] text-[#16a34a] shrink-0 mt-[2px]" strokeWidth={2.5} />
                                    ) : (
                                        <X className="w-[18px] h-[18px] text-zinc-300 shrink-0 mt-[2px]" strokeWidth={2.5} />
                                    )}
                                    <span className={item.included ? "text-zinc-700 font-medium" : "text-zinc-400"}>{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/signup" className="w-full">
                            <Button variant="outline" className="w-full h-14 rounded-[14px] border-zinc-200 text-black font-semibold text-[15px] hover:bg-zinc-50 transition-all">
                                Start for Free
                            </Button>
                        </Link>
                    </div>

                    {/* Pro Lifetime Plan */}
                    <div className="flex-1 relative bg-white rounded-[24px] shadow-[0_12px_40px_-4px_rgba(37,99,235,0.12)] border-[2.5px] border-[#2563eb] p-10 flex flex-col hover:scale-[1.01] transition-transform">
                        <div className="absolute top-6 right-8 bg-[#2563eb] text-white text-[11px] font-black px-4 py-2 rounded-full uppercase z-20">
                            BEST VALUE
                        </div>

                        <div className="text-left mb-6 mt-4">
                            <h2 className="text-[28px] font-bold text-black leading-tight">Pro Lifetime</h2>
                            <p className="text-zinc-500 text-[15px] mt-1">Single payment, unlimited access.</p>
                        </div>

                        <div className="flex flex-col mb-8 text-left">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-[44px] font-bold tracking-tight text-zinc-900 leading-none">$99</span>
                                <span className="text-zinc-600 text-[15px] font-medium">one-time</span>
                            </div>
                            <p className="text-[11px] text-[#2563eb] font-black mt-2 uppercase tracking-wider bg-blue-50 w-fit px-2 py-0.5 rounded">
                                Approx. $8.25/mo for 12 months
                            </p>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1 text-left">
                            {[
                                "Unlimited CVs & Cover Letters",
                                "Unlimited Job Searches",
                                "Advanced AI Optimization",
                                "No Watermark Exports",
                                "LinkedIn Analysis & Integration",
                                "Priority Premium Support"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-[14px]">
                                    <CheckCircle2 className="w-[18px] h-[18px] text-[#16a34a] shrink-0 mt-[2px]" strokeWidth={2.5} />
                                    <span className="text-zinc-800 font-bold">{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href="/signup" className="w-full">
                            <Button className="w-full h-14 rounded-[14px] bg-[#1a1a1a] hover:bg-black text-white font-bold text-[15px] shadow-xl shadow-zinc-900/10 transition-all">
                                Buy Now
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
