'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Bookmark, Sparkles, Link2, CheckCircle2, ArrowRight, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const steps = [
    {
        icon: Bookmark,
        step: '01',
        title: 'Find & Save a Job',
        desc: 'Search LinkedIn-synced listings, star the ones you love, and manage them in your Saved Jobs.',
    },
    {
        icon: Sparkles,
        step: '02',
        title: 'Optimize CV + Generate Letter',
        desc: 'Pick a tone, target the company, and let AI tailor your CV and create a personalized Presentation Letter.',
    },
    {
        icon: Link2,
        step: '03',
        title: 'Copy Link → Paste in LinkedIn Note',
        desc: 'Copy the shareable letter link and paste it in your LinkedIn "Send Note" — before anyone else can.',
        highlight: true,
    },
];

const trustCues = [
    'View Online',
    'Export as PDF',
    'Copy Shareable Link',
    'TR / EN',
    '4 Tone Options',
];

export function LandingCopyLinkSpotlight() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section
            ref={ref}
            className="w-full py-28 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f1728 0%, #1a2744 50%, #0f1728 100%)' }}
        >
            {/* Subtle grid bg */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            {/* Blue glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-6 mx-auto max-w-6xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[12px] font-black tracking-widest uppercase mb-6">
                        <span className="text-yellow-400">✦</span>
                        Your Unfair Advantage
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
                        Send a link,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">not an attachment.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        LinkedIn invite notes don&apos;t support file attachments. So send a shareable Presentation Letter link instead — and let the recruiter see exactly why you&apos;re the right hire.
                    </p>
                </motion.div>

                {/* 3-Step Flow */}
                <div className="grid md:grid-cols-3 gap-6 mb-16 relative">
                    {/* Connector line on desktop */}
                    <div className="hidden md:block absolute top-10 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-0" />

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
                                        ? 'bg-blue-600/10 border-blue-500/40 shadow-[0_0_40px_-8px_rgba(37,99,235,0.4)]'
                                        : 'bg-white/5 border-white/10'}`}
                            >
                                {step.highlight && (
                                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                        USP ✦
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${step.highlight ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/10 border border-white/10'}`}>
                                        <Icon className={`w-5 h-5 ${step.highlight ? 'text-blue-400' : 'text-zinc-400'}`} />
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

                {/* LinkedIn Note Mock */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.55, ease: 'easeOut' }}
                    className="max-w-xl mx-auto mb-12"
                >
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                            <span className="text-sm font-bold text-zinc-300">LinkedIn · Add a note</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-[14px] text-zinc-300 leading-relaxed font-medium">
                            Hi Sarah — I noticed this PM role and would love to connect.
                            I prepared a letter specifically for this position:{' '}
                            <span className="text-blue-400 font-bold underline underline-offset-2 break-all">
                                cvoptimizerai.com/letter/abc123
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <p className="text-[12px] text-zinc-500 font-medium">This is what separates you from every other applicant.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Trust cues */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-12"
                >
                    {trustCues.map((cue, i) => (
                        <div key={cue} className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-zinc-400">{cue}</span>
                            {i < trustCues.length - 1 && <span className="text-zinc-700 text-lg leading-none">·</span>}
                        </div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/signup">
                        <Button className="h-14 px-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-[15px] shadow-xl shadow-blue-900/30 transition-all hover:scale-[1.02]">
                            Get My Shareable Link <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white bg-white/5 hover:bg-white/10 font-bold text-[15px] transition-all">
                            Start Free Trial
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
