import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FileText, Download, Share2, Sparkles, Layout } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Navbar Minimal & Premium */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground font-bold">
              C
            </div>
            <span className="font-bold tracking-tight text-lg">Optimizer.<span className="text-primary">cv</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
            <Link href="/templates" className="hover:text-foreground transition-colors">Şablonlar</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Fiyatlandırma</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-foreground text-foreground/80 transition-colors">
              Giriş Yap
            </Link>
            <Link href="/signup">
              <Button className="rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                Ücretsiz Başla
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-16">
        {/* Dynamic Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
          {/* Decorative blur elements for modern feel */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50"></div>

          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium animate-float">
            <Sparkles className="w-4 h-4" />
            <span>AI Destekli Yeni Nesil CV Oluşturucu</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl text-foreground mb-8 text-balance">
            Dakikalar içinde <span className="text-gradient">profesyonel CV</span> oluştur.
          </h1>

          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-12 text-balance leading-relaxed">
            ATS uyumlu şablonlar, tek tıkla PDF indirme, linkle paylaşma ve isteğe bağlı AI optimizasyon özellikleriyle hayalindeki işe bir adım yaklaş.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/signup">
              <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] hover:scale-105 transition-transform">
                Ücretsiz Başla <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base border-border/50 bg-background/50 backdrop-blur-sm">
                Şablonları Gör
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-sm font-medium text-foreground/50">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> ATS Uyumlu</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> PDF + Paylaşılabilir Link</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> %100 Veri Güvenliği</div>
          </div>
        </section>

        {/* How It Works Layer */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Üç Basit Adımda Kusursuz Sonuç</h2>
            <p className="text-foreground/60 max-w-xl mx-auto">Modern, hızlı ve sonuç odaklı CV hazırlama deneyimi.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line for desktop */}
            <div className="hidden md:block absolute top-[40%] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-border/60 to-transparent -z-10"></div>

            {[
              { icon: Layout, title: "1. Şablon Seç", desc: "Sektörüne ve tarzına en uygun profesyonel tasarımı belirle." },
              { icon: FileText, title: "2. Bilgilerini Doldur", desc: "Kullanıcı dostu editör ile deneyimlerini kolayca ekle." },
              { icon: Download, title: "3. İndir & Paylaş", desc: "Tek tıkla PDF olarak al veya dijital linkle gönder." },
            ].map((step, i) => (
              <div key={i} className="glass-card rounded-2xl p-8 flex flex-col items-center text-center relative group">
                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-foreground/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Features Overview */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="glass-card rounded-3xl p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full"></div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">İş Başvuru Sürecini<br />Zirveye Taşı.</h2>
                <div className="space-y-6">
                  {[
                    "Sürükle-bırak CV düzenleme editörü",
                    "Aday takip sistemleriyle (ATS) tam uyumlu format",
                    "Farklı renk şemaları ve tipografi seçenekleri",
                    "İlana özel (Job Description) AI içerik uyarlama"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-lg font-medium text-foreground/80">{feature}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <Link href="/signup">
                    <Button size="lg" className="rounded-full shadow-lg shadow-primary/20">Ücretsiz Başla</Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                {/* Abstract UI representation */}
                <div className="aspect-[4/5] md:aspect-square bg-gradient-to-br from-card to-background rounded-2xl border border-border/50 shadow-2xl p-6 transform md:rotate-3 transition-transform hover:rotate-0 duration-500 flex flex-col gap-4">
                  <div className="h-4 w-1/3 bg-border/40 rounded animate-pulse-soft"></div>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-border/40 shrink-0"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-full bg-border/40 rounded"></div>
                      <div className="h-4 w-2/3 bg-border/40 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="h-2 w-full bg-border/30 rounded"></div>
                    <div className="h-2 w-full bg-border/30 rounded"></div>
                    <div className="h-2 w-4/5 bg-border/30 rounded"></div>
                  </div>
                  <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-xl flex items-center gap-3 animate-float border-primary/20 bg-background/80">
                    <Sparkles className="text-primary w-5 h-5" />
                    <span className="font-medium text-sm">AI Optimize Edildi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/20 pb-8 pt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-lg">Optimizer.<span className="text-primary">cv</span></span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-foreground/60">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
          </div>
          <div className="text-sm text-foreground/40 text-center md:text-right">
            CV içerikleri kullanıcıya aittir. <br /> © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
