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
                        The Only <span className="text-blue-600">Templates</span> You'll Need
                    </h1>
                    <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Industry-tested layouts designed by experts, guaranteed to be 100% ATS-compliant.
                    </p>
                </div>

                {/* Templates Grid - Compact 3-column */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {templates.map((tpl) => (
                        <div key={tpl.id} className="group relative bg-white rounded-3xl overflow-hidden border border-zinc-200 flex flex-col hover:border-blue-400 hover:shadow-2xl transition-all duration-500">

                            {/* Smaller Preview area */}
                            <div className={`aspect-[4/3] ${tpl.color} w-full relative p-8 flex items-center justify-center overflow-hidden border-b border-zinc-100`}>
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                {/* Refined Fake Document Shape */}
                                <div className="w-[75%] aspect-[1/1.414] bg-white shadow-xl rounded-[2px] flex flex-col p-4 gap-2 transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-1">
                                    <div className="h-2.5 w-1/2 bg-zinc-100/80 rounded"></div>
                                    <div className="h-1.5 w-1/3 bg-zinc-50 rounded mb-2"></div>
                                    <div className="space-y-1.5">
                                        <div className="h-0.5 w-full bg-zinc-50 rounded"></div>
                                        <div className="h-0.5 w-[90%] bg-zinc-50 rounded"></div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-zinc-50 flex gap-2">
                                        <div className="h-12 w-1/3 bg-zinc-50/50 rounded"></div>
                                        <div className="h-12 flex-1 bg-zinc-50/50 rounded"></div>
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <Link href="/signup">
                                        <Button size="lg" className="h-12 px-8 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            Use {tpl.name}
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-zinc-900">{tpl.name}</h3>
                                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-zinc-200">
                                        {tpl.category}
                                    </Badge>
                                </div>

                                <p className="text-zinc-500 mb-6 text-sm font-medium leading-relaxed">{tpl.description}</p>

                                <div className="mt-auto flex flex-wrap gap-1.5">
                                    {tpl.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-500">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simplified Footer */}
                <div className="mt-24 text-center py-12">
                    <div className="inline-flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-[10px] bg-zinc-50 px-4 py-2 rounded-full border border-zinc-200">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> 100% Recruiter Approved
                    </div>
                </div>
            </div>
        </div>
    );
}
