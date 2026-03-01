"use client";

import { Check, Lock } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { COLOR_PALETTES } from "@/lib/theme-config";

/* ─── Shared mini-preview data type ─── */
type Exp = { role: string; company: string; period: string; bullets: string[] };
type PData = { name: string; title: string; email: string; location: string; summary: string; experience: Exp[]; skills: string[] };

/* ─── 10 mini-preview components matching the actual CVRenderer layouts ─── */
function MinimalistPreview({ p, accent }: { p: PData; accent: string }) {
    return (
        <div className="w-full h-full bg-white flex flex-col p-3 text-[4.5px] leading-tight font-sans overflow-hidden">
            <div className="mb-1.5 pb-1.5 border-b" style={{ borderColor: accent }}>
                <div className="font-bold text-[7px] text-zinc-900 tracking-tight">{p.name}</div>
                <div className="font-semibold text-[5px] mt-0.5" style={{ color: accent }}>{p.title}</div>
                <div className="flex gap-2 text-zinc-400 mt-0.5 text-[3.5px]"><span>{p.email}</span><span>·</span><span>{p.location}</span></div>
            </div>
            <div className="mb-1">
                <div className="font-bold text-[4px] uppercase tracking-widest mb-0.5 text-zinc-500">Summary</div>
                <div className="text-zinc-600 text-[3px]">{p.summary}</div>
            </div>
            <div className="flex-1">
                <div className="font-bold text-[4px] uppercase tracking-widest mb-0.5 text-zinc-500">Experience</div>
                {p.experience.map((exp, i) => (
                    <div key={i} className="mb-0.5">
                        <div className="flex justify-between"><span className="font-bold text-[3.5px] text-zinc-900">{exp.role}</span><span className="text-zinc-400 text-[3px]">{exp.period}</span></div>
                        <div className="text-zinc-500 text-[3px] mb-0.5">{exp.company}</div>
                        {exp.bullets.slice(0, 2).map((b, j) => <div key={j} className="flex gap-0.5 text-[3px] text-zinc-600"><span>•</span>{b}</div>)}
                    </div>
                ))}
            </div>
            <div><div className="font-bold text-[4px] uppercase tracking-widest mb-0.5 text-zinc-500">Skills</div>
                <div className="flex flex-wrap gap-0.5">{p.skills.map(s => <span key={s} className="bg-zinc-100 text-zinc-600 rounded-sm px-0.5 py-0.5 text-[2.5px]">{s}</span>)}</div>
            </div>
        </div>
    );
}

function ModernPreview({ p, accent }: { p: PData; accent: string }) {
    return (
        <div className="w-full h-full flex overflow-hidden text-[4px] leading-tight font-sans">
            <div className="w-[36%] flex-shrink-0 flex flex-col p-2 text-white gap-1.5" style={{ backgroundColor: accent }}>
                <div className="w-7 h-7 rounded-full bg-white/20 mx-auto flex items-center justify-center text-[5px] font-bold">{p.name.split(" ").map(n => n[0]).join("")}</div>
                <div className="text-center"><div className="font-bold text-[4.5px] text-white leading-tight">{p.name}</div><div className="text-[3px] text-white/70">{p.title}</div></div>
                <div className="border-t border-white/20 pt-1 text-[3px] text-white/80 space-y-0.5"><div>{p.email}</div><div>{p.location}</div></div>
            </div>
            <div className="flex-1 p-2 bg-white flex flex-col gap-1">
                <div><div className="font-bold text-[3.5px] uppercase text-zinc-400 mb-0.5">Profile</div><div className="text-[3px] text-zinc-600">{p.summary}</div></div>
                <div><div className="font-bold text-[3.5px] uppercase text-zinc-400 mb-0.5">Experience</div>
                    {p.experience.map((exp, i) => (<div key={i} className="mb-0.5"><div className="flex justify-between"><span className="font-bold text-[3.5px] text-zinc-900">{exp.role}</span><span className="text-[2.5px] text-zinc-400">{exp.period}</span></div><div className="text-[3px]" style={{ color: accent }}>{exp.company}</div></div>))}
                </div>
            </div>
        </div>
    );
}

