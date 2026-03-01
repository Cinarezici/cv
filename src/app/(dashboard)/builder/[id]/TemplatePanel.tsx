"use client";

import { Check, Lock } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { COLOR_PALETTES } from "@/lib/theme-config";

/* ─── Same preview data & components as the public templates gallery ─── */
type PreviewData = {
    name: string;
    title: string;
    email: string;
    location: string;
    summary: string;
    experience: { role: string; company: string; period: string; bullets: string[] }[];
    skills: string[];
};

function MinimalistPreview({ p, accent }: { p: PreviewData; accent: string }) {
    return (
        <div className="w-full h-full bg-white flex flex-col p-3 text-[4.5px] leading-tight font-sans overflow-hidden">
            <div className="mb-1.5 pb-1.5 border-b" style={{ borderColor: accent }}>
                <div className="font-bold text-[7px] text-zinc-900 tracking-tight">{p.name}</div>
                <div className="font-semibold text-[5px] mt-0.5" style={{ color: accent }}>{p.title}</div>
                <div className="flex gap-2 text-zinc-400 mt-0.5 text-[3.5px]">
                    <span>{p.email}</span><span>·</span><span>{p.location}</span>
                </div>
            </div>
            <div className="mb-1">
                <div className="font-bold text-[4px] uppercase tracking-widest mb-0.5 text-zinc-500">Summary</div>
                <div className="text-zinc-600 leading-relaxed text-[3px]">{p.summary}</div>
            </div>
            <div className="mb-1 flex-1">
                <div className="font-bold text-[4px] uppercase tracking-widest mb-0.5 text-zinc-500">Experience</div>
                {p.experience.map((exp, i) => (
                    <div key={i} className="mb-0.5">
                        <div className="flex justify-between">
                            <span className="font-bold text-[3.5px] text-zinc-900">{exp.role}</span>
                            <span className="text-zinc-400 text-[3px]">{exp.period}</span>
                        </div>
                        <div className="text-zinc-500 text-[3px] mb-0.5">{exp.company}</div>
                        {exp.bullets.slice(0, 2).map((b, j) => (
                            <div key={j} className="flex gap-0.5 text-[3px] text-zinc-600"><span className="text-zinc-400">•</span>{b}</div>
                        ))}
                    </div>
                ))}
            </div>
            <div>
                <div className="font-bold text-[4px] uppercase tracking-widest mb-0.5 text-zinc-500">Skills</div>
                <div className="flex flex-wrap gap-0.5">
                    {p.skills.map(s => <span key={s} className="bg-zinc-100 text-zinc-600 rounded-sm px-0.5 py-0.5 text-[2.5px]">{s}</span>)}
                </div>
            </div>
        </div>
    );
}

