'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Sparkles, Link2, Linkedin, CheckCircle2, ArrowRight } from 'lucide-react';

const tabs = [
    { id: 'build', label: 'Build CV', icon: FileText },
    { id: 'import', label: 'Import CV', icon: Upload },
    { id: 'optimize', label: 'Optimize', icon: Sparkles },
    { id: 'share', label: 'Copy Link', icon: Link2, highlight: true },
];

function BuildVisual() {
    return (
        <div className="w-full h-full flex items-center justify-center p-6 bg-zinc-50 rounded-2xl">
            <div className="w-full max-w-[420px] space-y-3">
                {/* Template gallery row */}
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                    {['Modern', 'Executive', 'Creative'].map((t, i) => (
                        <div key={t} className={`h-20 rounded-xl border-2 flex flex-col items-center justify-center text-[11px] font-bold tracking-tight transition-all
              ${i === 0 ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white border-zinc-200 text-zinc-500 hover:border-blue-300'}`}>
                            <div className={`w-6 h-0.5 mb-1.5 rounded-full ${i === 0 ? 'bg-white/60' : 'bg-zinc-200'}`} />
                            <div className={`w-4 h-0.5 mb-1 rounded-full ${i === 0 ? 'bg-white/40' : 'bg-zinc-100'}`} />
                            {t}
                        </div>
                    ))}
                </div>

                {/* CV Editor card */}
                <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Professional Summary</span>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 cursor-pointer"
                        >
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            <span className="text-[11px] font-bold text-blue-700">✦ Optimize</span>
                        </motion.div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="h-2 bg-zinc-100 rounded-full w-full" />
                        <div className="h-2 bg-zinc-100 rounded-full w-4/5" />
                        <div className="h-2 bg-zinc-100 rounded-full w-3/5" />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Experience</span>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5 }}
                            className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 cursor-pointer"
                        >
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            <span className="text-[11px] font-bold text-blue-700">✦ Optimize</span>
                        </motion.div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="h-2 bg-zinc-100 rounded-full w-full" />
                        <div className="h-2 bg-zinc-100 rounded-full w-3/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ImportVisual() {
    const [active, setActive] = useState(0);
    const options = [
        { label: 'LinkedIn URL', icon: Linkedin, color: 'blue', placeholder: 'linkedin.com/in/yourname' },
        { label: 'PDF Upload', icon: Upload, color: 'violet', placeholder: 'Drop your CV.pdf here…' },
        { label: 'Plain Text', icon: FileText, color: 'emerald', placeholder: 'Just describe your experience…' },
    ];

    return (
        <div className="w-full h-full flex items-center justify-center p-6 bg-zinc-50 rounded-2xl">
            <div className="w-full max-w-[420px] space-y-3">
                {options.map((opt, i) => (
                    <motion.div
                        key={opt.label}
                        onClick={() => setActive(i)}
                        whileHover={{ scale: 1.01 }}
                        className={`bg-white rounded-xl border-2 p-4 flex items-center gap-4 cursor-pointer transition-all shadow-sm
              ${active === i ? 'border-blue-400 shadow-blue-100' : 'border-zinc-200 hover:border-zinc-300'}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              ${active === i ? 'bg-blue-600' : 'bg-zinc-100'}`}>
                            <opt.icon className={`w-5 h-5 ${active === i ? 'text-white' : 'text-zinc-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-[13px] font-bold mb-0.5 ${active === i ? 'text-zinc-900' : 'text-zinc-600'}`}>{opt.label}</p>
                            <p className="text-[11px] text-zinc-400 truncate">{opt.placeholder}</p>
                        </div>
                        {active === i && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                            </motion.div>
                        )}
                    </motion.div>
                ))}

                <AnimatePresence>
                    {active >= 0 && (
                        <motion.div
                            key="progress"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl border border-zinc-200 p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[12px] font-bold text-zinc-700">Parsing CV…</span>
                                <span className="text-[12px] font-bold text-blue-600">AI Ready</span>
                            </div>
                            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '85%' }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function OptimizeVisual() {
    return (
        <div className="w-full h-full flex items-center justify-center p-6 bg-zinc-50 rounded-2xl">
            <div className="w-full max-w-[420px] space-y-3">
                <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                    <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-3">Target Role</p>
                    <div className="h-9 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center px-3">
                        <span className="text-sm text-zinc-400 font-medium">Senior Product Manager @ Google</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Tone</p>
                        {['Corporate', 'Startup', 'Executive', 'Friendly'].map((t, i) => (
                            <div key={t} className={`text-[11px] font-bold px-2 py-1 rounded-md mb-1 ${i === 2 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-zinc-500'}`}>{t}</div>
                        ))}
                    </div>
                    <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Language</p>
                        {['English 🇬🇧', 'Turkish 🇹🇷'].map((l, i) => (
                            <div key={l} className={`text-[11px] font-bold px-2 py-1 rounded-md mb-1 ${i === 0 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-zinc-500'}`}>{l}</div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 rounded-xl border border-red-200 p-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Before</p>
                        <div className="space-y-1">
                            <div className="h-1.5 bg-red-200/50 rounded-full w-full" />
                            <div className="h-1.5 bg-red-200/50 rounded-full w-4/5" />
                            <div className="h-1.5 bg-red-200/50 rounded-full w-3/5" />
                        </div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">After ✦ AI</p>
                        <div className="space-y-1">
                            <div className="h-1.5 bg-emerald-300/60 rounded-full w-full" />
                            <div className="h-1.5 bg-emerald-300/60 rounded-full w-full" />
                            <div className="h-1.5 bg-emerald-300/60 rounded-full w-4/5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShareVisual() {
    const [toastVisible, setToastVisible] = useState(false);

    const handleCopy = () => {
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2500);
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-6 bg-zinc-50 rounded-2xl relative">
            {/* Toast */}
            <AnimatePresence>
                {toastVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[13px] font-bold px-4 py-2.5 rounded-full shadow-xl z-20 flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Link copied to clipboard!
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full max-w-[420px] space-y-3">
                {/* Letter preview card */}
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Presentation Letter</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">Ready</span>
                    </div>
                    <div className="space-y-1.5 mb-3">
                        <div className="h-2 bg-zinc-100 rounded-full w-full" />
                        <div className="h-2 bg-zinc-100 rounded-full w-5/6" />
                        <div className="h-2 bg-zinc-100 rounded-full w-4/5" />
                        <div className="h-2 bg-zinc-100 rounded-full w-full" />
                        <div className="h-2 bg-zinc-100 rounded-full w-3/5" />
                    </div>
                    <motion.button
                        onClick={handleCopy}
                        whileTap={{ scale: 0.97 }}
                        className="w-full h-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                    >
                        <Link2 className="w-3.5 h-3.5" />
                        Copy Shareable Link
                    </motion.button>
                </div>

                {/* LinkedIn note mock */}
                <div className="bg-white rounded-xl border-2 border-[#0077b5]/30 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Linkedin className="w-4 h-4 text-[#0077b5]" />
                        <span className="text-[12px] font-bold text-[#0077b5]">LinkedIn · Send a note</span>
                    </div>
                    <div className="bg-zinc-50 rounded-lg p-3 text-[12px] text-zinc-600 leading-relaxed border border-zinc-100">
                        Hi Sarah, I&apos;d love to connect and discuss the PM role.{' '}
                        <span className="text-blue-600 font-bold underline underline-offset-2 break-all">cvoptimizerai.com/letter/abc123</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-medium mt-2">← See why this candidate stands out before the call</p>
                </div>
            </div>
        </div>
    );
}

const tabContent: Record<string, {
    title: string;
    desc: string;
    badge?: string;
    note?: string;
    visual: React.FC;
}> = {
    build: {
        title: 'Start from stunning templates',
        desc: 'Choose from attention-grabbing, ATS-friendly templates. Edit every section with full control. Use the inline ✦ Optimize button on any block to let AI sharpen your impact — one click at a time.',
        visual: BuildVisual,
    },
    import: {
        title: 'Import from anywhere',
        desc: 'Paste your LinkedIn URL, upload a PDF, or just describe yourself in plain language. Our AI parses and restructures it into a polished, fully-editable CV in seconds.',
        visual: ImportVisual,
    },
    optimize: {
        title: 'Tailor for any role',
        desc: 'Pick a CV, describe the target role and company. Choose your tone — Startup, Corporate, Friendly, or Executive — and language (TR / EN). AI rewrites and scores your CV for the specific job.',
        visual: OptimizeVisual,
    },
    share: {
        title: 'Generate a letter. Copy the link.',
        desc: 'Generate a job-specific Presentation Letter and share it instantly. Paste the link in your LinkedIn "Send Note" to stand out before the interview even begins.',
        badge: 'This is the feature other candidates don\'t have.',
        note: "Trial links redirect to cvoptimizerai.com after trial ends — upgrade anytime.",
        visual: ShareVisual,
    },
};

export function LandingDemoStrip() {
    const [activeTab, setActiveTab] = useState('build');
    const content = tabContent[activeTab];
    const Visual = content.visual;

    return (
        <section id="demo" className="w-full py-28 bg-white border-y border-zinc-100">
            <div className="container px-6 mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">How it works</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-5">
                        From import to hired — in minutes.
                    </h2>
                    <p className="text-lg text-zinc-500 font-medium max-w-2xl mx-auto">
                        See exactly how CV Optimizer AI turns your background into a job-winning package.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileTap={{ scale: 0.97 }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all border
                  ${isActive
                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                                        : tab.highlight
                                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                            : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tab.label}
                                {tab.highlight && !isActive && (
                                    <span className="ml-1 text-[10px] font-black text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">USP</span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left: Text */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + '-text'}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="flex flex-col gap-5 order-2 lg:order-1"
                        >
                            {content.badge && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-[12px] font-black w-fit shadow-lg shadow-blue-500/25">
                                    <span className="text-yellow-300">✦</span>
                                    {content.badge}
                                </div>
                            )}

                            <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">
                                {content.title}
                            </h3>
                            <p className="text-[17px] text-zinc-500 font-medium leading-relaxed">
                                {content.desc}
                            </p>

                            {content.note && (
                                <p className="text-[12px] text-zinc-400 font-medium italic border-l-2 border-zinc-200 pl-3">
                                    {content.note}
                                </p>
                            )}

                            <div className="pt-2">
                                <a href="/signup" className="inline-flex items-center gap-2 text-[14px] font-bold text-blue-600 hover:text-blue-700 group">
                                    Get started — it&apos;s free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </a>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Right: Visual */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + '-visual'}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="h-[400px] rounded-2xl overflow-hidden border border-zinc-200 shadow-xl shadow-zinc-900/5 order-1 lg:order-2"
                        >
                            <Visual />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
