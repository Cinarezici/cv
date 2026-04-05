"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome, Loader2, Zap, CheckCircle2, MailCheck, Shield } from "lucide-react";
import Link from "next/link";

/* ─── Animated background canvas (blue particle rain, matching landing palette) ─── */
function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        setSize();
        type P = { x: number; y: number; v: number; o: number };
        let ps: P[] = [];
        let raf = 0;
        const make = (): P => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            v: Math.random() * 0.3 + 0.05,
            o: Math.random() * 0.25 + 0.05,
        });
        const init = () => { ps = []; const n = Math.floor((canvas.width * canvas.height) / 10000); for (let i = 0; i < n; i++) ps.push(make()); };
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ps.forEach(p => {
                p.y -= p.v;
                if (p.y < 0) { p.x = Math.random() * canvas.width; p.y = canvas.height + 40; p.v = Math.random() * 0.3 + 0.05; p.o = Math.random() * 0.25 + 0.05; }
                ctx.fillStyle = `rgba(96,165,250,${p.o})`;
                ctx.fillRect(p.x, p.y, 1, 2.5);
            });
            raf = requestAnimationFrame(draw);
        };
        const onResize = () => { setSize(); init(); };
        window.addEventListener("resize", onResize);
        init(); raf = requestAnimationFrame(draw);
        return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />;
}

/* ─── "Check your email" success screen ─── */
function CheckEmailScreen({ email }: { email: string }) {
    return (
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Icon */}
            <div className="relative mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center">
                    <MailCheck className="w-9 h-9 text-blue-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
                Check your inbox.
            </h1>
            <p className="text-zinc-400 text-[16px] font-medium leading-relaxed mb-2 max-w-xs">
                We&apos;ve sent a confirmation link to
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-bold text-[14px] break-all">{email}</span>
            </div>

            {/* Instructions */}
            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-4">
                {[
                    { step: "1", text: "Open your email inbox and look for a message from CV Optimizer AI." },
                    { step: "2", text: "Click the \"Confirm your account\" button in the email." },
                    { step: "3", text: "You'll be redirected back here and signed in automatically." },
                ].map(item => (
                    <div key={item.step} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[11px] font-black text-blue-400">{item.step}</span>
                        </div>
                        <p className="text-[14px] text-zinc-400 font-medium leading-relaxed">{item.text}</p>
                    </div>
                ))}
            </div>

            {/* Spam note */}
            <p className="text-[12px] text-zinc-600 font-medium mb-6">
                Didn&apos;t receive it? Check your spam folder or wait a few minutes.
            </p>

            <Link href="/login">
                <button className="text-[14px] font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    Back to Sign In
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </Link>
        </div>
    );
}

function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const ref = searchParams.get('ref');

    const handleSignup = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);
        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                data: {
                    referrer_code: ref || null
                }
            },
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: "google") => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider,
            options: { 
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: ref ? { ref } : {}
            },
        });
    };

    return (
        <section className="fixed inset-0 bg-[#080d1a] text-zinc-50 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
            <ParticleCanvas />

            <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 z-20">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                        <Zap className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="font-extrabold text-[17px] tracking-tight text-white">CV Optimizer AI</span>
                </Link>
                <Link href="/login">
                    <button className="text-[13px] font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                        Sign In <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </Link>
            </header>

            <div className="h-full w-full flex items-center justify-center px-4 relative z-10">
                <div className="flex items-stretch gap-0 lg:gap-10 max-w-[860px] w-full">
                    <div className="hidden lg:flex flex-col justify-center w-[380px] pr-10 border-r border-white/10 animate-in fade-in slide-in-from-left-6 duration-700">
                        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-6">What you get — free for 14 days</h2>
                        <div className="space-y-4 mb-8">
                            {["ATS score out of 100 with detailed breakdown", "AI-powered CV rewrite for any target role", "12 professional, ATS-safe templates", "Keyword gap analysis vs job descriptions", "Shareable presentation letters with unique link"].map(item => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <p className="text-[14px] text-zinc-300 font-medium">{item}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center"><Zap className="w-4 h-4 text-blue-400" /></div>
                                <div><p className="text-[13px] font-bold text-white">20,000+ CVs optimized</p><p className="text-[11px] text-zinc-500 font-medium">Trusted by professionals worldwide</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {success ? <CheckEmailScreen email={email} /> : (
                            <>
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[12px] font-bold mb-6">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Start your 14-day free trial
                                    </div>
                                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Create your account.</h1>
                                    <p className="text-zinc-400 text-[15px] font-medium">No credit card required. Cancel anytime.</p>
                                </div>
                                <button type="button" onClick={() => handleOAuth("google")} className="w-full h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold text-[14px] flex items-center justify-center gap-3 transition-all mb-5">
                                    <Chrome className="w-4 h-4" /> Continue with Google
                                </button>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="flex-1 h-px bg-white/10" /><span className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">or</span><div className="flex-1 h-px bg-white/10" />
                                </div>
                                <form onSubmit={handleSignup} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-zinc-300">Email address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-xl focus:border-blue-500/60 focus:ring-blue-500/20 transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-zinc-300">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <Input id="password" type={showPassword ? "text" : "password"} placeholder="8+ characters" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 pr-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-xl focus:border-blue-500/60 focus:ring-blue-500/20 transition-all" />
                                            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                                        </div>
                                    </div>
                                    {error && <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl"><span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" /><p className="text-[13px] text-red-400 font-medium">{error}</p></div>}
                                    <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-[15px] shadow-lg shadow-blue-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2">
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}{loading ? "Creating account…" : "Create Account — It's Free"}{!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                                    </Button>
                                    <p className="text-[11px] text-zinc-600 text-center font-medium leading-relaxed">By creating an account, you agree to our <Link href="/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2">Terms of Service</Link> and <Link href="/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-2">Privacy Policy</Link>.</p>
                                </form>
                                <p className="text-center text-[14px] text-zinc-500 font-medium mt-8">Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Sign in</Link></p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function SignupPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-[#080d1a] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>}>
            <SignupForm />
        </React.Suspense>
    );
}
