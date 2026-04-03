"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Zap, ShieldCheck, Lock } from "lucide-react";
import { usePro } from "@/hooks/usePro";

/* ─── All 10 templates ─────────────────────────────────────────────────── */
const templates = [
    // ── Free ──
    {
        id: "clean-ats",
        name: "Minimalist",
        category: "ATS Safe",
        isProOnly: false,
        description: "Focuses on content with maximum readability for machine scanning.",
        tags: ["ATS Friendly", "Professional", "Clean"],
        color: "bg-slate-50",
        accent: "#2563eb",
        preview: {
            name: "Jordan Hayes",
            title: "Senior Software Engineer",
            email: "jordan@email.com",
            phone: "+1 (555) 012-3456",
            location: "San Francisco, CA",
            summary: "8+ years building scalable distributed systems. Led migration to microservices, reducing latency by 40%.",
            experience: [
                { role: "Sr. Software Engineer", company: "DataFlow Inc.", period: "2021–Present", bullets: ["Led team of 6 engineers", "Reduced API latency by 42%"] },
                { role: "Software Engineer", company: "Stripe", period: "2018–2021", bullets: ["Payments SDK development", "99.99% uptime SLA"] },
            ],
            skills: ["TypeScript", "Go", "Kubernetes", "PostgreSQL", "AWS"],
        },
        style: "minimalist",
    },
    {
        id: "startup-visual",
        name: "Modern",
        category: "Creative",
        isProOnly: false,
        description: "Clean sidebar layout with integrated photo support. Great for tech roles.",
        tags: ["Photo Support", "Sidebar", "Tech-Focused"],
        color: "bg-indigo-50",
        accent: "#6366f1",
        preview: {
            name: "Elena Voss",
            title: "Product Designer",
            email: "elena@design.io",
            phone: "+49 176 5512 3456",
            location: "Berlin, Germany",
            summary: "Crafting intuitive digital experiences for 6+ years. Delivered 20+ products from 0→1.",
            experience: [
                { role: "Lead Product Designer", company: "Framer", period: "2022–Present", bullets: ["End-to-end product design", "Design system owner"] },
                { role: "UX Designer", company: "N26", period: "2019–2022", bullets: ["Mobile banking UX", "A/B testing framework"] },
            ],
            skills: ["Figma", "Prototyping", "User Research", "Framer", "Webflow"],
        },
        style: "modern",
    },
    // ── Pro ──
    {
        id: "executive-ats",
        name: "Executive",
        category: "Corporate",
        isProOnly: false,
        description: "Sophisticated two-column layout for leadership and senior roles.",
        tags: ["Elegant", "Management", "Corporate"],
        color: "bg-zinc-50",
        accent: "#18181b",
        preview: {
            name: "Marcus A. Sterling",
            title: "Chief Operations Officer",
            email: "m.sterling@corp.com",
            phone: "+1 (212) 555-8800",
            location: "New York, NY",
            summary: "20+ years driving operational excellence across Fortune 500. $2.4B revenue portfolio.",
            experience: [
                { role: "COO", company: "Nexgen Capital", period: "2019–Present", bullets: ["$2.4B P&L oversight", "Scaled team 180→420"] },
                { role: "VP Operations", company: "Goldman Sachs", period: "2013–2019", bullets: ["Global ops transformation"] },
            ],
            skills: ["P&L Management", "M&A", "Strategic Planning", "Leadership"],
        },
        style: "executive",
    },
    {
        id: "creative-visual",
        name: "Creative",
        category: "Visual",
        isProOnly: false,
        description: "Bold design with unique visual flair for creative industries.",
        tags: ["Standout", "Portfolio", "Dynamic"],
        color: "bg-purple-50",
        accent: "#7c3aed",
        preview: {
            name: "Zara Chen",
            title: "Creative Director",
            email: "zara@studiozc.co",
            phone: "+44 7911 123456",
            location: "London, UK",
            summary: "Award-winning creative director. Cannes Lions shortlist 2023.",
            experience: [
                { role: "Creative Director", company: "IDEO London", period: "2021–Present", bullets: ["Brand identity for 30+ clients"] },
                { role: "Art Director", company: "Wieden+Kennedy", period: "2017–2021", bullets: ["Nike & Airbnb campaigns"] },
            ],
            skills: ["Brand Strategy", "Art Direction", "Motion Design", "Adobe CC"],
        },
        style: "creative",
    },
    // ── New 6 Pro Templates (based on open-source links) ──
    {
        id: "awesome-cv",
        name: "Awesome CV",
        category: "Visual",
        isProOnly: true,
        description: "Inspired by posquit0/Awesome-CV — 22k+ GitHub stars. Colored sidebar + white right column.",
        tags: ["22k★ GitHub", "Sidebar", "Colorful"],
        color: "bg-teal-50",
        accent: "#0d9488",
        preview: {
            name: "Jordan Hayes",
            title: "Senior Software Engineer",
            email: "jordan@email.com",
            phone: "+1 (555) 012-3456",
            location: "San Francisco, CA",
            summary: "8+ years building scalable distributed systems. Reduced latency by 40%.",
            experience: [
                { role: "Sr. Software Engineer", company: "DataFlow Inc.", period: "2021–Present", bullets: ["Led team of 6 engineers", "42% latency reduction"] },
            ],
            skills: ["TypeScript", "Go", "Kubernetes", "PostgreSQL"],
        },
        style: "awesomecv",
    },
    {
        id: "jake-resume",
        name: "Jake's Resume",
        category: "ATS Safe",
        isProOnly: true,
        description: "Inspired by jakegut/resume — most-cloned resume on GitHub. FAANG engineers' favorite.",
        tags: ["FAANG Favorite", "Single Page", "LaTeX-Style"],
        color: "bg-slate-100",
        accent: "#18181b",
        preview: {
            name: "Alex Johnson",
            title: "Software Engineer",
            email: "alex@example.com",
            phone: "+1 (512) 555-1234",
            location: "Mountain View, CA",
            summary: "Full-stack engineer with experience at scale. Google, Meta alumnus.",
            experience: [
                { role: "SWE II", company: "Google", period: "2022–Present", bullets: ["Ads serving infra, 20M QPS"] },
            ],
            skills: ["C++", "Python", "TypeScript", "React"],
        },
        style: "jake",
    },
    {
        id: "altacv",
        name: "AltaCV",
        category: "Visual",
        isProOnly: true,
        description: "Inspired by liantze/AltaCV — premium two-pane with signature colored dot bullets.",
        tags: ["Two Pane", "Dot Bullets", "Modern"],
        color: "bg-amber-50",
        accent: "#b45309",
        preview: {
            name: "Priya Sharma",
            title: "Senior Backend Engineer",
            email: "priya@dev.co",
            phone: "+1 (650) 555-3344",
            location: "Austin, TX",
            summary: "Polyglot engineer specializing in high-throughput data pipelines.",
            experience: [
                { role: "Sr. Backend Engineer", company: "Databricks", period: "2021–Present", bullets: ["Petabyte-scale processing"] },
            ],
            skills: ["Python", "Java", "Spark", "Kafka", "GCP"],
        },
        style: "altacv",
    },
    {
        id: "nextjs-resume",
        name: "NextJS Resume",
        category: "ATS Safe",
        isProOnly: true,
        description: "Inspired by ibelick/nextjs-resume — ultra-clean, modern web-native resume aesthetic.",
        tags: ["Minimal", "Web-Native", "Modern"],
        color: "bg-gray-50",
        accent: "#374151",
        preview: {
            name: "Sofia Andersen",
            title: "VP of Product",
            email: "sofia@product.se",
            phone: "+46 70 123 4567",
            location: "Stockholm, Sweden",
            summary: "Strategic product leader with 0-to-1 launches and $50M+ ARR products.",
            experience: [
                { role: "VP of Product", company: "Klarna", period: "2022–Present", bullets: ["Launched 4 new markets", "12-person PM org"] },
            ],
            skills: ["Product Strategy", "OKRs", "B2C", "Data-Driven"],
        },
        style: "nextjs",
    },
    {
        id: "rendercv-tech",
        name: "Tech Dense",
        category: "ATS Safe",
        isProOnly: true,
        description: "Inspired by rendercv/rendercv engineering theme — maximum density for SWE/ML roles.",
        tags: ["Info-Dense", "SWE/ML", "Monospace"],
        color: "bg-blue-50",
        accent: "#1d4ed8",
        preview: {
            name: "Kai Nakamura",
            title: "Engineering Manager",
            email: "kai@company.io",
            phone: "+1 (415) 555-7890",
            location: "Seattle, WA",
            summary: "Engineering leader with 10+ years in distributed systems. Scaled teams 5→50.",
            experience: [
                { role: "Engineering Manager", company: "Stripe", period: "2022–Present", bullets: ["Scaled platform 3x", "Zero-downtime migrations"] },
            ],
            skills: ["Go", "Rust", "Kubernetes", "gRPC"],
        },
        style: "rendercv",
    },
    {
        id: "reactive-resume",
        name: "Reactive",
        category: "Visual",
        isProOnly: true,
        description: "Inspired by amruthpillai/reactive-resume — card-based modern layout with top accent strip.",
        tags: ["Card-Based", "Modern", "Colorful"],
        color: "bg-violet-50",
        accent: "#7c3aed",
        preview: {
            name: "James Whitfield",
            title: "Senior Financial Analyst",
            email: "james@finance.com",
            phone: "+1 (312) 555-0099",
            location: "Chicago, IL",
            summary: "CFA-certified analyst with 8+ years in M&A advisory and financial modeling.",
            experience: [
                { role: "Sr. Financial Analyst", company: "JP Morgan", period: "2020–Present", bullets: ["$800M M&A advisory"] },
            ],
            skills: ["Financial Modeling", "M&A", "Excel", "Bloomberg", "CFA"],
        },
        style: "reactive",
    },

];

