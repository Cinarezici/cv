import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Zap, Check, ShieldCheck, Star } from "lucide-react";

const templates = [
    {
        id: "clean-ats",
        name: "Minimalist",
        category: "ATS Safe",
        emoji: "✏️",
        description: "Focuses on content with maximum readability for machine scanning.",
        tags: ["ATS Friendly", "Professional", "Clean"],
        color: "bg-blue-900/10"
    },
    {
        id: "startup-visual",
        name: "Modern",
        category: "Creative",
        emoji: "🎨",
        description: "Features a clean sidebar layout with integrated photo support.",
        tags: ["Photo Support", "Sidebar", "Tech-Focused"],
        color: "bg-indigo-900/10"
    },
    {
        id: "executive-ats",
        name: "Executive",
        category: "Corporate",
        emoji: "💼",
        description: "Sophisticated serif typography for leadership and traditional roles.",
        tags: ["Elegant", "Management", "Traditional"],
        color: "bg-slate-900/10"
    },
    {
        id: "creative-visual",
        name: "Creative",
        category: "Visual",
        emoji: "✨",
        description: "Bold design with unique visual flair for creative industries.",
        tags: ["Standout", "Portfolio", "Dynamic"],
        color: "bg-purple-900/10"
    }
];

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white pt-32 pb-24 px-6 flex flex-col selection:bg-blue-500/30">
            {/* Header consistent with Landing Page */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 px-6 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
                <Link className="flex items-center gap-2 group" href="/">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 transition-transform group-hover:scale-110 shadow-lg shadow-blue-600/20">
                        <Zap className="h-5 w-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Interview-Ready CV</span>
                </Link>
                <nav className="ml-auto hidden md:flex gap-8 items-center text-sm font-medium text-white/60">
                    <Link className="text-white bg-white/5 px-4 py-1.5 rounded-lg" href="/templates">Templates</Link>
                    <Link className="hover:text-white transition-colors" href="/pricing">Pricing</Link>
                    <Link className="hover:text-white transition-colors" href="/login">Login</Link>
                    <Link href="/signup">
                        <Button className="bg-white text-[#020617] hover:bg-white/90 font-bold rounded-xl px-6">
                            Get Started
                        </Button>
                    </Link>
                </nav>
            </header>

            <div className="max-w-7xl mx-auto flex-1 w-full relative">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="text-center mb-20 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
                        <Star className="h-3 w-3" /> Premium Builder Layouts
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8">
                        The Only <span className="text-blue-400">Templates</span> You'll Ever Need
                    </h1>
                    <p className="text-xl text-white/50 max-w-3xl mx-auto leading-relaxed">
                        Industry-tested layouts designed by recruitment experts. Our templates are guaranteed to be 100% ATS-compliant and recruiter-friendly.
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="grid md:grid-cols-2 gap-10 relative z-10">
                    {templates.map((tpl) => (
                        <div key={tpl.id} className="group relative bg-white/5 rounded-[40px] overflow-hidden border border-white/10 flex flex-col hover:border-blue-500/50 hover:bg-white/[0.07] transition-all duration-500 shadow-2xl">

                            {/* Preview image Simulation */}
                            <div className={`aspect-[16/10] ${tpl.color} w-full relative p-12 flex items-center justify-center overflow-hidden border-b border-white/5`}>
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Fake Document Shape */}
                                <div className="w-[80%] aspect-[1/1.414] bg-white shadow-2xl rounded-sm flex flex-col p-6 gap-3 transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-2">
                                    <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                                    <div className="h-2 w-1/3 bg-slate-50 rounded mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-1.5 w-full bg-slate-50 rounded"></div>
                                        <div className="h-1.5 w-[90%] bg-slate-50 rounded"></div>
                                        <div className="h-1.5 w-[95%] bg-slate-50 rounded"></div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-50 flex gap-4">
                                        <div className="h-20 w-1/3 bg-slate-50 rounded"></div>
                                        <div className="h-20 flex-1 bg-slate-50 rounded"></div>
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-[#020617]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <Link href="/signup">
                                        <Button size="lg" className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-white/90 font-black shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                                            Start with {tpl.name}
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-10 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-3xl">{tpl.emoji}</span>
                                            <h3 className="text-3xl font-extrabold text-white">{tpl.name}</h3>
                                        </div>
                                        <p className="text-blue-400 font-bold text-xs uppercase tracking-widest">{tpl.category}</p>
                                    </div>
                                    <Badge className="bg-white/10 text-white border-white/5 hover:bg-white/20">Standard</Badge>
                                </div>

                                <p className="text-white/50 mb-8 text-lg leading-relaxed">{tpl.description}</p>

                                <div className="mt-auto pt-6 flex flex-wrap gap-2 border-t border-white/5">
                                    {tpl.tags.map(tag => (
                                        <span key={tag} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/5 text-white/60">
                                            <Check className="h-3 w-3 text-blue-500" /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Footer */}
                <div className="mt-32 text-center py-12 border-t border-white/5">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-white/30 font-bold uppercase tracking-widest text-xs">
                            <ShieldCheck className="h-4 w-4" /> 100% Guaranteed Outcome
                        </div>
                        <p className="text-white/20 text-sm max-w-sm">Every template is handcrafted to pass modern Applicant Tracking Systems with ease.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
