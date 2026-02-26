"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FileText, Download, Share2, Zap, Globe, MessageSquare, ShieldCheck } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { TestimonialsSection } from "@/components/ui/testimonial-v2";
import { InteractiveGlobe } from "@/components/ui/interactive-globe";
import { PulseBeams } from "@/components/ui/pulse-beams";
import { RepeatType, Easing } from 'framer-motion';

const BEAMS = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: { x1: ["0%", "0%", "200%"], x2: ["0%", "0%", "180%"], y1: ["80%", "0%", "0%"], y2: ["100%", "20%", "20%"] },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop" as RepeatType, ease: "linear" as Easing, repeatDelay: 2, delay: 0.5 },
    },
    connectionPoints: [{ cx: 6.5, cy: 398.5, r: 6 }, { cx: 269, cy: 220.5, r: 6 }]
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: { x1: ["20%", "100%", "100%"], x2: ["0%", "90%", "90%"], y1: ["80%", "80%", "-20%"], y2: ["100%", "100%", "0%"] },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop" as RepeatType, ease: "linear" as Easing, repeatDelay: 2, delay: 1.2 },
    },
    connectionPoints: [{ cx: 851, cy: 34, r: 6.5 }, { cx: 568, cy: 200, r: 6 }]
  },
  {
    path: "M380 168V17C380 11.4772 384.477 7 390 7H414",
    gradientConfig: {
      initial: { x1: "-40%", x2: "-10%", y1: "0%", y2: "20%" },
      animate: { x1: ["40%", "0%", "0%"], x2: ["10%", "0%", "0%"], y1: ["0%", "0%", "180%"], y2: ["20%", "20%", "200%"] },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop" as RepeatType, ease: "linear" as Easing, repeatDelay: 2, delay: 0.8 },
    },
    connectionPoints: [{ cx: 420.5, cy: 6.5, r: 6 }, { cx: 380, cy: 168, r: 6 }]
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-indigo-500/30">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-6 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
        <Link className="flex items-center gap-2 group" href="/">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 transition-transform group-hover:scale-110">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Interview-Ready CV</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-8 items-center text-sm font-medium text-white/60">
          <Link className="hover:text-white transition-colors" href="/templates">Templates</Link>
          <Link className="hover:text-white transition-colors" href="/pricing">Pricing</Link>
          <Link className="hover:text-white transition-colors" href="/login">Login</Link>
          <Link href="/signup">
            <Button className="bg-white text-[#020617] hover:bg-white/90 font-bold rounded-xl px-6">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        {/* --- Hero Section with Interactive Globe --- */}
        <section className="relative w-full overflow-hidden bg-[#020617] min-h-[90vh] flex items-center">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="container px-4 mx-auto relative z-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl lg:max-w-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4 animate-fade-in">
                <ShieldCheck className="h-4 w-4" /> Trusted by 120k+ Professionals Worldwide
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                The Global Standard for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                  ATS Compliance
                </span>
              </h1>
              <p className="text-xl text-white/50 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Our templates are rigorously tested against software like Taleo, Workday, and Greenhouse. Land more interviews with a resume that's built for global success.
              </p>

              <div className="grid grid-cols-2 gap-8 items-center pt-4 max-w-md mx-auto lg:mx-0">
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-blue-400">120k+</p>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Accepted Resumes</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-blue-400">99.8%</p>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Format Success Rate</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95">
                    Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl border-white/10 hover:bg-white/5 hover:border-white/20 font-bold text-lg transition-all">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              {/* Pulsing effect behind globe */}
              <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-[80px] animate-pulse pointer-events-none" />
              <InteractiveGlobe
                size={700}
                dotColor="rgba(56, 189, 248, ALPHA)"
                arcColor="rgba(56, 189, 248, 0.4)"
                markerColor="rgba(56, 189, 248, 1)"
                className="opacity-100 scale-110 lg:scale-125 transition-transform duration-700 hover:scale-115 lg:hover:scale-130"
              />
            </div>
          </div>
        </section>

        {/* --- Content Showcase with Container Scroll & Real Mockup --- */}
        <section className="w-full bg-gradient-to-b from-[#020617] to-[#0a0f1e] py-10">
          <ContainerScroll
            titleComponent={
              <div className="max-w-4xl mx-auto mb-12">
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                  Experience the <span className="text-blue-400">Power of AI</span>
                </h2>
                <p className="text-white/40 text-lg md:text-xl">
                  Watch your career transform with our pixel-perfect editor. Real-time feedback, infinite customization.
                </p>
              </div>
            }
          >
            <div className="relative w-full h-full bg-[#0f172a] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10">
              <Image
                src="/brain/4caa0719-c41e-493e-b1e9-b0c20d032070/cv_editor_preview_mockup_v2_1772087254285.png"
                alt="AI CV Editor Mockup"
                fill
                className="object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="size-12 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Smart AI Suggestions</p>
                    <p className="text-sm text-white/50">Industry-specific advice that makes recruiters notice you.</p>
                  </div>
                </div>
                <Link href="/signup" className="hidden md:block">
                  <Button className="bg-white text-black font-bold h-11 px-6 rounded-xl hover:scale-105 transition-transform">Get Your Copy</Button>
                </Link>
              </div>
            </div>
          </ContainerScroll>
        </section>

        {/* --- Pulse Beams (Transition Section) --- */}
        <section className="w-full py-10 bg-[#0a0f1e]">
          <PulseBeams
            beams={BEAMS}
            className="py-10"
            gradientColors={{ start: "#3b82f6", middle: "#8b5cf6", end: "#06b6d4" }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white/40 uppercase tracking-[0.2em]">Synchronized Connectivity</h3>
            </div>
          </PulseBeams>
        </section>

        {/* --- Testimonials --- */}
        <TestimonialsSection />

        {/* --- Final CTA Section with Real Pricing --- */}
        <section className="w-full py-32 relative overflow-hidden bg-gradient-to-b from-[#020617] to-[#0f172a]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="container px-4 mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-16">
              Start building for <span className="text-blue-400">free today</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {/* Free Plan */}
              <div className="p-10 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
                <p className="text-white/40 mb-8">Test the platform features</p>
                <p className="text-5xl font-extrabold mb-8">$0</p>
                <div className="w-full space-y-4 mb-10 text-left">
                  <div className="flex items-center gap-2 text-white/60"><CheckCircle2 className="h-5 w-5 text-blue-500" /> 2 CVs & Cover Letters</div>
                  <div className="flex items-center gap-2 text-white/60"><CheckCircle2 className="h-5 w-5 text-blue-500" /> Daily Job Searches</div>
                  <div className="flex items-center gap-2 text-white/40 italic"><ShieldCheck className="h-5 w-5 opacity-40" /> Watermarked Exports</div>
                </div>
                <Link href="/signup" className="w-full">
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 font-bold">Get Started</Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="p-10 rounded-[32px] bg-blue-600/10 border-2 border-blue-500 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-6 right-6 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Best Value</div>
                <h3 className="text-2xl font-bold mb-2">Lifetime Access</h3>
                <p className="text-white/40 mb-8">Single payment, forever yours</p>
                <div className="flex flex-col items-center mb-8">
                  <p className="text-5xl font-extrabold">$99</p>
                  <p className="text-[10px] text-blue-400/60 font-medium mt-1 uppercase tracking-tighter">
                    Approx. $8.25/mo for one year
                  </p>
                </div>
                <div className="w-full space-y-4 mb-10 text-left">
                  <div className="flex items-center gap-2 text-white/80"><CheckCircle2 className="h-5 w-5 text-blue-400" /> Unlimited Everything</div>
                  <div className="flex items-center gap-2 text-white/80"><CheckCircle2 className="h-5 w-5 text-blue-400" /> Advanced AI Optimization</div>
                  <div className="flex items-center gap-2 text-white/80"><CheckCircle2 className="h-5 w-5 text-blue-400" /> Premium Templates</div>
                </div>
                <Link href="/signup" className="w-full">
                  <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-600/40 transition-transform hover:scale-[1.02]">Upgrade Now</Button>
                </Link>
              </div>
            </div>

            <p className="text-white/30 text-sm mb-12 max-w-2xl mx-auto italic">
              "Don't leave your career to chance. Join 120,000+ professionals using the tool recruiters trust."
            </p>
          </div>
        </section>
      </main>

      <footer className="footer-border-top py-12 px-6 border-t border-white/5 bg-[#020617]">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <Link className="flex items-center gap-2" href="/">
              <Zap className="h-5 w-5 text-indigo-500" />
              <span className="font-bold">Interview-Ready CV</span>
            </Link>
            <p className="text-xs text-white/40">© {new Date().getFullYear()} Interview-Ready CV. Empowering careers everywhere.</p>
          </div>
          <nav className="flex gap-10 text-xs font-bold text-white/40 uppercase tracking-widest">
            <Link className="hover:text-white transition-colors" href="/templates">Templates</Link>
            <Link className="hover:text-white transition-colors" href="/pricing">Pricing</Link>
            <Link className="hover:text-white transition-colors" href="#">Privacy</Link>
            <Link className="hover:text-white transition-colors" href="#">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
