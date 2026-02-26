import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

const templates = [
    { id: 1, name: "Minimal Core", category: "Minimal", sector: "Tümü", tags: ["ATS Friendly", "1-page"], color: "bg-zinc-100 dark:bg-zinc-900" },
    { id: 2, name: "Tech Pro", category: "Modern", sector: "Tech", tags: ["ATS Friendly", "Modern"], color: "bg-blue-50 dark:bg-blue-950/20" },
    { id: 3, name: "Executive Suite", category: "Klasik", sector: "Finance", tags: ["Detailed", "2-page"], color: "bg-slate-50 dark:bg-slate-900" },
    { id: 4, name: "Creative Edge", category: "Modern", sector: "Design", tags: ["Visual", "Portfolio"], color: "bg-purple-50 dark:bg-purple-950/20" },
    { id: 5, name: "Academic Scholar", category: "Klasik", sector: "Tümü", tags: ["ATS Friendly", "Multi-page"], color: "bg-zinc-50 dark:bg-zinc-950" },
    { id: 6, name: "Entry Level", category: "Minimal", sector: "Student", tags: ["1-page", "Simple"], color: "bg-green-50 dark:bg-green-950/20" }
];

export default function TemplatesPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 selection:bg-primary/20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                        Profesyonel <span className="text-gradient">CV Şablonları</span>
                    </h1>
                    <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                        Sektörüne ve pozisyonuna en uygun, ATS uyumlu (Yazılım Taramasından Geçen) şablonlardan birini seçerek hemen başla.
                    </p>
                </div>

                {/* Filters Simulation (Static styling for now) */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                    <Badge variant="default" className="px-4 py-2 text-sm rounded-full cursor-pointer hover:bg-primary/90">Tümü</Badge>
                    <Badge variant="secondary" className="px-4 py-2 text-sm rounded-full cursor-pointer hover:bg-secondary/80">Tek Sayfa</Badge>
                    <Badge variant="secondary" className="px-4 py-2 text-sm rounded-full cursor-pointer hover:bg-secondary/80">Modern</Badge>
                    <Badge variant="secondary" className="px-4 py-2 text-sm rounded-full cursor-pointer hover:bg-secondary/80">Teknoloji</Badge>
                    <Badge variant="outline" className="px-4 py-2 text-sm rounded-full border-primary/50 text-primary cursor-pointer">ATS Friendly</Badge>
                </div>

                {/* Templates Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map((tpl) => (
                        <div key={tpl.id} className="group relative glass-card rounded-2xl overflow-hidden border border-border/50 flex flex-col hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">

                            {/* Preview image placeholder */}
                            <div className={`aspect-[1/1.414] ${tpl.color} w-full relative p-6 flex items-center justify-center overflow-hidden`}>
                                <div className="absolute inset-x-8 inset-y-8 bg-background shadow-md rounded-sm opacity-50 flex flex-col p-4 gap-2 transition-transform duration-500 group-hover:scale-105">
                                    <div className="h-4 w-1/3 bg-foreground/20 rounded"></div>
                                    <div className="h-2 w-1/4 bg-foreground/10 rounded mb-4"></div>
                                    <div className="h-2 w-full bg-foreground/10 rounded"></div>
                                    <div className="h-2 w-[90%] bg-foreground/10 rounded"></div>
                                    <div className="h-2 w-[80%] bg-foreground/10 rounded"></div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Link href={`/app/new?template=${tpl.id}`}>
                                        <Button size="lg" className="rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            Bu Şablonu Kullan
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6 bg-card z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{tpl.name}</h3>
                                        <p className="text-sm text-foreground/50">{tpl.category} • {tpl.sector}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tpl.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded bg-foreground/5 text-foreground/70">
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
