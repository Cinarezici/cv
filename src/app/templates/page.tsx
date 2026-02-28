import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Zap, ShieldCheck } from "lucide-react";

/* ─── Fictional sample data for each template ─────────────────────────── */
const templates = [
    {
        id: "clean-ats",
        name: "Minimalist",
        category: "ATS Safe",
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
                { role: "Sr. Software Engineer", company: "DataFlow Inc.", period: "2021–Present", bullets: ["Led team of 6 engineers", "Reduced API latency by 42%", "Built real-time pipelines"] },
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
                { role: "Lead Product Designer", company: "Framer", period: "2022–Present", bullets: ["End-to-end product design", "Design system owner", "User research lead"] },
                { role: "UX Designer", company: "N26", period: "2019–2022", bullets: ["Mobile banking UX", "A/B testing framework"] },
            ],
            skills: ["Figma", "Prototyping", "User Research", "Framer", "Webflow"],
        },
        style: "modern",
    },
    {
        id: "executive-ats",
        name: "Executive",
        category: "Corporate",
        description: "Sophisticated serif typography for leadership and traditional roles.",
        tags: ["Elegant", "Management", "Traditional"],
        color: "bg-zinc-50",
        accent: "#18181b",
        preview: {
            name: "Marcus A. Sterling",
            title: "Chief Operations Officer",
            email: "m.sterling@corp.com",
            phone: "+1 (212) 555-8800",
            location: "New York, NY",
            summary: "20+ years driving operational excellence and P&L ownership across Fortune 500 companies. $2.4B revenue portfolio.",
            experience: [
                { role: "COO", company: "Nexgen Capital", period: "2019–Present", bullets: ["$2.4B P&L oversight", "Scaled team 180→420", "M&A integration x3"] },
                { role: "VP Operations", company: "Goldman Sachs", period: "2013–2019", bullets: ["Global ops transformation", "Risk framework design"] },
            ],
            skills: ["P&L Management", "M&A", "Strategic Planning", "Operations", "Leadership"],
        },
        style: "executive",
    },
    {
        id: "creative-visual",
        name: "Creative",
        category: "Visual",
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
            summary: "Award-winning creative director blending brand strategy with visual storytelling. Cannes Lions shortlist 2023.",
            experience: [
                { role: "Creative Director", company: "IDEO London", period: "2021–Present", bullets: ["Brand identity for 30+ clients", "Cannes Lions shortlist", "15-person creative team"] },
                { role: "Art Director", company: "Wieden+Kennedy", period: "2017–2021", bullets: ["Nike & Airbnb campaigns", "D&AD Yellow Pencil"] },
            ],
            skills: ["Brand Strategy", "Art Direction", "Motion Design", "Illustration", "Adobe CC"],
        },
        style: "creative",
    },
];

/* ─── CV Mini-preview components for each style ───────────────────────── */

