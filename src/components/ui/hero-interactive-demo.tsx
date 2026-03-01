"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Link2, CheckCircle, ChevronRight, FileText, Bot, Copy, ArrowRight, Zap, Star } from 'lucide-react';

const tabs = [
    { id: 'optimize', label: 'AI Optimize', icon: Sparkles },
    { id: 'jobs', label: 'Job Search', icon: Search },
    { id: 'share', label: 'Share Link', icon: Link2 },
];

export function HeroInteractiveDemo() {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-white/40 dark:bg-zinc-900/40 rounded-[32px] border border-white/60 dark:border-white/10 shadow-[0_32px_80px_-20px_rgba(37,99,235,0.15)] overflow-hidden backdrop-blur-3xl group">

            {/* Glossy top bar */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-white/60 dark:bg-zinc-950/40 border-b border-white/80 dark:border-white/10 flex items-center px-5 gap-2 z-20 backdrop-blur-md">
                <div className="flex gap-1.5 opacity-80">
                    <div className="w-3 h-3 rounded-full bg-rose-400 shadow-sm shadow-rose-400/20"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/20"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/20"></div>
                </div>
                <div className="mx-auto flex bg-black/5 dark:bg-white/5 rounded-full p-1 border border-black/5 dark:border-white/5">
                    {tabs.map((tab) => {
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-3 py-1 text-[11px] font-bold rounded-full transition-colors flex items-center gap-1.5 ${active ? 'text-blue-700 dark:text-blue-400' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="heroTab"
                                        className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full shadow-sm"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-1.5"><tab.icon className="w-3 h-3" /> {tab.label}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="w-[42px]"></div> {/* spacer for centering */}
            </div>

            {/* Content Area */}
            <div className="absolute inset-x-0 top-12 bottom-0 bg-gradient-to-b from-transparent to-black/[0.02] dark:to-white/[0.02] flex items-center justify-center p-6 overflow-hidden">
                <AnimatePresence mode="popLayout">
                    {activeTab === 'optimize' && <OptimizeDemo key="opt" />}
                    {activeTab === 'jobs' && <JobsDemo key="jobs" />}
                    {activeTab === 'share' && <ShareDemo key="share" />}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 1. Optimize Demo
// ----------------------------------------------------------------------
function OptimizeDemo() {
    const [optimized, setOptimized] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-[400px] flex flex-col gap-4"
        >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-xl shadow-blue-900/5 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-[15px] text-zinc-900 dark:text-white leading-tight">Senior Product Manager</h4>
                        <p className="text-[12px] text-zinc-500 font-medium tracking-tight">TechCorp • 2021 - Present</p>
                    </div>
                </div>

                <div className="space-y-3 relative">
                    {/* Before */}
                    <div className={`transition-all duration-500 ${optimized ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>
                        <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mt-1.5 shrink-0" />
                            <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-snug font-medium">
                                Managed a team of 5 to launch a new feature that increased sales.
                            </p>
                        </div>
                    </div>

                    {/* After */}
                    {optimized && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-3.5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[24px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                            <div className="flex items-start gap-2 relative z-10">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                <p className="text-[13px] text-blue-900 dark:text-blue-200 leading-snug font-bold">
                                    Led cross-functional team of 5 to architect and launch MVP, driving <span className="bg-blue-200 dark:bg-blue-500/30 px-1 rounded">34% YoY revenue growth</span> within Q1.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <button
                onClick={() => setOptimized(true)}
                disabled={optimized}
                className="mx-auto flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-0"
            >
                <Zap className="w-4 h-4" fill="currentColor" /> Optimize via AI
            </button>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// 2. Jobs Demo
// ----------------------------------------------------------------------
function JobsDemo() {
    const [saved, setSaved] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-[400px] flex flex-col gap-3"
        >
            <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-xl shadow-black/5 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-inner">
                        A
                    </div>
                    <div>
                        <h4 className="font-extrabold text-[14px] text-zinc-900 dark:text-white leading-tight">AI Engineer</h4>
                        <p className="text-[12px] text-zinc-500 font-medium">Anthropic • Remote</p>
                    </div>
                </div>
                <button
                    onClick={() => setSaved(!saved)}
                    className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <Star className={`w-5 h-5 transition-all ${saved ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-zinc-300 dark:text-zinc-600'}`} />
                </button>
            </div>

            {saved && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-3 flex items-center justify-between"
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[12px] font-bold text-emerald-800 dark:text-emerald-300">Saved to Dashboard</span>
                    </div>
                    <button className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-white dark:bg-transparent border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1">
                        Tailor CV <ArrowRight className="w-3 h-3" />
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// 3. Share Demo
// ----------------------------------------------------------------------
function ShareDemo() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-[400px]"
        >
            <div className="relative w-full bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-[40px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                    <Link2 className="w-6 h-6 text-white" />
                </div>

                <h4 className="font-extrabold text-lg text-zinc-900 dark:text-white mb-2 tracking-tight">Send a link, not a PDF.</h4>
                <p className="text-[13px] text-zinc-500 font-medium mb-5 px-4">
                    Share an interactive version of your Cover Letter via LinkedIn direct messages.
                </p>

                <div className="flex items-center gap-2 p-1.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl relative">
                    <div className="flex-1 bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 border border-zinc-200 dark:border-zinc-700 text-left truncate flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                            <Bot className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-[12px] font-medium text-zinc-600 dark:text-zinc-300 truncate font-mono">
                            cvoptimizerai.com/l/amy-smith-pm
                        </span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`px-3 py-2 rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition-all ${copied
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                                : 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                            }`}
                    >
                        {copied ? (
                            <><CheckCircle className="w-3.5 h-3.5" /> Copied</>
                        ) : (
                            <><Copy className="w-3.5 h-3.5" /> Copy</>
                        )}
                    </button>

                    {copied && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl"
                        >
                            Link ready to paste!
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 dark:bg-white rotate-45" />
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