/* ─── CV Mini-preview components ──────────────────────────────────────── */
type PreviewData = typeof templates[0]["preview"];

function MinimalistPreview({ p, accent }: { p: PreviewData; accent: string }) {
    return (
        <div className="w-full h-full bg-white flex flex-col p-4 text-[4.5px] leading-tight font-sans overflow-hidden">
            <div className="mb-2 pb-1.5 border-b" style={{ borderColor: accent }}>
                <div className="font-bold text-[7px] text-zinc-900 tracking-tight">{p.name}</div>
                <div className="font-semibold text-[5px] mt-0.5" style={{ color: accent }}>{p.title}</div>
                <div className="flex gap-2 text-zinc-400 mt-0.5 text-[3.5px]">
                    <span>{p.email}</span><span>·</span><span>{p.location}</span>
                </div>
            </div>
            <div className="mb-1.5">
                <div className="font-bold text-[4.5px] uppercase tracking-widest mb-0.5 text-zinc-500">Summary</div>
                <div className="text-zinc-600 leading-relaxed text-[3.5px]">{p.summary}</div>
            </div>
            <div className="mb-1.5 flex-1">
                <div className="font-bold text-[4.5px] uppercase tracking-widest mb-0.5 text-zinc-500">Experience</div>
                {p.experience.map((exp, i) => (
                    <div key={i} className="mb-1">
                        <div className="flex justify-between">
                            <span className="font-bold text-[4px] text-zinc-900">{exp.role}</span>
                            <span className="text-zinc-400 text-[3.5px]">{exp.period}</span>
                        </div>
                        <div className="text-zinc-500 text-[3.5px] mb-0.5">{exp.company}</div>
                        {exp.bullets.map((b, j) => (
                            <div key={j} className="flex gap-0.5 text-[3.5px] text-zinc-600"><span className="text-zinc-400">•</span>{b}</div>
                        ))}
                    </div>
                ))}
            </div>
            <div>
                <div className="font-bold text-[4.5px] uppercase tracking-widest mb-0.5 text-zinc-500">Skills</div>
                <div className="flex flex-wrap gap-0.5">
                    {p.skills.map(s => (
                        <span key={s} className="bg-zinc-100 text-zinc-600 rounded-sm px-1 py-0.5 text-[3px]">{s}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ModernPreview({ p, accent }: { p: PreviewData; accent: string }) {
    return (
        <div className="w-full h-full flex overflow-hidden text-[4px] leading-tight font-sans">
            <div className="w-[36%] flex-shrink-0 flex flex-col p-3 text-white gap-2" style={{ backgroundColor: accent }}>
                <div className="w-8 h-8 rounded-full bg-white/20 mx-auto flex items-center justify-center text-[6px] font-bold text-white">
                    {p.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="text-center">
                    <div className="font-bold text-[5px] text-white leading-tight">{p.name}</div>
                    <div className="text-[3.5px] text-white/70 mt-0.5">{p.title}</div>
                </div>
                <div className="border-t border-white/20 pt-1.5 space-y-0.5">
                    <div className="text-[3.5px] text-white/60 font-bold uppercase tracking-widest">Contact</div>
                    <div className="text-[3.5px] text-white/80">{p.email}</div>
                    <div className="text-[3.5px] text-white/80">{p.location}</div>
                </div>
                <div className="border-t border-white/20 pt-1.5">
                    <div className="text-[3.5px] text-white/60 font-bold uppercase tracking-widest mb-1">Skills</div>
                    <div className="flex flex-col gap-0.5">
                        {p.skills.map(s => (
                            <div key={s} className="flex items-center gap-0.5">
                                <div className="h-0.5 rounded-full bg-white/30 flex-1">
                                    <div className="h-0.5 rounded-full bg-white" style={{ width: "70%" }} />
                                </div>
                                <span className="text-[3px] text-white/70 w-8 truncate">{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 p-3 flex flex-col gap-1.5 bg-white overflow-hidden">
                <div>
                    <div className="font-bold text-[4px] uppercase tracking-widest text-zinc-400 mb-0.5">Profile</div>
                    <div className="text-[3.5px] text-zinc-600 leading-relaxed">{p.summary}</div>
                </div>
                <div className="flex-1">
                    <div className="font-bold text-[4px] uppercase tracking-widest text-zinc-400 mb-0.5">Experience</div>
                    {p.experience.map((exp, i) => (
                        <div key={i} className="mb-1">
                            <div className="flex justify-between items-baseline">
                                <span className="font-bold text-[4px] text-zinc-900">{exp.role}</span>
                                <span className="text-zinc-400 text-[3px]">{exp.period}</span>
                            </div>
                            <div className="font-semibold text-[3.5px] mb-0.5" style={{ color: accent }}>{exp.company}</div>
                            {exp.bullets.map((b, j) => (
                                <div key={j} className="flex gap-0.5 text-[3.5px] text-zinc-500"><span style={{ color: accent }}>▸</span>{b}</div>
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
        <div className="w-full h-full bg-white flex flex-col p-4 overflow-hidden" style={{ fontFamily: "Georgia, serif" }}>
            <div className="text-center mb-2 pb-1.5" style={{ borderBottom: `2px solid ${accent}` }}>
                <div className="font-bold text-[8px] tracking-widest uppercase text-zinc-900">{p.name}</div>
                <div className="text-[5px] italic text-zinc-500 mt-0.5">{p.title}</div>
                <div className="flex justify-center gap-2 text-[3.5px] text-zinc-400 mt-0.5">
                    <span>{p.email}</span><span>·</span><span>{p.location}</span>
                </div>
            </div>
            <div className="mb-2">
                <div className="text-[4.5px] font-bold uppercase tracking-widest text-center mb-1" style={{ color: accent }}>Executive Summary</div>
                <div className="text-[3.5px] text-zinc-600 text-center italic leading-relaxed">{p.summary}</div>
            </div>
            <div className="flex-1">
                <div className="text-[4.5px] font-bold uppercase tracking-widest text-center mb-1" style={{ color: accent }}>Professional Experience</div>
                {p.experience.map((exp, i) => (
                    <div key={i} className="mb-1.5">
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold text-[4.5px] text-zinc-900">{exp.role}</span>
                            <span className="text-zinc-400 text-[3.5px] italic">{exp.period}</span>
                        </div>
                        <div className="text-zinc-500 text-[3.5px] italic mb-0.5">{exp.company}</div>
                        {exp.bullets.map((b, j) => (
                            <div key={j} className="flex gap-0.5 text-[3.5px] text-zinc-600"><span className="text-zinc-400">—</span>{b}</div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="pt-1" style={{ borderTop: `1px solid ${accent}` }}>
                <div className="text-[4px] font-bold uppercase tracking-widest text-center mb-0.5" style={{ color: accent }}>Core Competencies</div>
                <div className="flex justify-center flex-wrap gap-1">
                    {p.skills.map(s => <span key={s} className="text-[3px] text-zinc-500">{s}</span>)}
                </div>
            </div>
        </div>
    );
}

function CreativePreview({ p, accent }: { p: PreviewData; accent: string }) {
    return (
        <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: `linear-gradient(135deg, ${accent}15 0%, white 50%)` }}>
            <div className="px-3 py-2 relative" style={{ backgroundColor: accent }}>
                <div className="font-black text-[8px] text-white tracking-tight leading-none">{p.name}</div>
                <div className="text-white/70 text-[4px] mt-0.5 font-medium uppercase tracking-widest">{p.title}</div>
                <div className="absolute top-1 right-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-white text-[5px] font-black">{p.name.charAt(0)}</span>
                </div>
            </div>
            <div className="flex-1 p-3 flex gap-2 overflow-hidden">
                <div className="w-[38%] flex flex-col gap-1.5">
                    <div>
                        <div className="text-[3.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>About</div>
                        <div className="text-[3.5px] text-zinc-600 leading-relaxed">{p.summary}</div>
                    </div>
                    <div>
                        <div className="text-[3.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Toolkit</div>
                        <div className="flex flex-col gap-0.5">
                            {p.skills.map(s => (
                                <div key={s} className="flex items-center gap-0.5">
                                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                                    <span className="text-[3px] text-zinc-600">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                    <div className="text-[3.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Experience</div>
                    {p.experience.map((exp, i) => (
                        <div key={i} className="rounded-[2px] p-1.5 mb-0.5" style={{ backgroundColor: `${accent}10`, borderLeft: `2px solid ${accent}` }}>
                            <div className="font-bold text-[4px] text-zinc-900">{exp.role}</div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[3.5px] font-semibold" style={{ color: accent }}>{exp.company}</span>
                                <span className="text-zinc-400 text-[3px]">{exp.period}</span>
                            </div>
                            {exp.bullets.map((b, j) => (
                                <div key={j} className="flex gap-0.5 text-[3.5px] text-zinc-500 mt-0.5"><span style={{ color: accent }}>✦</span>{b}</div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AwesomeCVPreview({ p, accent }: { p: PreviewData; accent: string }) {
    return (
        <div className="w-full h-full flex overflow-hidden">
            <div className="w-[30%] flex flex-col p-2 text-white" style={{ backgroundColor: accent }}>
                <div className="w-7 h-7 rounded-full bg-white/20 mx-auto mb-1.5 flex items-center justify-center text-[7px] font-black">{p.name.charAt(0)}</div>
                <div className="text-[2.5px] text-white/50 font-black uppercase tracking-widest mb-0.5">Contact</div>
                <div className="text-[2.5px] text-white/80 space-y-0.5 mb-1"><div>{p.email}</div><div>{p.location}</div></div>
                <div className="text-[2.5px] text-white/50 font-black uppercase tracking-widest mb-0.5">Skills</div>
                {p.skills.slice(0, 5).map(s => <div key={s} className="flex items-center gap-0.5 mb-0.5"><span className="w-0.5 h-0.5 rounded-full bg-white/50 shrink-0" /><span className="text-[2.5px] text-white/80">{s}</span></div>)}
            </div>
            <div className="flex-1 bg-white p-2">
                <div className="border-b-2 pb-1 mb-1" style={{ borderColor: accent }}>
                    <div className="font-black text-[5.5px] uppercase tracking-widest text-zinc-900">{p.name}</div>
                    <div className="font-bold text-[3px] uppercase" style={{ color: accent }}>{p.title}</div>
                </div>
                <div className="text-[2.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Experience</div>
                {p.experience.map((exp, i) => (<div key={i} className="mb-0.5"><div className="font-black text-[3px] text-zinc-900">{exp.role}</div><div className="text-[2.5px] font-bold uppercase" style={{ color: accent }}>{exp.company}</div></div>))}
            </div>
        </div>
    );
}

function JakeResumePreview({ p }: { p: PreviewData; accent: string }) {
    return (
        <div className="w-full h-full bg-white p-3 font-serif overflow-hidden">
            <div className="text-center mb-1">
                <div className="font-black text-[7px] text-zinc-900">{p.name}</div>
                <div className="flex justify-center flex-wrap gap-1 text-[3px] text-zinc-600 mt-0.5"><span>{p.email}</span><span>·</span><span>{p.location}</span></div>
            </div>
            <div className="border-t border-zinc-900 mb-1.5" />
            <div className="mb-1"><div className="font-black text-[4px] uppercase text-zinc-900 mb-0.5">Education</div><div className="border-t border-zinc-900 mb-0.5" /></div>
            <div className="mb-1"><div className="font-black text-[4px] uppercase text-zinc-900 mb-0.5">Experience</div><div className="border-t border-zinc-900 mb-1" />
                {p.experience.map((exp, i) => (<div key={i} className="mb-0.5"><div className="flex justify-between"><span className="font-bold text-[3.5px] text-zinc-900">{exp.role}</span><span className="text-[3px] text-zinc-600">{exp.period}</span></div><div className="text-[3px] text-zinc-600 italic">{exp.company}</div></div>))}
            </div>
            <div><div className="font-black text-[4px] uppercase text-zinc-900 mb-0.5">Technical Skills</div><div className="border-t border-zinc-900 mb-0.5" /><div className="text-[3px] text-zinc-700"><span className="font-bold">Languages:</span> {p.skills.join(', ')}</div></div>
        </div>
    );
}

function AltaCVPreview({ p, accent }: { p: PreviewData; accent: string }) {
    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="px-3 py-1.5" style={{ backgroundColor: accent }}>
                <div className="font-black text-[7px] text-white">{p.name}</div>
                <div className="text-[3.5px] text-white/75">{p.title}</div>
            </div>
            <div className="flex flex-1">
                <div className="w-[35%] bg-zinc-50 p-2">
                    <div className="text-[2.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Contact</div>
                    {[p.email, p.location].map(s => <div key={s} className="flex items-center gap-0.5 mb-0.5"><span className="w-0.5 h-0.5 rounded-full shrink-0" style={{ backgroundColor: accent }} /><span className="text-[2.5px] text-zinc-600">{s}</span></div>)}
                    <div className="text-[2.5px] font-black uppercase tracking-widest mt-1 mb-0.5" style={{ color: accent }}>Skills</div>
                    {p.skills.slice(0, 4).map(s => <div key={s} className="flex items-center gap-0.5 mb-0.5"><span className="w-0.5 h-0.5 rounded-full shrink-0" style={{ backgroundColor: accent }} /><span className="text-[2.5px] text-zinc-600">{s}</span></div>)}
                </div>
                <div className="flex-1 p-2">
                    <div className="flex items-center gap-0.5 mb-0.5"><span className="w-2 h-0.5" style={{ backgroundColor: accent }} /><span className="text-[3px] font-black uppercase" style={{ color: accent }}>Experience</span></div>
                    {p.experience.map((exp, i) => (<div key={i} className="mb-1 pl-1" style={{ borderLeft: `1.5px solid ${accent}33` }}><div className="font-bold text-[3.5px] text-zinc-900">{exp.role}</div><div className="text-[3px]" style={{ color: accent }}>{exp.company}</div></div>))}
                </div>
            </div>
        </div>
    );
}

function NextjsResumePreview({ p }: { p: PreviewData; accent: string }) {
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

function RenderCVTechPreview({ p, accent }: { p: PreviewData; accent: string }) {
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
            {p.experience.map((exp, i) => (<div key={i} className="mb-0.5"><div className="flex justify-between"><span className="font-black text-[3.5px] text-zinc-900">{exp.role}</span><span className="text-[3px] text-zinc-400 font-mono">{exp.period}</span></div><div className="font-bold text-[3px]" style={{ color: accent }}>{exp.company}</div></div>))}
        </div>
    );
}

function ReactiveResumePreview({ p, accent }: { p: PreviewData; accent: string }) {
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
                    <div className="bg-white rounded p-1 shadow-sm"><div className="text-[2.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>About</div><div className="text-[2.5px] text-zinc-600">{p.summary}</div></div>
                    <div className="bg-white rounded p-1 shadow-sm"><div className="text-[2.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Skills</div><div className="flex flex-wrap gap-0.5">{p.skills.slice(0, 4).map(s => <span key={s} className="text-[2px] px-0.5 py-0 text-white rounded" style={{ backgroundColor: accent }}>{s}</span>)}</div></div>
                </div>
                <div className="flex-1 bg-white rounded p-1 shadow-sm">
                    <div className="text-[2.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Experience</div>
                    {p.experience.map((exp, i) => (<div key={i} className="mb-0.5 pl-0.5" style={{ borderLeft: `1px solid ${accent}` }}><div className="font-black text-[3px] text-zinc-900">{exp.role}</div><div className="text-[2.5px] font-bold" style={{ color: accent }}>{exp.company}</div></div>))}
                </div>
            </div>
        </div>
    );
}

const previewMap: Record<string, React.FC<{ p: PreviewData; accent: string }>> = {
    minimalist: MinimalistPreview,
    modern: ModernPreview,
    executive: ExecutivePreview,
    creative: CreativePreview,
    awesomecv: AwesomeCVPreview,
    jake: JakeResumePreview,
    altacv: AltaCVPreview,
    nextjs: NextjsResumePreview,
    rendercv: RenderCVTechPreview,
    reactive: ReactiveResumePreview,
};


export default function TemplatesPage() {
    const { isPro, isLoading } = usePro();

    return (
        <div className="min-h-screen bg-white text-zinc-900 pt-32 pb-24 px-6 flex flex-col selection:bg-blue-500/30">
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 px-6 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
                <Link className="flex items-center gap-2 group" href="/">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 transition-transform group-hover:scale-110 shadow-lg shadow-blue-600/20">
                        <Zap className="h-5 w-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-zinc-900">CV Optimizer AI</span>
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
                <div className="text-center mb-16 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                        The Only <span className="text-blue-600">Templates</span> You&apos;ll Need
                    </h1>
                    <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        10 industry-tested layouts designed by experts. 8 exclusive Pro templates, 2 always free.
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
                    {templates.map((tpl) => {
                        const PreviewComponent = previewMap[tpl.style];
                        const isLocked = tpl.isProOnly && !isPro;
                        return (
                            <div key={tpl.id} className="group relative bg-white rounded-3xl overflow-hidden border border-zinc-200 flex flex-col hover:border-blue-400 hover:shadow-2xl transition-all duration-500">

                                {/* PRO badge top-left on gallery card */}
                                {tpl.isProOnly && (
                                    <div className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg shadow-blue-600/30">
                                        <Lock className="w-2.5 h-2.5" />
                                        PRO
                                    </div>
                                )}

                                {/* CV Preview area */}
                                <div className={`aspect-[3/4] ${tpl.color} w-full relative flex items-center justify-center overflow-hidden border-b border-zinc-100`}>
                                    <div className="w-[88%] aspect-[1/1.414] bg-white shadow-xl rounded-[2px] overflow-hidden transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-1 relative z-10">
                                        <PreviewComponent p={tpl.preview} accent={tpl.accent} />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
                                        {isLocked ? (
                                            <Link href="/upgrade">
                                                <Button size="lg" className="h-11 px-7 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-sm">
                                                    Upgrade to Get This
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link href="/signup">
                                                <Button size="lg" className="h-11 px-7 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-sm">
                                                    Use {tpl.name}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-bold text-zinc-900">{tpl.name}</h3>
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-zinc-200">
                                            {tpl.category}
                                        </Badge>
                                    </div>
                                    <p className="text-zinc-500 mb-4 text-sm font-medium leading-relaxed">{tpl.description}</p>
                                    <div className="mt-auto flex flex-wrap gap-1.5">
                                        {tpl.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500">
                                                {tag}
                                            </span>
                                        ))}
                                        {tpl.isProOnly && (
                                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                                                Pro Only
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Upgrade CTA for non-Pro users */}
                {!isLoading && !isPro && (
                    <div className="mt-16 text-center py-10 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100">
                        <div className="inline-flex items-center gap-2 text-blue-600 font-black text-[11px] uppercase tracking-wider bg-blue-100 px-3 py-1.5 rounded-full mb-4">
                            <Lock className="w-3 h-3" /> 8 Pro Templates Included
                        </div>
                        <h2 className="text-2xl font-extrabold text-zinc-900 mb-2">Unlock Every Premium Template</h2>
                        <p className="text-zinc-500 font-medium mb-6 max-w-md mx-auto">Get all 10 templates + unlimited CVs, no watermarks, and branded links — for just $2.75/month.</p>
                        <Link href="/upgrade">
                            <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-[15px] shadow-xl shadow-blue-500/20 hover:from-blue-500 hover:to-blue-600 transition-all hover:scale-[1.02]">
                                Upgrade to Pro — $99 once
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="mt-12 text-center py-8">
                    <div className="inline-flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-[10px] bg-zinc-50 px-4 py-2 rounded-full border border-zinc-200">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> 100% Recruiter Approved
                    </div>
                </div>
            </div>
        </div>
    );
}