function ExecutivePreview({ p, accent }: { p: PData; accent: string }) {
    return (
        <div className="w-full h-full bg-white flex flex-col p-3 overflow-hidden">
            <div className="text-center mb-1.5 pb-1.5 border-b-2" style={{ borderColor: accent }}>
                <div className="font-black text-[7px] tracking-widest uppercase text-zinc-900">{p.name}</div>
                <div className="text-[4px] font-bold uppercase tracking-widest mt-0.5" style={{ color: accent }}>{p.title}</div>
                <div className="flex justify-center gap-1 text-[3px] text-zinc-400 mt-0.5"><span>{p.email}</span><span>·</span><span>{p.location}</span></div>
            </div>
            <div className="flex flex-1 gap-2">
                <div className="w-[30%] bg-zinc-50 p-1">
                    <div className="text-[3.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Summary</div>
                    <div className="text-[3px] text-zinc-600">{p.summary}</div>
                    <div className="mt-1"><div className="text-[3.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Skills</div>{p.skills.map(s => <div key={s} className="text-[3px] text-zinc-600 flex gap-0.5"><span>›</span>{s}</div>)}</div>
                </div>
                <div className="flex-1">
                    <div className="text-[3.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Experience</div>
                    {p.experience.map((exp, i) => (<div key={i} className="mb-1"><div className="font-bold text-[3.5px] text-zinc-900">{exp.role}</div><div className="text-[3px] font-bold" style={{ color: accent }}>{exp.company}</div></div>))}
                </div>
            </div>
        </div>
    );
}

function CreativePreview({ p, accent }: { p: PData; accent: string }) {
    return (
        <div className="w-full h-full overflow-hidden flex flex-col">
            <div className="px-3 py-1.5" style={{ backgroundColor: accent }}>
                <div className="font-black text-[7px] text-white tracking-tight leading-none">{p.name}</div>
                <div className="text-white/70 text-[3.5px] mt-0.5 uppercase tracking-widest">{p.title}</div>
            </div>
            <div className="flex-1 p-2 flex gap-2 overflow-hidden">
                <div className="w-[38%] flex flex-col gap-1">
                    <div className="text-[3px] font-black uppercase tracking-widest" style={{ color: accent }}>About</div>
                    <div className="text-[3px] text-zinc-600">{p.summary}</div>
                    <div className="text-[3px] font-black uppercase tracking-widest mt-0.5" style={{ color: accent }}>Skills</div>
                    {p.skills.slice(0, 4).map(s => <div key={s} className="flex items-center gap-0.5 text-[2.5px] text-zinc-600"><span className="w-1 h-1 rounded-full" style={{ backgroundColor: accent }} />{s}</div>)}
                </div>
                <div className="flex-1">
                    <div className="text-[3px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Experience</div>
                    {p.experience.map((exp, i) => (<div key={i} className="rounded-sm p-0.5 mb-0.5" style={{ borderLeft: `1.5px solid ${accent}` }}><div className="font-bold text-[3.5px] text-zinc-900">{exp.role}</div><div className="text-[3px] font-bold" style={{ color: accent }}>{exp.company}</div></div>))}
                </div>
            </div>
        </div>
    );
}

