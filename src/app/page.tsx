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
        {/* --- Hero Section with Pulse Beams --- */}
        <section className="relative w-full overflow-hidden">
          <PulseBeams
            beams={BEAMS}
            className="pb-20 pt-32 lg:pb-32 lg:pt-48"
            gradientColors={{ start: "#6366f1", middle: "#a855f7", end: "#ec4899" }}
          >
            <div className="container px-4 mx-auto text-center relative z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                AI-Powered CV Optimization
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                Build Your Career with a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  Perfect Resume
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-white/50 text-lg md:text-xl mb-12 leading-relaxed">
                Create ATS-friendly resumes in minutes. Choose from professional templates and stand out to recruiters with our AI-powered suggestions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">
                    Create My Resume <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl border-white/10 hover:bg-white/5 hover:border-white/20 font-bold text-lg transition-all">
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
          </PulseBeams>
        </section>

        {/* --- Content Showcase with Container Scroll --- */}
        <section className="w-full">
          <ContainerScroll
            titleComponent={
              <div className="max-w-4xl mx-auto mb-12">
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                  The Most Powerful <span className="text-indigo-400">CV Editor</span>
                </h2>
                <p className="text-white/40 text-lg">
                  Designed for speed, clarity, and results. Watch your CV come to life as you type.
                </p>
              </div>
            }
          >
            <div className="relative w-full h-full bg-[#0f172a] rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-indigo-500/10">
              <Image
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=2000"
                alt="CV Builder interface preview"
                fill
                className="object-cover opacity-80"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="size-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Real-time Preview</p>
                    <p className="text-sm text-white/50">Changes update instantly on a pixel-perfect A4 canvas.</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Button className="bg-white text-black font-bold">Try Now</Button>
                </div>
              </div>
            </div>
          </ContainerScroll>
        </section>

        {/* --- Global Impact Section with Globe --- */}
        <section className="w-full py-24 relative overflow-hidden h-[900px] flex items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="container px-4 mx-auto relative z-10 flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="h-4 w-4" /> Trusted Worldwide
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight transition-all">
                The Standard for <br />
                <span className="text-emerald-400">ATS Compliance</span>
              </h2>
              <p className="text-lg text-white/50 leading-relaxed max-w-lg transition-all">
                Our templates are tested against major ATS software like Taleo, Workday, and Greenhouse. No matter where you apply, we ensure you pass the first scan.
              </p>
              <div className="grid grid-cols-2 gap-8 items-center pt-8">
                <div className="space-y-1">
                  <p className="text-3xl font-bold">120k+</p>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Accepted Resumes</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">99.8%</p>
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Format Success Rate</p>
                </div>
              </div>
              <Button size="lg" className="rounded-2xl h-14 px-8 bg-emerald-600 hover:bg-emerald-700 font-bold text-lg shadow-xl shadow-emerald-600/20">
                Join our Global Community
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <InteractiveGlobe
                size={700}
                dotColor="rgba(52, 211, 153, ALPHA)"
                arcColor="rgba(52, 211, 153, 0.4)"
                markerColor="rgba(52, 211, 153, 1)"
                className="opacity-90"
              />
            </div>
          </div>
        </section>

        {/* --- Testimonials --- */}
        <TestimonialsSection />

        {/* --- CTA Section --- */}
        <section className="w-full py-32 border-t border-white/5 relative overflow-hidden bg-gradient-to-b from-[#020617] to-[#0f172a]">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="container px-4 mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight mb-8">
              Ready to land your <br className="md:hidden" />
              <span className="text-indigo-400">dream job?</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Don't leave your career to chance. Use the AI tool that top professionals trust.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl shadow-2xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95">
                Start Building for Free
              </Button>
            </Link>
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
