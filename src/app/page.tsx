"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FileText, Download, Share2, Zap, Globe, MessageSquare, ShieldCheck } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { TestimonialsSection } from "@/components/ui/testimonial-v2";
import { InteractiveGlobe } from "@/components/ui/interactive-globe";
import { RepeatType, Easing } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 overflow-x-hidden selection:bg-blue-500/30">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 px-6 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <Link className="flex items-center gap-2 group" href="/">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 transition-transform group-hover:scale-110 shadow-lg shadow-blue-600/20">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">CV Optimizer</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-8 items-center text-sm font-medium text-zinc-500">
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

      <main className="flex-1 pt-20">
        {/* --- Hero Section with Interactive Globe (Minimalist Light) --- */}
        <section className="relative w-full overflow-hidden bg-white min-h-[85vh] flex items-center">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />

          <div className="container px-6 mx-auto relative z-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <div className="flex-1 text-center lg:text-left space-y-10 max-w-2xl lg:max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[13px] font-semibold animate-fade-in shadow-sm">
                <ShieldCheck className="h-4 w-4" /> Trusted by 120,000+ Professionals
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-zinc-900">
                The all-in-one <br />
                <span className="text-blue-600">career platform.</span>
              </h1>
              <p className="text-xl text-zinc-500 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Build professional CVs, generate tailored cover letters, and land interviews at top companies with our AI-powered standard.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-xl shadow-blue-600/10 transition-all hover:scale-[1.02] active:scale-95">
                    Start Building for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="flex items-center gap-3 px-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 overflow-hidden">
                        <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="User avatar" width={32} height={32} />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-zinc-400">Join 10k+ professionals</p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center relative scale-90 lg:scale-110">
              {/* Clean Globe Implementation */}
              <InteractiveGlobe
                size={700}
                dotColor="rgba(59, 130, 246, ALPHA)"
                arcColor="rgba(59, 130, 246, 0.2)"
                markerColor="rgba(59, 130, 246, 1)"
                className="opacity-100 transition-opacity duration-1000"
              />
            </div>
          </div>
        </section>

        {/* --- Feature Grid (Clean Minimalist) --- */}
        <section className="w-full bg-zinc-50 py-32 border-y border-zinc-100">
          <div className="container px-6 mx-auto">
            <div className="max-w-3xl mb-20">
              <h2 className="text-4xl font-black text-zinc-900 mb-6">Everything you need to master your job search.</h2>
              <p className="text-lg text-zinc-500">We've combined powerful AI tools with professional templates to help you land your dream job faster than ever.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: "Smart CV Optimization", desc: "Get a realtime Match Score for your target job. AI suggests keywords and improvements.", icon: Zap },
                { title: "AI Cover Letters", desc: "Tailor cover letters for specific job postings in seconds based on your experience.", icon: MessageSquare },
                { title: "Live Template Switching", desc: "Switch between Modern, Executive, and Creative templates instantly without losing progress.", icon: FileText }
              ].map((feat, i) => (
                <div key={feat.title} className="space-y-4">
                  <div className="size-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <feat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{feat.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Success Stories (cvmakerly style) --- */}
        <section className="w-full py-32 bg-white overflow-hidden">
          <div className="container px-6 mx-auto text-center mb-20">
            <h2 className="text-4xl font-black text-zinc-900 mb-4">Don't just take our word for it.</h2>
            <p className="text-zinc-500 text-lg">See how professionals are transforming their careers.</p>
          </div>
          {/* Using a simplified version of the testimonials */}
          <div className="flex overflow-x-auto pb-12 hide-scrollbar px-6 gap-8 snap-x">
            {[
              { name: "Sarah J.", role: "Product Manager", quote: "I applied to 50 jobs with no response. After using optimized templates, I got 3 interviews in one week!" },
              { name: "Michael C.", role: "Software Engineer", quote: "The presentation is a game changer. It made me stand out from other candidates immediately. Highly recommended." },
              { name: "Emily R.", role: "Marketing Director", quote: "Simple, fast, and effective. The AI suggestions helped me rewrite my weak bullet points into achievements." },
              { name: "David K.", role: "UX Designer", quote: "I loved the templates! They are so clean and professional compared to other builders I've used." }
            ].map((testimonial, i) => (
              <div key={i} className="min-w-[350px] bg-zinc-50 p-10 rounded-[40px] border border-zinc-100 snap-center">
                <p className="text-zinc-900 font-bold text-lg mb-8 leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {testimonial.name[0]}
                  </div>
                  <div className="text-left">
                    <p className="font-black text-zinc-900">{testimonial.name}</p>
                    <p className="text-sm text-zinc-500 font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Editor Showcase (Subtle Light Mode) --- */}
        <section className="w-full bg-zinc-50 py-32 border-t border-zinc-100">
          <ContainerScroll
            titleComponent={
              <div className="max-w-4xl mx-auto mb-12 text-center">
                <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6">
                  Experience the <span className="text-blue-600">Power of AI</span>
                </h2>
                <p className="text-zinc-500 text-xl max-w-2xl mx-auto">
                  Watch your career transform with our pixel-perfect editor. Real-time feedback, infinite customization.
                </p>
              </div>
            }
          >
            <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl">
              <Image
                src="/brain/4caa0719-c41e-493e-b1e9-b0c20d032070/cv_editor_preview_mockup_v2_1772087254285.png"
                alt="AI CV Editor Mockup"
                fill
                className="object-cover"
                draggable={false}
              />
            </div>
          </ContainerScroll>
        </section>

        {/* --- Pricing CTA (Clean Cards) --- */}
        <section className="w-full py-32 bg-white relative overflow-hidden">
          <div className="container px-6 mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-20">
              Start building for <span className="text-blue-600">free today</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
              {/* Free Plan */}
              <div className="p-10 rounded-[40px] bg-zinc-50 border border-zinc-200 flex flex-col items-center">
                <h3 className="text-xl font-bold mb-2 text-zinc-900">Free Plan</h3>
                <p className="text-zinc-500 mb-8">Test the platform features</p>
                <p className="text-6xl font-black text-zinc-900 mb-8">$0</p>
                <div className="w-full space-y-4 mb-10 text-left">
                  <div className="flex items-center gap-3 text-zinc-600 font-medium"><CheckCircle2 className="h-5 w-5 text-blue-500" /> 2 CVs & Cover Letters</div>
                  <div className="flex items-center gap-3 text-zinc-600 font-medium"><CheckCircle2 className="h-5 w-5 text-blue-500" /> Daily Job Searches</div>
                  <div className="flex items-center gap-3 text-zinc-400 italic text-sm"><ShieldCheck className="h-5 w-5 opacity-40" /> Watermarked Exports</div>
                </div>
                <Link href="/signup" className="w-full">
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-zinc-200 hover:bg-zinc-100 font-bold text-lg transition-all">Get Started</Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="p-10 rounded-[40px] bg-white border-2 border-blue-600 flex flex-col items-center relative shadow-2xl shadow-blue-500/10">
                <div className="absolute top-6 right-8 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Best Value</div>
                <h3 className="text-xl font-bold mb-2 text-zinc-900">Lifetime Access</h3>
                <p className="text-zinc-500 mb-8">Single payment, forever yours</p>
                <div className="flex flex-col items-center mb-8">
                  <p className="text-6xl font-black text-zinc-900">$99</p>
                  <p className="text-xs text-blue-600 font-black mt-2 uppercase tracking-wide">
                    Approx. $8.25/mo for one year
                  </p>
                </div>
                <div className="w-full space-y-4 mb-10 text-left">
                  <div className="flex items-center gap-3 text-zinc-800 font-bold"><CheckCircle2 className="h-5 w-5 text-blue-600" /> Unlimited Everything</div>
                  <div className="flex items-center gap-3 text-zinc-800 font-bold"><CheckCircle2 className="h-5 w-5 text-blue-600" /> Advanced AI Optimization</div>
                  <div className="flex items-center gap-3 text-zinc-800 font-bold"><CheckCircle2 className="h-5 w-5 text-blue-600" /> Premium Templates</div>
                </div>
                <Link href="/signup" className="w-full">
                  <Button className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-500/20 transition-transform hover:scale-[1.02]">Upgrade Now</Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="text-zinc-400 text-sm font-medium">Join over 10,000 professionals who use CV Optimizer to land interviews.</p>
              <div className="flex items-center gap-8 opacity-40 grayscale pointer-events-none">
                <p className="font-black text-xl tracking-tighter">indeed</p>
                <p className="font-black text-xl tracking-tighter">Glassdoor</p>
                <p className="font-black text-xl tracking-tighter">LinkedIn</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-zinc-100 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-6 max-w-xs">
            <Link className="flex items-center gap-2" href="/">
              <Zap className="h-6 w-6 text-blue-600 fill-blue-600" />
              <span className="font-black text-2xl tracking-tight text-zinc-900">CV Optimizer</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">Handcrafted with precision to help candidates land their dream jobs at top companies worldwide.</p>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">© {new Date().getFullYear()} CV Optimizer. AI-Powered.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Product</p>
              <nav className="flex flex-col gap-4 text-sm font-bold text-zinc-600">
                <Link className="hover:text-blue-600 transition-colors" href="/templates">Templates</Link>
                <Link className="hover:text-blue-600 transition-colors" href="/pricing">Pricing</Link>
              </nav>
            </div>
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Legal</p>
              <nav className="flex flex-col gap-4 text-sm font-bold text-zinc-600">
                <Link className="hover:text-blue-600 transition-colors" href="#">Privacy</Link>
                <Link className="hover:text-blue-600 transition-colors" href="#">Terms</Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
