import { Button } from "@/components/ui/button";
import { CheckCircle2, Crown, Zap } from "lucide-react";
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 relative selection:bg-primary/20">
            <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>

            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                    Kariyerine <span className="text-gradient">Değer Katacak</span> Planlar
                </h1>
                <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto text-balance">
                    Sana en uygun planı seç. Ücretsiz başla, ihtiyaç duydukça profesyonel araçlara eriş. İstediğin zaman iptal edebilirsin.
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:px-12">
                {/* Free Plan */}
                <div className="glass-card rounded-3xl p-8 relative flex flex-col h-full border border-border/60">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            <Zap className="text-muted-foreground w-6 h-6" /> Başlangıç
                        </h2>
                        <p className="text-foreground/60 text-sm mb-6">CV oluşturmaya başlamak için temel araçlar.</p>
                        <div className="text-5xl font-extrabold">Ücretsiz</div>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                        {['1 Adet CV', 'Temel tasarımlar', 'PDF indirme (standart)', 'Temel dışa aktarım'].map((feat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                                <span className="text-foreground/80 font-medium">{feat}</span>
                            </div>
                        ))}
                    </div>

                    <Link href="/signup" className="w-full mt-auto">
                        <Button variant="outline" className="w-full rounded-2xl h-12 text-base font-semibold border-border/60 hover:bg-background">
                            Hemen Başla
                        </Button>
                    </Link>
                </div>

                {/* Pro Plan */}
                <div className="glass-card rounded-3xl p-8 relative flex flex-col h-full border-primary/50 shadow-[0_0_50px_-15px_rgba(var(--primary),0.3)] transform md:-translate-y-4 bg-card">
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-1 shadow-md">
                        <Crown className="w-3 h-3" /> EN ÇOK TERCİH EDİLEN
                    </div>

                    <div className="mb-8 mt-2">
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-primary">
                            Pro <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">Sınırsız</span>
                        </h2>
                        <p className="text-foreground/60 text-sm mb-6">Maksimum potansiyeline ulaşmak isteyen profesyoneller için.</p>
                        <div className="text-5xl font-extrabold flex items-baseline gap-2">
                            $9 <span className="text-lg text-foreground/50 font-medium">/ay</span>
                        </div>
                        <p className="text-xs text-foreground/40 mt-2">Aylık faturalandırılır. İptal kolaylığı.</p>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                        {[
                            'Sınırsız CV oluşturma',
                            'Tüm premium şablonlar',
                            'Yüksek çözünürlüklü filigransız PDF',
                            'Paylaşılabilir dijital bağlantı',
                            'Sınırsız AI ile içerik optimize etme',
                            'İş ilanına (Job Description) göre özel uyarlama',
                            'Ön yazı (Cover letter) desteği'
                        ].map((feat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span className="text-foreground/90 font-medium">{feat}</span>
                            </div>
                        ))}
                    </div>

                    <Link href="/signup" className="w-full mt-auto">
                        <Button className="w-full rounded-2xl h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                            Pro'ya Yükselt
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="text-center mt-12 text-xs text-foreground/40 space-y-2 max-w-lg mx-auto">
                <p>Ödemeler uluslararası ve güvenli altyapılar (Stripe/vb.) aracılığıyla tamamen şifreli bir şekilde alınır.</p>
                <p>Abonelikleri dilediğiniz zaman hesap ayarlarından iptal edebilirsiniz.</p>
            </div>
        </div>
    );
}
