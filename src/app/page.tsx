"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FileText, Download, Share2, Zap, Globe, MessageSquare, ShieldCheck, X } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import { InteractiveGlobe } from "@/components/ui/interactive-globe";
import { RepeatType, Easing } from 'framer-motion';

const testimonials = [
  {
    author: {
      name: "Emma Thompson",
      handle: "@emma_career",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "CV Optimizer transformed my job search. The AI-tailored suggestions for my professional summary were spot on, and I landed an interview at a top tech firm within a week!",
    href: "#"
  },
  {
    author: {
      name: "David Park",
      handle: "@dpark_tech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The precision and speed are incredible. Integrating my LinkedIn profile was seamless, and the resulting CV looked more professional than anything I could have designed myself.",
    href: "#"
  },
  {
    author: {
      name: "Sofia Rodriguez",
      handle: "@sofia_leads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Finally, a tool that understands the nuances of different industries. The executive template helped me highlight my leadership experience effectively. Highly recommended!",
    href: "#"
  },
  {
    author: {
      name: "James Wilson",
      handle: "@jwilson_eng",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "I was skeptical about AI writers, but the quality of the bullet points generated for my roles was top-tier. It's like having a career coach in your pocket.",
    href: "#"
  }
];

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
                  <div className="flex -space-x-3">
                    {testimonials.map((t, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-100 overflow-hidden shadow-sm">
                        <Image src={t.author.avatar} alt={t.author.name} width={40} height={40} className="object-cover" />
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

        <TestimonialsSection
          title="Trusted by professionals worldwide"
          description="Join thousands of professionals who are already landing interviews at top companies with CV Optimizer."
          testimonials={testimonials}
        />

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
                src="/cv_mockup.png"
                alt="AI CV Editor Mockup"
                fill
                className="object-cover"
                draggable={false}
              />
            </div>
          </ContainerScroll>
        </section>

        {/* --- Pricing CTA (Synchronized with Upgrade Plan Style) --- */}
        <section className="w-full py-32 bg-white relative overflow-hidden">
          <div className="container px-6 mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-20 tracking-tight">
              Upgrade your Plan
            </h2>

            <div className="flex flex-col sm:flex-row gap-8 max-w-[850px] mx-auto mb-20 items-stretch">
              {/* Free Plan */}
              <div className="flex-1 bg-white rounded-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] p-10 flex flex-col border border-zinc-100 hover:shadow-xl transition-shadow">
                <div className="text-left mb-6">
                  <h3 className="text-[28px] font-bold text-black leading-tight">Free</h3>
                  <p className="text-zinc-500 text-[15px] mt-1">Perfect for testing the platform.</p>
                </div>
                <div className="flex items-baseline gap-1.5 mb-8 text-left">
                  <span className="text-[44px] font-bold tracking-tight text-zinc-900 leading-none">$0</span>
                  <span className="text-zinc-500 text-[15px] font-medium">/forever</span>
                </div>

                <ul className="space-y-4 mb-10 flex-1 text-left">
                  {[
                    { text: "2 CVs (Resets every 14 days)", included: true },
                    { text: "2 Cover Letters (Resets 14 days)", included: true },
                    { text: "2 Daily Job Searches", included: true },
                    { text: "PDF Export (Watermarked)", included: true },
                    { text: "Advanced AI Optimization", included: false }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px]">
                      {item.included ? (
                        <CheckCircle2 className="w-[18px] h-[18px] text-[#16a34a] shrink-0 mt-[2px]" strokeWidth={2.5} />
                      ) : (
                        <X className="w-[18px] h-[18px] text-zinc-300 shrink-0 mt-[2px]" strokeWidth={2.5} />
                      )}
                      <span className={item.included ? "text-zinc-700 font-medium" : "text-zinc-400"}>{item.text}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="w-full">
                  <Button variant="outline" className="w-full h-14 rounded-[14px] border-zinc-200 text-black font-semibold text-[15px] hover:bg-zinc-50 transition-all">
                    Start for Free
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="flex-1 relative bg-white rounded-[24px] shadow-[0_12px_40px_-4px_rgba(37,99,235,0.12)] border-[2.5px] border-[#2563eb] p-10 flex flex-col hover:scale-[1.01] transition-transform">
                <div className="absolute top-6 right-8 bg-[#2563eb] text-white text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full uppercase shadow-lg shadow-blue-600/20 z-20">
                  BEST VALUE
                </div>

                <div className="text-left mb-6 mt-4">
                  <h3 className="text-[28px] font-bold text-black leading-tight">Pro Lifetime</h3>
                  <p className="text-zinc-500 text-[15px] mt-1">Single payment, unlimited access.</p>
                </div>

                <div className="flex flex-col mb-8 text-left">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[44px] font-bold tracking-tight text-zinc-900 leading-none">$99</span>
                    <span className="text-zinc-600 text-[15px] font-medium">one-time</span>
                  </div>
                  <p className="text-[11px] text-[#2563eb] font-black mt-2 uppercase tracking-wider bg-blue-50 w-fit px-2 py-0.5 rounded">
                    Approx. $8.25/mo for one year
                  </p>
                </div>

                <ul className="space-y-4 mb-10 flex-1 text-left">
                  {[
                    "Unlimited Everything",
                    "Advanced AI Optimization",
                    "No Watermark Exports",
                    "LinkedIn Integration",
                    "Premium Templates"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px]">
                      <CheckCircle2 className="w-[18px] h-[18px] text-[#16a34a] shrink-0 mt-[2px]" strokeWidth={2.5} />
                      <span className="text-zinc-800 font-bold">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="w-full">
                  <Button className="w-full h-14 rounded-[14px] bg-[#2563eb] hover:bg-black text-white font-bold text-[15px] shadow-xl shadow-blue-500/20 transition-all">
                    Upgrade to Pro
                  </Button>
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