function ModernPreview({ p, accent }: { p: PreviewData; accent: string }) {
    return (
        <div className="w-full h-full flex overflow-hidden text-[4px] leading-tight font-sans">
            <div className="w-[36%] flex-shrink-0 flex flex-col p-2 text-white gap-1.5" style={{ backgroundColor: accent }}>
                <div className="w-7 h-7 rounded-full bg-white/20 mx-auto flex items-center justify-center text-[5px] font-bold text-white">
                    {p.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="text-center">
                    <div className="font-bold text-[4.5px] text-white leading-tight">{p.name}</div>
                    <div className="text-[3px] text-white/70 mt-0.5">{p.title}</div>
                </div>
                <div className="border-t border-white/20 pt-1 space-y-0.5">
                    <div className="text-[3px] text-white/60 font-bold uppercase tracking-widest">Contact</div>
                    <div className="text-[3px] text-white/80">{p.email}</div>
                    <div className="text-[3px] text-white/80">{p.location}</div>
                </div>
                <div className="border-t border-white/20 pt-1">
                    <div className="text-[3px] text-white/60 font-bold uppercase tracking-widest mb-0.5">Skills</div>
                    <div className="flex flex-col gap-0.5">
                        {p.skills.slice(0, 4).map(s => (
                            <div key={s} className="flex items-center gap-0.5">
                                <div className="h-0.5 rounded-full bg-white/30 flex-1">
                                    <div className="h-0.5 rounded-full bg-white" style={{ width: "70%" }} />
                                </div>
                                <span className="text-[2.5px] text-white/70 w-6 truncate">{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 p-2 flex flex-col gap-1 bg-white overflow-hidden">
                <div>
                    <div className="font-bold text-[3.5px] uppercase tracking-widest text-zinc-400 mb-0.5">Profile</div>
                    <div className="text-[3px] text-zinc-600 leading-relaxed">{p.summary}</div>
                </div>
                <div className="flex-1">
                    <div className="font-bold text-[3.5px] uppercase tracking-widest text-zinc-400 mb-0.5">Experience</div>
                    {p.experience.map((exp, i) => (
                        <div key={i} className="mb-0.5">
                            <div className="flex justify-between items-baseline">
                                <span className="font-bold text-[3.5px] text-zinc-900">{exp.role}</span>
                                <span className="text-zinc-400 text-[2.5px]">{exp.period}</span>
                            </div>
                            <div className="font-semibold text-[3px] mb-0.5" style={{ color: accent }}>{exp.company}</div>
                            {exp.bullets.slice(0, 2).map((b, j) => (
                                <div key={j} className="flex gap-0.5 text-[3px] text-zinc-500"><span style={{ color: accent }}>▸</span>{b}</div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ExecutivePreview({ p, accent }: { p: PreviewData; accent: string }) {
    return (
        <div className="w-full h-full bg-white flex flex-col p-3 overflow-hidden" style={{ fontFamily: "Georgia, serif" }}>
            <div className="text-center mb-1.5 pb-1.5" style={{ borderBottom: `2px solid ${accent}` }}>
                <div className="font-bold text-[7px] tracking-widest uppercase text-zinc-900">{p.name}</div>
                <div className="text-[4.5px] italic text-zinc-500 mt-0.5">{p.title}</div>
                <div className="flex justify-center gap-2 text-[3px] text-zinc-400 mt-0.5">
                    <span>{p.email}</span><span>·</span><span>{p.location}</span>
                </div>
            </div>
            <div className="mb-1.5">
                <div className="text-[4px] font-bold uppercase tracking-widest text-center mb-0.5" style={{ color: accent }}>Executive Summary</div>
                <div className="text-[3px] text-zinc-600 text-center italic leading-relaxed">{p.summary}</div>
            </div>
            <div className="flex-1">
                <div className="text-[4px] font-bold uppercase tracking-widest text-center mb-0.5" style={{ color: accent }}>Professional Experience</div>
                {p.experience.map((exp, i) => (
                    <div key={i} className="mb-1">
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold text-[4px] text-zinc-900">{exp.role}</span>
                            <span className="text-zinc-400 text-[3px] italic">{exp.period}</span>
                        </div>
                        <div className="text-zinc-500 text-[3px] italic mb-0.5">{exp.company}</div>
                        {exp.bullets.slice(0, 2).map((b, j) => (
                            <div key={j} className="flex gap-0.5 text-[3px] text-zinc-600"><span className="text-zinc-400">—</span>{b}</div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="pt-1" style={{ borderTop: `1px solid ${accent}` }}>
                <div className="text-[3.5px] font-bold uppercase tracking-widest text-center mb-0.5" style={{ color: accent }}>Core Competencies</div>
                <div className="flex justify-center flex-wrap gap-1">
                    {p.skills.map(s => <span key={s} className="text-[2.5px] text-zinc-500">{s}</span>)}
                </div>
            </div>
        </div>
    );
}

function CreativePreview({ p, accent }: { p: PreviewData; accent: string }) {
    return (
        <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: `linear-gradient(135deg, ${accent}15 0%, white 50%)` }}>
            <div className="px-3 py-1.5 relative" style={{ backgroundColor: accent }}>
                <div className="font-black text-[7px] text-white tracking-tight leading-none">{p.name}</div>
                <div className="text-white/70 text-[3.5px] mt-0.5 font-medium uppercase tracking-widest">{p.title}</div>
            </div>
            <div className="flex-1 p-2 flex gap-2 overflow-hidden">
                <div className="w-[38%] flex flex-col gap-1">
                    <div>
                        <div className="text-[3px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>About</div>
                        <div className="text-[3px] text-zinc-600 leading-relaxed">{p.summary}</div>
                    </div>
                    <div>
                        <div className="text-[3px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Toolkit</div>
                        <div className="flex flex-col gap-0.5">
                            {p.skills.slice(0, 4).map(s => (
                                <div key={s} className="flex items-center gap-0.5">
                                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                                    <span className="text-[2.5px] text-zinc-600">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                    <div className="text-[3px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Experience</div>
                    {p.experience.map((exp, i) => (
                        <div key={i} className="rounded-[2px] p-1 mb-0.5" style={{ backgroundColor: `${accent}10`, borderLeft: `2px solid ${accent}` }}>
                            <div className="font-bold text-[3.5px] text-zinc-900">{exp.role}</div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[3px] font-semibold" style={{ color: accent }}>{exp.company}</span>
                                <span className="text-zinc-400 text-[2.5px]">{exp.period}</span>
                            </div>
                            {exp.bullets.slice(0, 1).map((b, j) => (
                                <div key={j} className="flex gap-0.5 text-[3px] text-zinc-500 mt-0.5"><span style={{ color: accent }}>✦</span>{b}</div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── All 10 templates with the same preview data as gallery ─── */
const TEMPLATES = [
    {
        id: "clean-ats",
        category: "ats_safe" as const,
        name: "Minimalist",
        description: "Clean, distraction-free ATS design",
        accent: "#2563eb",
        bgColor: "bg-slate-50",
        isPro: false,
        style: "minimalist" as const,
        preview: {
            name: "Jordan Hayes",
            title: "Senior Software Engineer",
            email: "jordan@email.com",
            location: "San Francisco, CA",
            summary: "8+ years building scalable distributed systems.",
            experience: [
                { role: "Sr. Software Engineer", company: "DataFlow Inc.", period: "2021–Now", bullets: ["Led team of 6 engineers", "Reduced API latency 42%"] },
                { role: "Software Engineer", company: "Stripe", period: "2018–2021", bullets: ["Payments SDK", "99.99% uptime"] },
            ],
            skills: ["TypeScript", "Go", "Kubernetes", "PostgreSQL"],
        },
    },
    {
        id: "startup-visual",
        category: "visual" as const,
        name: "Modern",
        description: "Sidebar layout with photo support",
        accent: "#6366f1",
        bgColor: "bg-indigo-50",
        isPro: false,
        style: "modern" as const,
        preview: {
            name: "Elena Voss",
            title: "Product Designer",
            email: "elena@design.io",
            location: "Berlin, Germany",
            summary: "Crafting intuitive digital experiences for 6+ years.",
            experience: [
                { role: "Lead Product Designer", company: "Framer", period: "2022–Now", bullets: ["Design system owner", "User research lead"] },
                { role: "UX Designer", company: "N26", period: "2019–2022", bullets: ["Mobile banking UX", "A/B testing"] },
            ],
            skills: ["Figma", "Prototyping", "User Research", "Framer"],
        },
    },
    {
        id: "executive-ats",
        category: "ats_safe" as const,
        name: "Executive",
        description: "Sophisticated serif for leadership roles",
        accent: "#18181b",
        bgColor: "bg-zinc-50",
        isPro: true,
        style: "executive" as const,
        preview: {
            name: "Marcus A. Sterling",
            title: "Chief Operations Officer",
            email: "m.sterling@corp.com",
            location: "New York, NY",
            summary: "20+ years driving operational excellence across Fortune 500. $2.4B revenue portfolio.",
            experience: [
                { role: "COO", company: "Nexgen Capital", period: "2019–Now", bullets: ["$2.4B P&L oversight", "Scaled team 180→420"] },
                { role: "VP Operations", company: "Goldman Sachs", period: "2013–2019", bullets: ["Global ops transformation"] },
            ],
            skills: ["P&L Management", "M&A", "Strategic Planning", "Leadership"],
        },
    },
    {
        id: "creative-visual",
        category: "visual" as const,
        name: "Creative",
        description: "Bold design for creative professionals",
        accent: "#7c3aed",
        bgColor: "bg-purple-50",
        isPro: true,
        style: "creative" as const,
        preview: {
            name: "Zara Chen",
            title: "Creative Director",
            email: "zara@studiozc.co",
            location: "London, UK",
            summary: "Award-winning creative director. Cannes Lions shortlist 2023.",
            experience: [
                { role: "Creative Director", company: "IDEO London", period: "2021–Now", bullets: ["30+ brand identities", "Cannes Lions shortlist"] },
                { role: "Art Director", company: "Wieden+Kennedy", period: "2017–2021", bullets: ["Nike & Airbnb campaigns"] },
            ],
            skills: ["Brand Strategy", "Art Direction", "Motion Design", "Adobe CC"],
        },
    },
    {
        id: "modern-ats",
        category: "ats_safe" as const,
        name: "Modern ATS",
        description: "Clean ATS with superior spacing",
        accent: "#2563eb",
        bgColor: "bg-blue-50",
        isPro: true,
        style: "minimalist" as const,
        preview: {
            name: "Kai Nakamura",
            title: "Engineering Manager",
            email: "kai@company.io",
            location: "Seattle, WA",
            summary: "Engineering leader with 10+ years in distributed systems.",
            experience: [
                { role: "Engineering Manager", company: "Stripe", period: "2022–Now", bullets: ["Scaled platform 3x", "Zero-downtime deploys"] },
                { role: "Staff SWE", company: "Airbnb", period: "2019–2022", bullets: ["Search infra redesign"] },
            ],
            skills: ["Go", "Rust", "Kubernetes", "gRPC"],
        },
    },
    {
        id: "tech-ats",
        category: "ats_safe" as const,
        name: "Tech",
        description: "Dense layout for software engineers",
        accent: "#059669",
        bgColor: "bg-emerald-50",
        isPro: true,
        style: "minimalist" as const,
        preview: {
            name: "Priya Sharma",
            title: "Senior Backend Engineer",
            email: "priya@dev.co",
            location: "Austin, TX",
            summary: "Polyglot engineer specializing in high-throughput data pipelines.",
            experience: [
                { role: "Sr. Backend Engineer", company: "Databricks", period: "2021–Now", bullets: ["Petabyte-scale processing", "65% latency reduction"] },
                { role: "Software Engineer", company: "Confluent", period: "2018–2021", bullets: ["Kafka ecosystem tooling"] },
            ],
            skills: ["Python", "Java", "Spark", "Kafka", "GCP"],
        },
    },
    {
        id: "minimal-visual",
        category: "visual" as const,
        name: "Minimal Visual",
        description: "High whitespace, refined and modern",
        accent: "#374151",
        bgColor: "bg-gray-50",
        isPro: true,
        style: "executive" as const,
        preview: {
            name: "Sofia Andersen",
            title: "VP of Product",
            email: "sofia@product.se",
            location: "Stockholm, Sweden",
            summary: "Strategic product leader with 0-to-1 launches and $50M+ ARR products.",
            experience: [
                { role: "VP of Product", company: "Klarna", period: "2022–Now", bullets: ["Launched 4 new markets", "12-person PM org"] },
                { role: "Product Director", company: "Spotify", period: "2019–2022", bullets: ["Discovery features 200M+ users"] },
            ],
            skills: ["Product Strategy", "OKRs", "B2C Growth", "Data-Driven"],
        },
    },
    {
        id: "corporate-visual",
        category: "visual" as const,
        name: "Corporate",
        description: "Multi-column design for corporate roles",
        accent: "#b45309",
        bgColor: "bg-amber-50",
        isPro: true,
        style: "modern" as const,
        preview: {
            name: "James Whitfield",
            title: "Senior Financial Analyst",
            email: "james@finance.com",
            location: "Chicago, IL",
            summary: "CFA-certified analyst with 8+ years in M&A advisory.",
            experience: [
                { role: "Sr. Financial Analyst", company: "JP Morgan", period: "2020–Now", bullets: ["$800M M&A advisory", "Valuation modeling"] },
                { role: "Financial Analyst", company: "Deloitte", period: "2016–2020", bullets: ["Due diligence 15+ deals"] },
            ],
            skills: ["Financial Modeling", "M&A", "Excel", "Bloomberg"],
        },
    },
    {
        id: "jake-ats",
        category: "ats_safe" as const,
        name: "Jake's Resume",
        description: "Most-cloned ATS resume on GitHub",
        accent: "#0f172a",
        bgColor: "bg-slate-50",
        isPro: true,
        style: "minimalist" as const,
        preview: {
            name: "Alex Johnson",
            title: "Software Engineer",
            email: "alex@example.com",
            location: "Mountain View, CA",
            summary: "Full-stack engineer with experience at scale.",
            experience: [
                { role: "SWE II", company: "Google", period: "2022–Now", bullets: ["Ads serving infra", "20M QPS reliability"] },
                { role: "SWE I", company: "Meta", period: "2020–2022", bullets: ["React Native perf", "Hermes JS engine"] },
            ],
            skills: ["C++", "Python", "TypeScript", "React"],
        },
    },
    {
        id: "deedy-visual",
        category: "visual" as const,
        name: "Deedy",
        description: "Two-column layout loved by FAANG engineers",
        accent: "#be123c",
        bgColor: "bg-rose-50",
        isPro: true,
        style: "creative" as const,
        preview: {
            name: "Neha Kapoor",
            title: "Machine Learning Engineer",
            email: "neha@ml.ai",
            location: "San Francisco, CA",
            summary: "ML engineer building recommendation systems serving 500M+ users.",
            experience: [
                { role: "ML Engineer", company: "Netflix", period: "2022–Now", bullets: ["Recommendation engine rewrite", "+12% engagement"] },
                { role: "Research Scientist", company: "Stanford AI Lab", period: "2019–2022", bullets: ["NLP research, NeurIPS papers"] },
            ],
            skills: ["Python", "PyTorch", "TensorFlow", "MLflow"],
        },
    },
];

const styleComponents = {
    minimalist: MinimalistPreview,
    modern: ModernPreview,
    executive: ExecutivePreview,
    creative: CreativePreview,
};

interface TemplatePanelProps {
    isPro?: boolean;
    onProTemplateBlocked?: (templateName: string) => void;
}

export default function TemplatePanel({ isPro = false, onProTemplateBlocked }: TemplatePanelProps) {
    const { themeId, colorPaletteId, updateTheme, updateColorPalette } = useResumeStore();

    const handleTemplateClick = (tpl: typeof TEMPLATES[0]) => {
        updateTheme(tpl.id, tpl.category);
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

            {/* 2-column template grid with real mini-preview */}
            <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((tpl) => {
                    const isSelected = themeId === tpl.id;
                    const isLocked = tpl.isPro && !isPro;
                    const PreviewComp = styleComponents[tpl.style];

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
                                    <Lock className="w-2 h-2" />
                                    PRO
                                </span>
                            )}

                            {/* Selected check */}
                            {isSelected && (
                                <span className="absolute top-2 right-2 z-20 flex items-center gap-0.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                    <Check className="w-2 h-2" />
                                    {isLocked ? "Preview" : "Active"}
                                </span>
                            )}

                            {/* Mini CV preview — same style as gallery page */}
                            <div className={`w-full ${tpl.bgColor} relative overflow-hidden`} style={{ height: "140px" }}>
                                <div
                                    className="absolute inset-0 flex items-center justify-center"
                                    style={{ padding: "6px" }}
                                >
                                    <div
                                        className="w-full bg-white shadow-sm overflow-hidden"
                                        style={{
                                            height: "128px",
                                            transform: "scale(1)",
                                            transformOrigin: "top center",
                                        }}
                                    >
                                        <PreviewComp p={tpl.preview} accent={tpl.accent} />
                                    </div>
                                </div>

                                {/* Locked dim overlay */}
                                {isLocked && (
                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px] pointer-events-none z-10" />
                                )}
                            </div>

                            {/* Name + description below preview */}
                            <div className="p-2.5 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5">
                                <div className={`font-bold text-[12px] ${isLocked ? "text-gray-500 dark:text-zinc-400" : "text-gray-900 dark:text-white"}`}>
                                    {tpl.name}
                                </div>
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
                        className={`w-8 h-8 rounded-full border-2 transition-all
                            ${colorPaletteId === "default" ? "border-gray-800 dark:border-white scale-110" : "border-transparent hover:scale-105"}`}
                        style={{ background: "linear-gradient(135deg, #e2e8f0 50%, #94a3b8 50%)" }}
                        title="Default"
                    />
                    {COLOR_PALETTES.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => updateColorPalette(p.id)}
                            title={p.name}
                            className={`w-8 h-8 rounded-full border-2 transition-all
                                ${colorPaletteId === p.id ? "border-gray-800 dark:border-white scale-110 shadow-md" : "border-transparent hover:scale-105"}`}
                            style={{ backgroundColor: p.hex }}
                        />
                    ))}
                </div>
            </div>

            {/* Tip */}
            <div className="flex items-start gap-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl px-4 py-3">
                <span className="text-base">💡</span>
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                    You can change the template anytime. Your data will be preserved.
                </p>
            </div>
        </div>
    );
}
