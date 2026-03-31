"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Sparkles, Link2, Linkedin, CheckCircle2 } from 'lucide-react';

const tabs = [
    { id: 'import', label: 'Import', icon: Upload },
    { id: 'optimize', label: 'Optimize', icon: Sparkles },
    { id: 'share', label: 'Share Link', icon: Link2 },
];

export function HeroInteractiveDemo() {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className="w-full h-[520px] bg-white rounded-[24px] border border-zinc-200 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden relative group transition-all duration-500 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)]">

            {/* Minimal Mac-like Header with Tabs */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-100 bg-white">
                <div className="flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>

                <div className="flex items-center bg-zinc-50 p-1 rounded-full border border-zinc-200/60 shadow-inner">
                    {tabs.map((tab) => {
                        const active = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-4 py-1.5 text-[11px] font-bold rounded-full transition-colors flex items-center gap-1.5 z-10 ${active ? 'text-blue-700' : 'text-zinc-500 hover:text-zinc-800'
                                    }`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="heroTabBg"
                                        className="absolute inset-0 bg-white rounded-full shadow-sm border border-zinc-200/50"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> {tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-[#fafafa] relative overflow-hidden flex items-center justify-center p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'import' && (
                        <motion.div
                            key="import"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <ImportVisualMock />
                        </motion.div>
                    )}
                    {activeTab === 'optimize' && (
                        <motion.div
                            key="optimize"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <OptimizeVisualMock />
                        </motion.div>
                    )}
                    {activeTab === 'share' && (
                        <motion.div
                            key="share"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <ShareVisualMock />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Subtle bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#fafafa] to-transparent pointer-events-none" />
        </div>
    );
}

// -----------------------------------------------------------------------------
// Interactive Mocks (Adapted from existing aesthetic)
// -----------------------------------------------------------------------------

function ImportVisualMock() {
    const [active, setActive] = useState(0);
    const options = [
        { label: 'LinkedIn URL', icon: Linkedin, color: 'blue', placeholder: 'linkedin.com/in/yourname' },
        { label: 'PDF Upload', icon: Upload, color: 'violet', placeholder: 'Drop your CV.pdf here…' },
        { label: 'Plain Text', icon: FileText, color: 'emerald', placeholder: 'Just describe your experience…' },
    ];

    return (
        <div className="w-full max-w-[340px] space-y-3 relative z-10">
            {options.map((opt, i) => (
                <motion.div
                    key={opt.label}
                    onClick={() => setActive(i)}
                    whileHover={{ scale: 1.01 }}
                    className={`bg-white rounded-xl border-2 p-3.5 flex items-center gap-3 cursor-pointer transition-all shadow-sm
                        ${active === i ? 'border-blue-400 shadow-blue-100' : 'border-zinc-200 hover:border-zinc-300'}`}
                >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                        ${active === i ? 'bg-blue-600' : 'bg-zinc-100'}`}>
                        <opt.icon className={`w-4 h-4 ${active === i ? 'text-white' : 'text-zinc-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-[12px] font-bold mb-0.5 ${active === i ? 'text-zinc-900' : 'text-zinc-600'}`}>{opt.label}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{opt.placeholder}</p>
                    </div>
                    {active === i && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                    )}
                </motion.div>
            ))}

            <AnimatePresence>
                {active >= 0 && (
                    <motion.div
                        key="progress"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white rounded-xl border border-zinc-200 p-3 shadow-sm mt-3"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-zinc-700">Parsing CV…</span>
                            <span className="text-[11px] font-bold text-blue-600">AI Ready</span>
                        </div>
                        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: '85%' }}
                                transition={{ duration: 1.5, ease: 'easeOut', repeat: Infinity, repeatDelay: 1 }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function OptimizeVisualMock() {
    return (
        <div className="w-full max-w-[340px] space-y-3 relative z-10">
            <div className="bg-white rounded-xl border border-zinc-200 p-3.5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Target Role</p>
                <div className="h-8 bg-zinc-50 rounded-md border border-zinc-200 flex items-center px-3">
                    <span className="text-[12px] text-zinc-500 font-bold">Senior Product Manager @ Meta</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-xl border border-red-200 p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-500 mb-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 block"></span> Before
                    </p>
                    <div className="space-y-1">
                        <div className="h-1.5 bg-red-200 rounded-full w-full" />
                        <div className="h-1.5 bg-red-200 rounded-full w-4/5" />
                        <div className="h-1.5 bg-red-200 rounded-full w-3/5" />
                    </div>
                </div>
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3 relative overflow-hidden ring-1 ring-emerald-500/20">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-400/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-2 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> After AI
                    </p>
                    <div className="space-y-1">
                        <div className="h-1.5 bg-emerald-400/60 rounded-full w-full" />
                        <div className="h-1.5 bg-emerald-400/60 rounded-full w-full" />
                        <div className="h-1.5 bg-emerald-400/60 rounded-full w-4/5" />
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <p className="text-[11px] text-blue-800 font-medium leading-snug">
                    <strong className="font-extrabold text-blue-900">100%</strong> ATS Score Match detected.<br /> Your CV is ready to stand out.
                </p>
            </div>
        </div>
    );
}

function ShareVisualMock() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-[340px] space-y-3 relative z-10 flex flex-col">
            {/* Letter preview card */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-zinc-400" /> Presentation
                    </span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">Ready</span>
                </div>
                <div className="space-y-1.5 mb-4">
                    <div className="h-1.5 bg-zinc-100 rounded-full w-full" />
                    <div className="h-1.5 bg-zinc-100 rounded-full w-5/6" />
                    <div className="h-1.5 bg-zinc-100 rounded-full w-4/5" />
                    <div className="h-1.5 bg-zinc-100 rounded-full w-full" />
                    <div className="h-1.5 bg-zinc-100 rounded-full w-3/5" />
                </div>
                <motion.button
                    onClick={handleCopy}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full h-10 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 transition-all ${copied
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/40'
                        }`}
                >
                    {copied ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Copied Linked!</>
                    ) : (
                        <><Link2 className="w-3.5 h-3.5" /> Copy Shareable Link</>
                    )}
                </motion.button>
            </div>

            {/* LinkedIn note mock */}
            <div className="bg-white rounded-xl border-2 border-[#0077b5]/20 p-3 shadow-sm mt-1">
                <div className="flex items-center gap-2 mb-2">
                    <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
                    <span className="text-[11px] font-bold text-[#0077b5]">LinkedIn · Note</span>
                </div>
                <div className="bg-zinc-50 rounded-lg p-2.5 text-[11.5px] text-zinc-600 leading-relaxed border border-zinc-100 font-medium">
                    Hi Sarah, I&apos;d love to connect.{' '}
                    <span className="text-blue-600 font-bold underline underline-offset-2 break-all bg-blue-50 px-1 rounded">cvoptimizerai.com/l/amy-p</span>
                </div>
            </div>
        </div>
    );
}