// Awesome-CV: colored sidebar + white right
function AwesomeCVPreview({ p, accent }: { p: PData; accent: string }) {
    return (
        <div className="w-full h-full flex overflow-hidden">
            <div className="w-[30%] flex flex-col p-2 text-white" style={{ backgroundColor: accent }}>
                <div className="w-7 h-7 rounded-full bg-white/20 mx-auto mb-1.5 flex items-center justify-center text-[7px] font-black">{p.name.charAt(0)}</div>
                <div className="text-[3px] text-white/50 font-black uppercase tracking-widest mb-1">Contact</div>
                <div className="text-[2.5px] text-white/80 space-y-0.5"><div>{p.email}</div><div>{p.location}</div></div>
                <div className="text-[3px] text-white/50 font-black uppercase tracking-widest mt-1 mb-1">Skills</div>
                {p.skills.slice(0, 5).map(s => <div key={s} className="flex items-center gap-0.5 mb-0.5"><span className="w-1 h-1 rounded-full bg-white/50" /><span className="text-[2.5px] text-white/80">{s}</span></div>)}
            </div>
            <div className="flex-1 bg-white p-2">
                <div className="border-b-2 pb-1 mb-1" style={{ borderColor: accent }}>
                    <div className="font-black text-[6px] uppercase tracking-widest text-zinc-900">{p.name}</div>
                    <div className="font-bold text-[3.5px] uppercase" style={{ color: accent }}>{p.title}</div>
                </div>
                <div className="text-[2.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Experience</div>
                {p.experience.map((exp, i) => (<div key={i} className="mb-0.5"><div className="font-black text-[3px] text-zinc-900">{exp.role}</div><div className="text-[2.5px] font-bold uppercase" style={{ color: accent }}>{exp.company}</div></div>))}
            </div>
        </div>
    );
}

// Jake's Resume: ultra-compact, centered header, horizontal rules
function JakeResumePreview({ p }: { p: PData }) {
    return (
        <div className="w-full h-full bg-white p-3 font-serif overflow-hidden">
            <div className="text-center mb-1">
                <div className="font-black text-[7px] text-zinc-900">{p.name}</div>
                <div className="flex justify-center flex-wrap gap-1 text-[3px] text-zinc-600 mt-0.5"><span>{p.email}</span><span>·</span><span>{p.location}</span></div>
            </div>
            <div className="border-t border-zinc-900 mb-1.5" />
            <div className="mb-1"><div className="font-black text-[4px] uppercase text-zinc-900 mb-0.5">Education</div><div className="border-t border-zinc-900 mb-1" /></div>
            <div className="mb-1">
                <div className="font-black text-[4px] uppercase text-zinc-900 mb-0.5">Experience</div>
                <div className="border-t border-zinc-900 mb-1" />
                {p.experience.map((exp, i) => (<div key={i} className="mb-0.5"><div className="flex justify-between"><span className="font-bold text-[3.5px] text-zinc-900">{exp.role}</span><span className="text-[3px] text-zinc-600">{exp.period}</span></div><div className="text-[3px] text-zinc-600 italic">{exp.company}</div>{exp.bullets.slice(0, 1).map((b, j) => <div key={j} className="text-[3px] text-zinc-700 pl-1">• {b}</div>)}</div>))}
            </div>
            <div><div className="font-black text-[4px] uppercase text-zinc-900 mb-0.5">Technical Skills</div><div className="border-t border-zinc-900 mb-0.5" /><div className="text-[3px] text-zinc-700"><span className="font-bold">Languages:</span> {p.skills.join(', ')}</div></div>
        </div>
    );
}

// AltaCV: full-width accent header, narrow left col with dots, wide right
function AltaCVPreview({ p, accent }: { p: PData; accent: string }) {
    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="px-3 py-1.5" style={{ backgroundColor: accent }}>
                <div className="font-black text-[7px] text-white">{p.name}</div>
                <div className="text-[3.5px] text-white/75">{p.title}</div>
            </div>
            <div className="flex flex-1">
                <div className="w-[35%] bg-zinc-50 p-2">
                    <div className="text-[3px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Contact</div>
                    {[p.email, p.location].map(s => <div key={s} className="flex items-center gap-0.5 mb-0.5"><span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} /><span className="text-[2.5px] text-zinc-600">{s}</span></div>)}
                    <div className="text-[3px] font-black uppercase tracking-widest mt-1 mb-0.5" style={{ color: accent }}>Skills</div>
                    {p.skills.slice(0, 4).map(s => <div key={s} className="flex items-center gap-0.5 mb-0.5"><span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent }} /><span className="text-[2.5px] text-zinc-600">{s}</span></div>)}
                </div>
                <div className="flex-1 p-2">
                    <div className="flex items-center gap-1 mb-0.5"><span className="w-2 h-0.5" style={{ backgroundColor: accent }} /><span className="text-[3px] font-black uppercase" style={{ color: accent }}>Experience</span></div>
                    {p.experience.map((exp, i) => (<div key={i} className="mb-1 pl-1" style={{ borderLeft: `1.5px solid ${accent}33` }}><div className="font-bold text-[3.5px] text-zinc-900">{exp.role}</div><div className="text-[3px]" style={{ color: accent }}>{exp.company}</div></div>))}
                </div>
            </div>
        </div>
    );
}

