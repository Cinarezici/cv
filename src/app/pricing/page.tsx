import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown, Zap, ShieldCheck, Heart, Star } from "lucide-react";
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white pt-32 pb-24 px-6 relative selection:bg-blue-500/30">
            {/* Header consistent with Landing Page */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 px-6 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
                <Link className="flex items-center gap-2 group" href="/">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 transition-transform group-hover:scale-110 shadow-lg shadow-blue-600/20">
                        <Zap className="h-5 w-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Interview-Ready CV</span>
                </Link>
                <nav className="ml-auto hidden md:flex gap-8 items-center text-sm font-medium text-white/60">
                    <Link className="hover:text-white transition-colors" href="/templates">Templates</Link>
                    <Link className="text-white bg-white/5 px-4 py-1.5 rounded-lg" href="/pricing">Pricing</Link>
                    <Link className="hover:text-white transition-colors" href="/login">Login</Link>
                    <Link href="/signup">
                        <Button className="bg-white text-[#020617] hover:bg-white/90 font-bold rounded-xl px-6">
                            Get Started
                        </Button>
                    </Link>
                </nav>
            </header>

            <div className="max-w-7xl mx-auto text-center mb-24 relative z-10">
                <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
                    <Heart className="h-3 w-3 fill-indigo-400" /> Investment in Your Future
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
                    Simple, <span className="text-blue-400">Transparent</span> Pricing
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                    Choose the plan that fits your career stage. No hidden fees, no subscriptions, just results.
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:px-12 relative z-10">
                {/* Free Plan */}
                <div className="bg-white/5 rounded-[40px] p-12 relative flex flex-col h-full border border-white/10 shadow-2xl transition-transform hover:scale-[1.01]">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-white/5 rounded-2xl">
                                <Zap className="text-white/40 w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Free Plan</h2>
                        </div>
                        <p className="text-white/40 text-sm mb-8">Perfect for testing the platform features.</p>
                        <div className="text-6xl font-black text-white">$0</div>
                        <p className="text-xs text-white/20 mt-2 uppercase tracking-widest font-bold">Forever Free</p>
                    </div>

                    <div className="space-y-5 mb-12 flex-1">
                        {[
                            '2 CVs (Resets every 14 days)',
                            '2 Cover Letters (14d reset)',
                            '2 Daily Job Searches',
                            'Basic Templates',
                            'Watermarked PDF Export'
                        ].map((feat, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-blue-500/50 mt-1 shrink-0" />
                                <span className="text-white/60 font-medium">{feat}</span>
                            </div>
                        ))}
                    </div>

                    <Link href="/signup" className="w-full">
                        <Button variant="outline" className="w-full rounded-[20px] h-16 text-lg font-bold border-white/10 hover:bg-white/5 transition-all">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Pro Plan */}
                <div className="bg-blue-600/10 rounded-[40px] p-12 relative flex flex-col h-full border-2 border-blue-500 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] transform md:-translate-y-8 transition-transform hover:scale-[1.02]">
                    <div className="absolute top-8 right-8 bg-blue-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full inline-flex items-center gap-1 shadow-lg tracking-widest uppercase">
                        <Crown className="w-3 h-3" /> BEST VALUE
                    </div>

                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-500 rounded-2xl">
                                <Star className="text-white w-6 h-6 fill-white" />
                            </div>
                            <h2 className="text-2xl font-bold">Lifetime Access</h2>
                        </div>
                        <p className="text-white/40 text-sm mb-8">One payment, unlimited possibilities.</p>
                        <div className="flex flex-col">
                            <div className="text-6xl font-black text-white">$99</div>
                            <p className="text-[11px] text-blue-400 font-bold mt-2 uppercase tracking-widest px-1">
                                Approx. $8.25/mo for one year
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5 mb-12 flex-1">
                        {[
                            'Unlimited CVs & Cover Letters',
                            'Unlimited Job Searches',
                            'Access to All Premium Templates',
                            'High-Res PDF (No Watermark)',
                            'Advanced AI Optimization',
                            'LinkedIn Analysis & Integration',
                            'Priority Export (PDF & Word)'
                        ].map((feat, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <CheckCircle2 className="w-6 h-6 text-blue-400 mt-0.5 shrink-0" />
                                <span className="text-white font-semibold text-lg">{feat}</span>
                            </div>
                        ))}
                    </div>

                    <Link href="/signup" className="w-full">
                        <Button className="w-full rounded-[20px] h-16 text-xl font-black bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-600/40 transition-all">
                            Unlock Lifetime Access
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="text-center mt-24 text-white/30 space-y-4 max-w-lg mx-auto relative z-10">
                <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest mb-4">
                    <ShieldCheck className="h-4 w-4 text-blue-500" /> Bank-Level Security
                </div>
                <p className="text-sm">Secure payments processed via Polar. All data is industry-standard encrypted. One-time payment, no recurring charges ever.</p>
            </div>
        </div>
    );
}