function MinimalistPreview({ p, accent }: { p: typeof templates[0]["preview"]; accent: string }) {
    return (
        <div className="w-full h-full bg-white flex flex-col p-4 text-[4.5px] leading-tight font-sans overflow-hidden">
            {/* Header */}
            <div className="mb-2 pb-1.5 border-b" style={{ borderColor: accent }}>
                <div className="font-bold text-[7px] text-zinc-900 tracking-tight">{p.name}</div>
                <div className="font-semibold text-[5px] mt-0.5" style={{ color: accent }}>{p.title}</div>
                <div className="flex gap-2 text-zinc-400 mt-0.5 text-[3.5px]">
                    <span>{p.email}</span><span>·</span><span>{p.location}</span>
                </div>
            </div>
            {/* Summary */}
            <div className="mb-1.5">
                <div className="font-bold text-[4.5px] uppercase tracking-widest mb-0.5 text-zinc-500">Summary</div>
                <div className="text-zinc-600 leading-relaxed text-[3.5px]">{p.summary}</div>
            </div>
            {/* Experience */}
            <div className="mb-1.5 flex-1">
                <div className="font-bold text-[4.5px] uppercase tracking-widest mb-0.5 text-zinc-500">Experience</div>
                {p.experience.map((exp, i) => (
                    <div key={i} className="mb-1">
                        <div className="flex justify-between">
                            <span className="font-bold text-[4px] text-zinc-900">{exp.role}</span>
                            <span className="text-zinc-400 text-[3.5px]">{exp.period}</span>
                        </div>
                        <div className="text-zinc-500 text-[3.5px] mb-0.5">{exp.company}</div>
                        {exp.bullets.slice(0, 2).map((b, j) => (
                            <div key={j} className="flex gap-0.5 text-[3.5px] text-zinc-600"><span className="text-zinc-400">•</span>{b}</div>
                        ))}
                    </div>
                ))}
            </div>
            {/* Skills */}
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

function ModernPreview({ p, accent }: { p: typeof templates[0]["preview"]; accent: string }) {
    return (
        <div className="w-full h-full flex overflow-hidden text-[4px] leading-tight font-sans">
            {/* Sidebar */}
            <div className="w-[36%] flex-shrink-0 flex flex-col p-3 text-white gap-2" style={{ backgroundColor: accent }}>
                {/* Avatar placeholder */}
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
                                    <div className="h-0.5 rounded-full bg-white" style={{ width: `${65 + Math.floor(Math.random() * 30)}%` }} />
                                </div>
                                <span className="text-[3px] text-white/70 w-8 truncate">{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Main */}
            <div className="flex-1 p-3 flex flex-col gap-1.5 bg-white overflow-hidden">
                <div>
                    <div className="font-bold text-[4px] uppercase tracking-widest text-zinc-400 mb-0.5">Profile</div>
                    <div className="text-[3.5px] text-zinc-600 leading-relaxed">{p.summary}</div>
                </div>
                <div className="flex-1">
                    <div className="font-bold text-[4px] uppercase tracking-widest text-zinc-400 mb-0.5">Work Experience</div>
                    {p.experience.map((exp, i) => (
                        <div key={i} className="mb-1">
                            <div className="flex justify-between items-baseline">
                                <span className="font-bold text-[4px] text-zinc-900">{exp.role}</span>
                                <span className="text-zinc-400 text-[3px]">{exp.period}</span>
                            </div>
                            <div className="font-semibold text-[3.5px] mb-0.5" style={{ color: accent }}>{exp.company}</div>
                            {exp.bullets.slice(0, 2).map((b, j) => (
                                <div key={j} className="flex gap-0.5 text-[3.5px] text-zinc-500"><span style={{ color: accent }}>▸</span>{b}</div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ExecutivePreview({ p, accent }: { p: typeof templates[0]["preview"]; accent: string }) {
    return (
        <div className="w-full h-full bg-white flex flex-col p-4 overflow-hidden" style={{ fontFamily: "Georgia, serif" }}>
            {/* Monogram header */}
            <div className="text-center mb-2 pb-1.5" style={{ borderBottom: `2px solid ${accent}` }}>
                <div className="font-bold text-[8px] tracking-widest uppercase text-zinc-900">{p.name}</div>
                <div className="text-[5px] italic text-zinc-500 mt-0.5">{p.title}</div>
                <div className="flex justify-center gap-2 text-[3.5px] text-zinc-400 mt-0.5">
                    <span>{p.email}</span><span>·</span><span>{p.location}</span>
                </div>
            </div>
            {/* Summary */}
            <div className="mb-2">
                <div className="text-[4.5px] font-bold uppercase tracking-widest text-center mb-1" style={{ color: accent }}>Executive Summary</div>
                <div className="text-[3.5px] text-zinc-600 text-center italic leading-relaxed">{p.summary}</div>
            </div>
            {/* Experience */}
            <div className="flex-1">
                <div className="text-[4.5px] font-bold uppercase tracking-widest text-center mb-1" style={{ color: accent }}>Professional Experience</div>
                {p.experience.map((exp, i) => (
                    <div key={i} className="mb-1.5">
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold text-[4.5px] text-zinc-900">{exp.role}</span>
                            <span className="text-zinc-400 text-[3.5px] italic">{exp.period}</span>
                        </div>
                        <div className="text-zinc-500 text-[3.5px] italic mb-0.5">{exp.company}</div>
                        {exp.bullets.slice(0, 2).map((b, j) => (
                            <div key={j} className="flex gap-0.5 text-[3.5px] text-zinc-600"><span className="text-zinc-400">—</span>{b}</div>
                        ))}
                    </div>
                ))}
            </div>
            {/* Core Competencies */}
            <div className="pt-1" style={{ borderTop: `1px solid ${accent}` }}>
                <div className="text-[4px] font-bold uppercase tracking-widest text-center mb-0.5" style={{ color: accent }}>Core Competencies</div>
                <div className="flex justify-center flex-wrap gap-1">
                    {p.skills.map(s => <span key={s} className="text-[3px] text-zinc-500">{s}</span>)}
                </div>
            </div>
        </div>
    );
}

function CreativePreview({ p, accent }: { p: typeof templates[0]["preview"]; accent: string }) {
    return (
        <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: `linear-gradient(135deg, ${accent}15 0%, white 50%)` }}>
            {/* Bold top bar */}
            <div className="px-3 py-2 relative" style={{ backgroundColor: accent }}>
                <div className="font-black text-[8px] text-white tracking-tight leading-none">{p.name}</div>
                <div className="text-white/70 text-[4px] mt-0.5 font-medium uppercase tracking-widest">{p.title}</div>
                <div className="absolute top-1 right-2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-white text-[5px] font-black">{p.name.charAt(0)}</span>
                </div>
            </div>
            {/* Content */}
            <div className="flex-1 p-3 flex gap-2 overflow-hidden">
                {/* Left: summary + skills */}
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
                {/* Right: experience */}
                <div className="flex-1 flex flex-col gap-1">
                    <div className="text-[3.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: accent }}>Experience</div>
                    {p.experience.map((exp, i) => (
                        <div key={i} className="rounded-[2px] p-1.5 mb-0.5" style={{ backgroundColor: `${accent}10`, borderLeft: `2px solid ${accent}` }}>
                            <div className="font-bold text-[4px] text-zinc-900">{exp.role}</div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[3.5px] font-semibold" style={{ color: accent }}>{exp.company}</span>
                                <span className="text-zinc-400 text-[3px]">{exp.period}</span>
                            </div>
                            {exp.bullets.slice(0, 2).map((b, j) => (
                                <div key={j} className="flex gap-0.5 text-[3.5px] text-zinc-500 mt-0.5"><span style={{ color: accent }}>✦</span>{b}</div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const previewMap: Record<string, React.FC<{ p: typeof templates[0]["preview"]; accent: string }>> = {
    minimalist: MinimalistPreview,
    modern: ModernPreview,
    executive: ExecutivePreview,
    creative: CreativePreview,
};

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 pt-32 pb-24 px-6 flex flex-col selection:bg-blue-500/30">
            {/* Header consistent with Landing Page */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 px-6 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
                <Link className="flex items-center gap-2 group" href="/">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 transition-transform group-hover:scale-110 shadow-lg shadow-blue-600/20">
                        <Zap className="h-5 w-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-zinc-900">CV Optimizer</span>
                </Link>
                <nav className="ml-auto hidden md:flex gap-8 items-center text-sm font-bold text-zinc-500">
                    <Link className="hover:text-blue-600 transition-colors" href="/templates">Templates</Link>
                    <Link className="hover:text-blue-600 transition-colors" href="/#pricing">Pricing</Link>
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
                        Industry-tested layouts designed by experts, guaranteed to be 100% ATS-compliant.
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    {templates.map((tpl) => {
                        const PreviewComponent = previewMap[tpl.style];
                        return (
                            <div key={tpl.id} className="group relative bg-white rounded-3xl overflow-hidden border border-zinc-200 flex flex-col hover:border-blue-400 hover:shadow-2xl transition-all duration-500">

                                {/* CV Preview area */}
                                <div className={`aspect-[3/4] ${tpl.color} w-full relative flex items-center justify-center overflow-hidden border-b border-zinc-100`}>
                                    {/* Actual CV mini-preview */}
                                    <div className="w-[88%] aspect-[1/1.414] bg-white shadow-xl rounded-[2px] overflow-hidden transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-1 relative z-10">
                                        <PreviewComponent p={tpl.preview} accent={tpl.accent} />
                                    </div>
                                    {/* Subtle gradient glow on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
                                        <Link href="/signup">
                                            <Button size="lg" className="h-11 px-7 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-sm">
                                                Use {tpl.name}
                                            </Button>
                                        </Link>
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
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer note */}
                <div className="mt-24 text-center py-12">
                    <div className="inline-flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-[10px] bg-zinc-50 px-4 py-2 rounded-full border border-zinc-200">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> 100% Recruiter Approved
                    </div>
                </div>
            </div>
        </div>
    );
}