// NextJS Resume: minimal centered, large light name, pill skills
function NextjsResumePreview({ p }: { p: PData }) {
    return (
        <div className="w-full h-full bg-white p-4 flex flex-col overflow-hidden">
            <div className="pb-2 mb-2 border-b border-zinc-200">
                <div className="text-[9px] font-light text-zinc-900">{p.name}</div>
                <div className="text-[3.5px] text-zinc-500 mt-0.5">{p.title}</div>
                <div className="flex gap-2 text-[3px] text-zinc-400 mt-0.5">{p.email} · {p.location}</div>
            </div>
            <div className="text-[3px] text-zinc-400 uppercase tracking-widest mb-1">Experience</div>
            {p.experience.map((exp, i) => (<div key={i} className="mb-1.5"><div className="flex justify-between"><span className="text-[3.5px] font-semibold text-zinc-900">{exp.role}</span><span className="text-[3px] text-zinc-400">{exp.period}</span></div><div className="text-[3px] text-zinc-500">{exp.company}</div></div>))}
            <div className="mt-1"><div className="text-[3px] text-zinc-400 uppercase tracking-widest mb-1">Skills</div><div className="flex flex-wrap gap-0.5">{p.skills.map(s => <span key={s} className="text-[2.5px] px-1 py-0.5 border border-zinc-200 rounded-full text-zinc-700">{s}</span>)}</div></div>
        </div>
    );
}

// RenderCV Tech: dense monospace engineering format
function RenderCVTechPreview({ p, accent }: { p: PData; accent: string }) {
    return (
        <div className="w-full h-full bg-white p-3 overflow-hidden font-mono">
            <div className="pb-1 mb-1.5 border-b-2" style={{ borderColor: accent }}>
                <div className="font-black text-[6px] text-zinc-900">{p.name}</div>
                <div className="font-bold text-[3.5px] mt-0.5" style={{ color: accent }}>{p.title}</div>
                <div className="text-[3px] text-zinc-500 mt-0.5">{p.email} · {p.location}</div>
            </div>
            <div className="text-[3px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Technical Skills</div>
            <div className="text-[3px] text-zinc-700 mb-1"><span className="font-bold">Languages:</span> {p.skills.join(' · ')}</div>
            <div className="text-[3px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Experience</div>
            {p.experience.map((exp, i) => (<div key={i} className="mb-0.5"><div className="flex justify-between"><span className="font-black text-[3.5px] text-zinc-900">{exp.role}</span><span className="text-[3px] text-zinc-400 font-mono">{exp.period}</span></div><div className="font-bold text-[3px]" style={{ color: accent }}>{exp.company}</div>{exp.bullets.slice(0, 1).map((b, j) => <div key={j} className="text-[2.5px] text-zinc-700 pl-1">- {b}</div>)}</div>))}
        </div>
    );
}

