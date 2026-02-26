import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Zap } from "lucide-react";

const templates = [
    { id: 1, name: "Minimal Core", category: "Minimal", sector: "All", tags: ["ATS Friendly", "1-page"], color: "bg-zinc-100" },
    { id: 2, name: "Tech Pro", category: "Modern", sector: "Tech", tags: ["ATS Friendly", "Modern"], color: "bg-blue-50" },
    { id: 3, name: "Executive Suite", category: "Classic", sector: "Finance", tags: ["Detailed", "2-page"], color: "bg-slate-50" },
    { id: 4, name: "Creative Edge", category: "Modern", sector: "Design", tags: ["Visual", "Portfolio"], color: "bg-purple-50" },
    { id: 5, name: "Academic Scholar", category: "Classic", sector: "All", tags: ["ATS Friendly", "Multi-page"], color: "bg-zinc-50" },
    { id: 6, name: "Entry Level", category: "Minimal", sector: "Student", tags: ["1-page", "Simple"], color: "bg-green-50" }
];

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-24 px-6 flex flex-col">
            <header className="fixed top-0 left-0 right-0 h-14 flex items-center border-b bg-white z-50 px-6">
                <Link className="flex items-center justify-center font-bold text-xl" href="/">
                    <Zap className="h-6 w-6 text-indigo-600 mr-2" />
                    Interview-Ready CV
                </Link>
                <nav className="ml-auto flex gap-6 items-center">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/templates">Templates</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">Pricing</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">Login</Link>
                </nav>
            </header>

            <div className="max-w-7xl mx-auto flex-1">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-zinc-900">
                        Professional <span className="text-indigo-600">CV Templates</span>
                    </h1>
                    <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
                        Pick a template that fits your industry and role. Start building a professional, job-winning curriculum vitae in minutes.
                    </p>
                </div>

                {/* Filters Simulation (Static styling for now) */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                    <Badge variant="default" className="px-4 py-2 text-sm rounded-full cursor-pointer bg-zinc-900 text-white">All</Badge>
                    <Badge variant="secondary" className="px-4 py-2 text-sm rounded-full cursor-pointer">One Page</Badge>
                    <Badge variant="secondary" className="px-4 py-2 text-sm rounded-full cursor-pointer">Modern</Badge>
                    <Badge variant="secondary" className="px-4 py-2 text-sm rounded-full cursor-pointer">Technology</Badge>
                    <Badge variant="outline" className="px-4 py-2 text-sm rounded-full border-indigo-200 text-indigo-600 cursor-pointer">ATS Friendly</Badge>
                </div>

                {/* Templates Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map((tpl) => (
                        <div key={tpl.id} className="group relative bg-white rounded-2xl overflow-hidden border border-zinc-200 flex flex-col hover:shadow-xl transition-all duration-300">

                            {/* Preview image placeholder */}
                            <div className={`aspect-[1/1.414] ${tpl.color} w-full relative p-6 flex items-center justify-center overflow-hidden`}>
                                <div className="absolute inset-x-8 inset-y-8 bg-white shadow-sm rounded-sm opacity-50 flex flex-col p-4 gap-2 transition-transform duration-500 group-hover:scale-105">
                                    <div className="h-4 w-1/3 bg-zinc-200 rounded"></div>
                                    <div className="h-2 w-1/4 bg-zinc-100 rounded mb-4"></div>
                                    <div className="h-2 w-full bg-zinc-100 rounded"></div>
                                    <div className="h-2 w-[90%] bg-zinc-100 rounded"></div>
                                    <div className="h-2 w-[80%] bg-zinc-100 rounded"></div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Link href={`/login`}>
                                        <Button size="lg" className="rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-zinc-900 hover:bg-zinc-50 border-zinc-200 border">
                                            Use This Template
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 bg-white border-t border-zinc-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-zinc-900">{tpl.name}</h3>
                                        <p className="text-sm text-zinc-500">{tpl.category} • {tpl.sector}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tpl.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded bg-zinc-100 text-zinc-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
