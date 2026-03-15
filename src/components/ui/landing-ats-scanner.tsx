'use client';

import { motion, useInView, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Upload, BarChart3, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const steps = [
    {
        icon: Upload,
        step: '01',
        title: 'Upload Your CV',
        desc: 'Drop your PDF or paste your CV text. No sign-up needed to see your score.',
    },
    {
        icon: BarChart3,
        step: '02',
        title: 'Get Your ATS Score',
        desc: 'Instantly see your score out of 100, what you\'re doing right, and every issue holding you back — ranked by impact.',
    },
    {
        icon: Sparkles,
        step: '03',
        title: 'Fix It with AI',
        desc: 'One click rewrites your entire CV to be ATS-optimized, keyword-rich, and ready for the role you want.',
        highlight: true,
    },
];

function ScoreGauge({ score, color, inView, delay = 0 }: {
    score: number; color: string; inView: boolean; delay?: number;
}) {
    const [displayScore, setDisplayScore] = useState(0);
    const [arc, setArc] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const timer = setTimeout(() => {
            const controls = animate(0, score, {
                duration: 1.4,
                ease: 'easeOut',
                onUpdate: (v) => {
                    setDisplayScore(Math.round(v));
                    setArc(v / 100);
                },
            });
            return () => controls.stop();
        }, delay * 1000);
        return () => clearTimeout(timer);
    }, [inView, score, delay]);

    const r = 54;
    const cx = 64;
    const cy = 64;
    const circumference = 2 * Math.PI * r;
    const dashoffset = circumference * (1 - arc);

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width="128" height="128" viewBox="0 0 128 128">
                {/* Track */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                {/* Arc */}
                <circle
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 6px ${color}60)` }}
                />
                {/* Score text */}
                <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontSize="24" fontWeight="800" fontFamily="inherit">
                    {displayScore}
                </text>
                <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle"
                    fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="700" fontFamily="inherit">
                    / 100
                </text>
            </svg>
        </div>
    );
}

function BeforeAfterPanel({ inView }: { inView: boolean }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">

            {/* BEFORE */}
            <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.5, ease: 'easeOut' }}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
            >
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Before</span>
                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">Needs Work</span>
                </div>

                <div className="flex justify-center">
                    <ScoreGauge score={63} color="#ef4444" inView={inView} delay={0.6} />
                </div>

                <div className="flex flex-col gap-2 mt-1">
                    <div className="flex items-start gap-2.5 bg-red-500/8 border border-red-500/15 rounded-xl px-3 py-2.5">
                        <span className="text-[10px] font-black text-red-400 mt-0.5 shrink-0">HIGH</span>
                        <p className="text-[12px] text-zinc-400 font-medium leading-snug">Incomplete bullet structure: missing measurable results</p>
                    </div>
                    <div className="flex items-start gap-2.5 bg-yellow-500/8 border border-yellow-500/15 rounded-xl px-3 py-2.5">
                        <span className="text-[10px] font-black text-yellow-400 mt-0.5 shrink-0">MED</span>
                        <p className="text-[12px] text-zinc-400 font-medium leading-snug">Inconsistent punctuation across bullet points</p>
                    </div>
                    <div className="flex items-start gap-2.5 bg-green-500/8 border border-green-500/15 rounded-xl px-3 py-2.5">
                        <span className="text-[10px] font-black text-green-400 mt-0.5 shrink-0">LOW</span>
                        <p className="text-[12px] text-zinc-400 font-medium leading-snug">Buzzword usage: "dynamic", "hardworking"</p>
                    </div>
                </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.9 }}
                className="flex items-center justify-center shrink-0 py-2 sm:py-0"
            >
                <ArrowRight className="w-6 h-6 text-zinc-500" />
            </motion.div>

            {/* AFTER */}
            <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.7, ease: 'easeOut' }}
                className="flex-1 bg-emerald-500/5 border border-emerald-500/25 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_0_40px_-8px_rgba(16,185,129,0.2)]"
            >
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">After</span>
                    <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">Excellent</span>
                </div>

                <div className="flex justify-center">
                    <ScoreGauge score={91} color="#10b981" inView={inView} delay={1.0} />
                </div>

                <div className="flex flex-col gap-2 mt-1">
                    {[
                        'All high-impact issues resolved',
                        'Keywords aligned to job description',
                        'CAR method applied to all bullet points',
                    ].map((line) => (
                        <div key={line} className="flex items-center gap-2.5 bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-3 py-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                            <p className="text-[12px] text-zinc-300 font-semibold leading-snug">{line}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
    );
}

export function LandingATSScanner() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section
            id="ats-scanner"
            ref={ref}
            className="w-full py-28 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f1728 0%, #1a2744 50%, #0f1728 100%)' }}
        >
            {/* Subtle grid bg */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            {/* Green glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/8 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-6 mx-auto max-w-6xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[12px] font-black tracking-widest uppercase mb-6">
                        <span className="text-yellow-400">✦</span>
                        ATS Scanner
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
                        Find out why your CV gets ignored.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">Fix it in seconds.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Most CVs never reach a human. They&apos;re filtered out by ATS software before anyone reads them.
                        Upload yours and find out exactly where you stand — and what to do about it.
                    </p>
                </motion.div>

                {/* 3-Step Flow */}
                <div className="grid md:grid-cols-3 gap-6 mb-16 relative">
                    {/* Connector line on desktop */}
                    <div className="hidden md:block absolute top-10 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent z-0" />

                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 32 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease: 'easeOut' }}
                                className={`relative flex flex-col gap-4 p-7 rounded-2xl border transition-all z-10
                  ${step.highlight
                                        ? 'bg-emerald-600/10 border-emerald-500/40 shadow-[0_0_40px_-8px_rgba(16,185,129,0.4)]'
                                        : 'bg-white/5 border-white/10'}`}
                            >
                                {step.highlight && (
                                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                        AI ✦
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${step.highlight ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/10 border border-white/10'}`}>
                                        <Icon className={`w-5 h-5 ${step.highlight ? 'text-emerald-400' : 'text-zinc-400'}`} />
                                    </div>
                                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">{step.step}</span>
                                </div>

                                <div>
                                    <h3 className={`text-[18px] font-extrabold mb-2 ${step.highlight ? 'text-white' : 'text-zinc-200'}`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-[14px] text-zinc-400 font-medium leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Before / After Score Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
                    className="max-w-2xl mx-auto mb-14"
                >
                    <BeforeAfterPanel inView={inView} />
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 1.1 }}
                    className="flex flex-col items-center gap-3"
                >
                    <Link href="/signup">
                        <Button className="h-14 px-10 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-[15px] shadow-xl shadow-emerald-900/30 transition-all hover:scale-[1.02]">
                            Scan My CV Free <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                    <p className="text-[13px] text-zinc-500 font-medium">See your ATS score in seconds. No account required.</p>
                </motion.div>
            </div>
        </section>
    );
}
