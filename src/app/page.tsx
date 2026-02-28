"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FileText, Download, Share2, Zap, MessageSquare, ShieldCheck, X } from "lucide-react";
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import { SpiralAnimation } from "@/components/ui/spiral-animation";
import { motion, AnimatePresence, useInView } from 'framer-motion';

const HeroVisualSlot = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center bg-zinc-50 rounded-[24px] border border-zinc-200/80 shadow-[0_32px_80px_-20px_rgba(37,99,235,0.12)] overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#fafafa] border-b border-neutral-200 flex items-center px-4 gap-2 z-20">
        <div className="flex gap-1.5 opacity-60">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
        </div>
      </div>
      <div className="absolute inset-0 pt-10 flex items-center justify-center bg-zinc-100">
        <p className="text-zinc-500 font-bold text-sm tracking-widest uppercase relative z-10 w-full text-center px-4">
          Hero Visual Slot
          <br /><span className="text-xs text-zinc-400 normal-case font-medium mt-1 inline-block">(Placeholder image)</span>
        </p>
        <Image src="/cv_mockup.png" alt="Interface Placeholder" fill className="object-cover object-top opacity-50 mix-blend-multiply blur-[2px]" draggable={false} />
      </div>
    </div>
  )
}

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
  const [isScrolled, setIsScrolled] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 overflow-x-hidden selection:bg-blue-500/30">

      {/* Floating Modern Navbar */}
      <div className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-5xl z-50 flex justify-center pointer-events-none">
        <header className="flex items-center justify-between w-full h-16 px-4 md:px-6 border border-zinc-200/80 bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] pointer-events-auto transition-all">
          <Link className="flex items-center gap-2 group" href="/">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 transition-transform group-hover:scale-110 shadow-md shadow-blue-600/20 flex-shrink-0">
              <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-zinc-900 truncate">CV Optimizer</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center text-[15px] font-bold text-zinc-500">
            <Link className="hover:text-zinc-900 transition-colors" href="/templates">Templates</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/pricing">Pricing</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/login">Login</Link>
            <Link href="/signup">
              <Button className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold rounded-full px-6 h-10 shadow-sm transition-all hover:scale-105 active:scale-95">
                Start Free
              </Button>
            </Link>
          </nav>

          {/* Mobile Nav */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/login" className="text-[13px] font-bold text-zinc-600 hover:text-zinc-900">
              Login
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold rounded-full px-4 h-8 text-[13px]">
                Start Free
              </Button>
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1">

        {/* --- Hero Section --- */}
        <section className="relative w-full overflow-hidden bg-[#fafafa] min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20">

          {/* New Background Grid patterned after viewcreator / cvmakerly */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_80%,transparent_100%)] opacity-30 pointer-events-none" />
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#2563eb] to-[#93c5fd] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>

          <div className="container px-6 mx-auto relative z-20 mt-12 mb-16 h-auto min-h-[500px] flex flex-col justify-center">

            <motion.div
              layout
              transition={{ type: "spring", bounce: 0, duration: 0.9 }}
              className={`flex w-full ${isScrolled ? 'justify-between' : 'justify-center'} items-center gap-12`}
            >

              {/* Left Column (Text & CTAs) */}
              <motion.div
                layout
                className={`flex flex-col z-20 transition-all duration-700 ${isScrolled ? 'w-full lg:w-1/2 items-start text-left' : 'w-full items-center text-center max-w-5xl'}`}
              >

                <motion.div layout>
                  <Link href="/signup">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-[13px] font-semibold mb-8 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-200 group">
                      <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                      CV Optimizer AI 2.0 is live
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </motion.div>

                <motion.h1 layout className={`font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-8 transition-all duration-700 ${isScrolled ? 'text-5xl md:text-6xl lg:text-7xl' : 'text-6xl md:text-[80px] lg:text-[100px]'}`}>
                  Interviews on <br className="md:hidden" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">Autopilot.</span>
                </motion.h1>

                <motion.p layout className={`text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight transition-all duration-700 mb-10 ${isScrolled ? 'w-full max-w-xl mx-0' : 'max-w-2xl mx-auto'}`}>
                  Stop the grind. Build professional CVs, tailor cover letters, and land interviews automatically. Our AI agents do the heavy lifting while you focus on the actual prep.
                </motion.p>

                <motion.div layout className={`flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-30 relative transition-all duration-700 ${isScrolled ? 'justify-start' : 'justify-center'}`}>
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold text-[15px] shadow-[0_0_24px_rgba(59,130,246,0.3)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] transition-all hover:scale-[1.02] active:scale-95 border border-blue-400/20">
                      Start for Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/templates" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full bg-white border-zinc-200 text-zinc-700 font-bold text-[15px] hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm hover:shadow-md">
                      Explore Templates
                    </Button>
                  </Link>
                </motion.div>

                <motion.div layout className={`flex flex-col mt-12 gap-3 transition-all duration-700 ${isScrolled ? 'items-start' : 'items-center'}`}>
                  <div className="flex -space-x-3">
                    {testimonials.map((t, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-100 overflow-hidden shadow-sm relative z-[10] hover:scale-110 transition-transform cursor-pointer">
                        <Image src={t.author.avatar} alt={t.author.name} width={40} height={40} className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(i => (
                        <svg key={i} className="w-3.5 h-3.5 fill-[#f59e0b]" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                      ))}
                    </div>
                    <p className="text-[14px] font-bold text-zinc-600 tracking-tight">Joined by 10,000+ top professionals</p>
                  </div>
                </motion.div>

              </motion.div>

              {/* Right Column (Visual Slot) */}
              <AnimatePresence>
                {isScrolled && (
                  <motion.div
                    initial={{ opacity: 0, x: 40, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.98 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.9, delay: 0.1 }}
                    className="hidden lg:flex w-[45%] h-[550px] items-center justify-center relative origin-right"
                  >
                    <HeroVisualSlot />
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>


        </section>

        {/* --- Feature Grid (Clean Minimalist high-end SaaS) --- */}
        <section className="w-full bg-[#fbfcfd] py-32 border-y border-zinc-100/80">
          <div className="container px-6 mx-auto max-w-6xl">
            <div className="max-w-3xl mb-20 text-center mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-6">Unfair advantage in the job market.</h2>
              <p className="text-lg md:text-xl text-zinc-500 font-medium tracking-tight leading-relaxed">Let our AI agents analyze, write, and optimize your application materials so you can simply hit apply with absolute confidence.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Smart Match Score", desc: "Instantly see how your CV stacks up against any job description with real-time keyword suggestions and scoring.", icon: Zap },
                { title: "AI Cover Letters", desc: "Generate perfectly tailored cover letters for every application in exactly 3 seconds, all based on your actual experience.", icon: MessageSquare },
                { title: "1-Click Template Swap", desc: "Instantly cycle through beautifully designed, ATS-friendly templates without ever losing your content or formatting.", icon: FileText }
              ].map((feat, i) => (
                <div key={feat.title} className="bg-white p-8 rounded-[24px] border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="size-12 rounded-[16px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center mb-6">
                    <feat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-3 tracking-tight">{feat.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-medium text-[15px]">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <div className="bg-[#fafafa]">
          <TestimonialsSection
            title="Trusted by professionals worldwide"
            description="Join thousands of professionals who are already landing interviews at top companies with CV Optimizer."
            testimonials={testimonials}
          />
        </div>

        {/* --- Pricing CTA (Synchronized with Upgrade Plan Style) --- */}
        <section className="w-full py-32 bg-white border-t border-zinc-100 relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-blue-50/50 to-transparent pointer-events-none" />

          <div className="container px-6 mx-auto text-center relative z-10 max-w-5xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-20 tracking-tight">
              Simple, transparent pricing.
            </h2>

            <div className="flex flex-col md:flex-row gap-8 mx-auto mb-20 items-stretch justify-center">
              {/* Free Plan */}
              <div className="flex-1 max-w-[400px] w-full bg-white rounded-[32px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] p-10 flex flex-col border border-zinc-200 hover:shadow-xl transition-shadow text-left">
                <div className="mb-6">
                  <h3 className="text-[28px] font-extrabold text-black leading-tight tracking-tight">Free</h3>
                  <p className="text-zinc-500 text-[15px] mt-2 font-medium">Perfect for testing the platform.</p>
                </div>
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="text-[48px] font-extrabold tracking-tighter text-zinc-900 leading-none">$0</span>
                  <span className="text-zinc-500 text-[15px] font-bold">/forever</span>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    { text: "2 CVs (Resets every 14 days)", included: true },
                    { text: "2 Cover Letters (Resets 14 days)", included: true },
                    { text: "2 Daily Job Searches", included: true },
                    { text: "PDF Export (Watermarked)", included: true },
                    { text: "Advanced AI Optimization", included: false }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px]">
                      {item.included ? (
                        <CheckCircle2 className="w-[20px] h-[20px] text-[#2563eb] shrink-0 mt-[2px]" strokeWidth={2.5} />
                      ) : (
                        <X className="w-[20px] h-[20px] text-zinc-300 shrink-0 mt-[2px]" strokeWidth={2.5} />
                      )}
                      <span className={item.included ? "text-zinc-700 font-bold" : "text-zinc-400 font-medium"}>{item.text}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="w-full">
                  <Button variant="outline" className="w-full h-14 rounded-full border-zinc-200 text-zinc-900 font-bold text-[15px] hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm shadow-zinc-200/50">
                    Get Started Free
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="flex-1 max-w-[400px] w-full relative bg-white rounded-[32px] shadow-[0_12px_40px_-4px_rgba(37,99,235,0.15)] border-[2.5px] border-[#2563eb] p-10 flex flex-col hover:scale-[1.02] transition-transform text-left">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white text-[11px] font-extrabold tracking-wider px-4 py-1.5 rounded-full uppercase shadow-lg shadow-blue-600/20 z-20">
                  Most Popular
                </div>

                <div className="mb-6">
                  <h3 className="text-[28px] font-extrabold text-black leading-tight tracking-tight">Pro Lifetime</h3>
                  <p className="text-zinc-500 text-[15px] mt-2 font-medium">Single payment, unlimited access.</p>
                </div>

                <div className="flex flex-col mb-8">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[48px] font-extrabold tracking-tighter text-zinc-900 leading-none">$99</span>
                    <span className="text-zinc-600 text-[15px] font-bold">one-time</span>
                  </div>
                  <p className="text-[11px] text-[#2563eb] font-black mt-3 uppercase tracking-wider bg-blue-50 border border-blue-100 w-fit px-2.5 py-1 rounded-md">
                    Approx. $8.25/mo for one year
                  </p>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    "Unlimited Everything",
                    "Advanced AI Optimization",
                    "No Watermark Exports",
                    "LinkedIn Integration",
                    "Premium Templates"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px]">
                      <CheckCircle2 className="w-[20px] h-[20px] text-[#2563eb] shrink-0 mt-[2px]" strokeWidth={2.5} />
                      <span className="text-zinc-900 font-bold">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="w-full">
                  <Button className="w-full h-14 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold text-[15px] shadow-xl shadow-blue-500/20 transition-all">
                    Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 pb-4">
              <p className="text-zinc-400 text-sm font-bold tracking-tight uppercase">Trusted by candidates hired at</p>
              <div className="flex items-center justify-center gap-8 md:gap-16 opacity-30 grayscale pointer-events-none flex-wrap">
                <p className="font-extrabold text-2xl tracking-tighter">Google</p>
                <p className="font-extrabold text-2xl tracking-tighter">Microsoft</p>
                <p className="font-extrabold text-2xl tracking-tighter">Meta</p>
                <p className="font-extrabold text-2xl tracking-tighter">Amazon</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Final Spiral CTA Section --- */}
        <section ref={ctaRef} className="relative w-full h-[600px] border-t border-zinc-100 overflow-hidden bg-[#fafafa]">
          {/* SpiralAnimation is now absolute centered directly behind the text block */}
          <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square pointer-events-none opacity-90 mix-blend-multiply">
            <SpiralAnimation play={isCtaInView} />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 -mt-10">
            <Link href="/signup" className="pointer-events-auto">
              <div className="flex flex-col items-center gap-6 group">
                <p className="text-3xl md:text-5xl font-extrabold tracking-tighter text-zinc-900 group-hover:scale-105 transition-transform duration-500 drop-shadow-md">
                  Stop Applying. <span className="text-[#2563eb]">Start Getting Offers.</span>
                </p>
                <Button size="lg" className="rounded-full bg-zinc-900 hover:bg-black text-white h-14 px-10 text-[15px] font-bold shadow-xl shadow-zinc-900/20 group-hover:shadow-2xl transition-all group-hover:-translate-y-1">
                  Create Your First CV <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-zinc-100 bg-[#fafafa]">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-6 max-w-xs">
            <Link className="flex items-center gap-2" href="/">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-zinc-900">CV Optimizer</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">Handcrafted with precision to help candidates land their dream jobs at top companies worldwide.</p>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-4">© {new Date().getFullYear()} CV Optimizer. AI-Powered.</p>
          </div>
          <div className="grid grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-widest text-[#2563eb]">Product</p>
              <nav className="flex flex-col gap-4 text-sm font-bold text-zinc-600">
                <Link className="hover:text-zinc-900 transition-colors" href="/templates">Templates</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/pricing">Pricing</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/login">Login</Link>
              </nav>
            </div>
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-widest text-[#2563eb]">Legal</p>
              <nav className="flex flex-col gap-4 text-sm font-bold text-zinc-600">
                <Link className="hover:text-zinc-900 transition-colors" href="#">Privacy</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="#">Terms</Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