// Reactive Resume: top color strip, card-based layout
function ReactiveResumePreview({ p, accent }: { p: PData; accent: string }) {
    return (
        <div className="w-full h-full bg-zinc-50 flex flex-col overflow-hidden">
            <div className="h-1 w-full" style={{ backgroundColor: accent }} />
            <div className="bg-white px-3 py-1.5 shadow-sm">
                <div className="font-black text-[6.5px] text-zinc-900">{p.name}</div>
                <div className="text-[3.5px] font-medium mt-0.5" style={{ color: accent }}>{p.title}</div>
                <div className="text-[3px] text-zinc-400 mt-0.5">{p.email} · {p.location}</div>
            </div>
            <div className="flex flex-1 gap-1.5 p-1.5">
                <div className="w-[35%] space-y-1">
                    <div className="bg-white rounded p-1 shadow-sm"><div className="text-[3px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>About</div><div className="text-[2.5px] text-zinc-600">{p.summary}</div></div>
                    <div className="bg-white rounded p-1 shadow-sm"><div className="text-[3px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Skills</div><div className="flex flex-wrap gap-0.5">{p.skills.slice(0, 6).map(s => <span key={s} className="text-[2px] px-0.5 py-0 text-white rounded" style={{ backgroundColor: accent }}>{s}</span>)}</div></div>
                </div>
                <div className="flex-1 bg-white rounded p-1 shadow-sm">
                    <div className="text-[3px] font-black uppercase tracking-widest mb-1" style={{ color: accent }}>Experience</div>
                    {p.experience.map((exp, i) => (<div key={i} className="mb-1 pl-1" style={{ borderLeft: `1.5px solid ${accent}` }}><div className="font-black text-[3px] text-zinc-900">{exp.role}</div><div className="text-[2.5px] font-bold" style={{ color: accent }}>{exp.company}</div></div>))}
                </div>
            </div>
        </div>
    );
}

/* ─── Template Data (10 templates: 4 free + 6 Pro) ─── */
const SAMPLE: PData = {
    name: "Your Name", title: "Professional Title",
    email: "email@example.com", location: "City, Country",
    summary: "Experienced professional with a proven track record.",
    experience: [
        { role: "Senior Role", company: "Company A", period: "2022–Now", bullets: ["Led key initiatives", "Delivered results"] },
        { role: "Previous Role", company: "Company B", period: "2019–2022", bullets: ["Built core systems"] },
    ],
    skills: ["TypeScript", "React", "Node.js", "Python", "SQL"],
};

const TEMPLATES = [
    { id: "clean-ats", name: "Minimalist", description: "Clean ATS-safe single column", accent: "#2563eb", bgColor: "bg-slate-50", isPro: false, Preview: ({ accent }: { accent: string }) => <MinimalistPreview p={SAMPLE} accent={accent} /> },
    { id: "startup-visual", name: "Modern", description: "Sidebar layout with accent colors", accent: "#6366f1", bgColor: "bg-indigo-50", isPro: false, Preview: ({ accent }: { accent: string }) => <ModernPreview p={SAMPLE} accent={accent} /> },
    { id: "executive-ats", name: "Executive", description: "Premium two-column executive style", accent: "#18181b", bgColor: "bg-zinc-50", isPro: false, Preview: ({ accent }: { accent: string }) => <ExecutivePreview p={SAMPLE} accent={accent} /> },
    { id: "creative-visual", name: "Creative", description: "Bold header for creative roles", accent: "#7c3aed", bgColor: "bg-purple-50", isPro: false, Preview: ({ accent }: { accent: string }) => <CreativePreview p={SAMPLE} accent={accent} /> },
    { id: "awesome-cv", name: "Awesome CV", description: "22k★ GitHub — colored sidebar + white", accent: "#0d9488", bgColor: "bg-teal-50", isPro: true, Preview: ({ accent }: { accent: string }) => <AwesomeCVPreview p={SAMPLE} accent={accent} /> },
    { id: "jake-resume", name: "Jake's Resume", description: "Most-cloned FAANG resume on GitHub", accent: "#18181b", bgColor: "bg-slate-100", isPro: true, Preview: () => <JakeResumePreview p={SAMPLE} /> },
    { id: "altacv", name: "AltaCV", description: "Colored header, dot-bullet two-pane", accent: "#b45309", bgColor: "bg-amber-50", isPro: true, Preview: ({ accent }: { accent: string }) => <AltaCVPreview p={SAMPLE} accent={accent} /> },
    { id: "nextjs-resume", name: "NextJS Resume", description: "Ultra-minimal modern web aesthetic", accent: "#374151", bgColor: "bg-gray-50", isPro: true, Preview: () => <NextjsResumePreview p={SAMPLE} /> },
    { id: "rendercv-tech", name: "Tech Dense", description: "Max-density FAANG engineering format", accent: "#1d4ed8", bgColor: "bg-blue-50", isPro: true, Preview: ({ accent }: { accent: string }) => <RenderCVTechPreview p={SAMPLE} accent={accent} /> },
    { id: "reactive-resume", name: "Reactive", description: "Card-based layout with accent strip", accent: "#7c3aed", bgColor: "bg-violet-50", isPro: true, Preview: ({ accent }: { accent: string }) => <ReactiveResumePreview p={SAMPLE} accent={accent} /> },
] as const;

interface TemplatePanelProps {
    isPro?: boolean;
    onProTemplateBlocked?: (templateName: string) => void;
}

export default function TemplatePanel({ isPro = false, onProTemplateBlocked }: TemplatePanelProps) {
    const { themeId, colorPaletteId, updateTheme, updateColorPalette } = useResumeStore();

    const handleTemplateClick = (tpl: typeof TEMPLATES[number]) => {
        updateTheme(tpl.id, tpl.id.includes('visual') || tpl.id === 'altacv' || tpl.id === 'awesome-cv' || tpl.id === 'reactive-resume' ? 'visual' : 'ats_safe');
        if (tpl.isPro && !isPro) {
            onProTemplateBlocked?.(tpl.name);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-5">
            <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Choose Your CV Template</h3>
                <p className="text-xs text-gray-400 dark:text-zinc-500">Select a template. Pro templates require an active subscription.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((tpl) => {
                    const isSelected = themeId === tpl.id;
                    const isLocked = tpl.isPro && !isPro;

                    return (
                        <button
                            key={tpl.id}
                            onClick={() => handleTemplateClick(tpl)}
                            className={`relative flex flex-col rounded-2xl border-2 text-left transition-all overflow-hidden group
                                ${isSelected
                                    ? isLocked
                                        ? "border-blue-400/50 dark:border-blue-400/40 shadow-md shadow-blue-500/10"
                                        : "border-blue-500 dark:border-blue-500 shadow-md shadow-blue-500/20"
                                    : "border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-white/20"
                                }`}
                        >
                            {/* PRO badge */}
                            {tpl.isPro && (
                                <span className="absolute top-2 left-2 z-20 flex items-center gap-0.5 bg-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-md">
                                    <Lock className="w-2 h-2" /> PRO
                                </span>
                            )}
                            {/* Selected indicator */}
                            {isSelected && (
                                <span className="absolute top-2 right-2 z-20 flex items-center gap-0.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                    <Check className="w-2 h-2" /> {isLocked ? "Preview" : "Active"}
                                </span>
                            )}

                            {/* Mini CV preview */}
                            <div className={`w-full ${tpl.bgColor} relative overflow-hidden`} style={{ height: "140px" }}>
                                <div className="absolute inset-0 p-1.5">
                                    <div className="w-full h-full bg-white shadow-sm overflow-hidden rounded-sm">
                                        <tpl.Preview accent={tpl.accent} />
                                    </div>
                                </div>
                                {isLocked && <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px] pointer-events-none z-10" />}
                            </div>

                            {/* Label */}
                            <div className="p-2.5 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5">
                                <div className={`font-bold text-[12px] ${isLocked ? "text-gray-500 dark:text-zinc-400" : "text-gray-900 dark:text-white"}`}>{tpl.name}</div>
                                <div className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5 leading-snug">{tpl.description}</div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Accent Color */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Accent Color</h3>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => updateColorPalette("default")}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${colorPaletteId === "default" ? "border-gray-800 dark:border-white scale-110" : "border-transparent hover:scale-105"}`}
                        style={{ background: "linear-gradient(135deg, #e2e8f0 50%, #94a3b8 50%)" }}
                        title="Default"
                    />
                    {COLOR_PALETTES.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => updateColorPalette(p.id)}
                            title={p.name}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${colorPaletteId === p.id ? "border-gray-800 dark:border-white scale-110 shadow-md" : "border-transparent hover:scale-105"}`}
                            style={{ backgroundColor: p.hex }}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-start gap-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl px-4 py-3">
                <span className="text-base">💡</span>
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                    You can change the template anytime. Your data will be preserved.
                </p>
            </div>
        </div>
    );
}
