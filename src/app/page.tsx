"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FileText, Download, Share2, Zap, MessageSquare, ShieldCheck, X, Star, Search, Bookmark } from "lucide-react";
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import { SpiralAnimation } from "@/components/ui/spiral-animation";
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { LandingDemoStrip } from "@/components/ui/landing-demo-strip";
import { LandingCopyLinkSpotlight } from "@/components/ui/landing-copy-link-spotlight";
import { useLang, type Lang } from "@/lib/i18n";
import { HeroInteractiveDemo } from "@/components/ui/hero-interactive-demo";
import { SparklesCore } from "@/components/ui/sparkles";

function AnimatedCounter({ from = 4000, to = 20000 }: { from?: number, to?: number }) {
  const [val, setVal] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(value) {
          setVal(Math.round(value));
        }
      });
      return () => controls.stop();
    }
  }, [inView, from, to]);

  return <span ref={ref}>{val.toLocaleString()}</span>;
}

function LangFlagPicker() {
  const { lang, setLang } = useLang();
  const next: Lang = lang === 'en' ? 'tr' : 'en';
  return (
    <button
      onClick={() => setLang(next)}
      title={lang === 'en' ? 'Switch to Turkish' : 'İngilizceye geç'}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 transition-all text-sm font-semibold text-zinc-700 shadow-sm hover:shadow active:scale-95"
    >
      <span className="text-base leading-none">{lang === 'en' ? '🇬🇧' : '🇹🇷'}</span>
      <span className="text-[11px] font-bold hidden sm:inline">{lang === 'en' ? 'EN' : 'TR'}</span>
    </button>
  );
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

const proofChips = [
  "✦ Premium Templates + AI Optimizer",
  "✦ LinkedIn Job Search + Saved Jobs",
  "✦ Copy Link Cover Letter — your unfair advantage",
];

const features = [
  {
    icon: FileText,
    title: "Manual CV Builder",
    desc: "Build from scratch with full control over every section — skills, experience, education, and more.",
    bullet: "Unlimited edits. Your structure, your story.",
  },
  {
    icon: Zap,
    title: "Templates + AI Optimizer",
    desc: "Choose from attention-grabbing, ATS-friendly templates. Refine each block with inline AI.",
    bullet: "Runs once, freezes at final state.",
  },
  {
    icon: MessageSquare,
    title: "Import CV",
    desc: "LinkedIn URL, PDF upload, or plain text — AI turns it into a structured, polished CV in seconds.",
    bullet: "3 import methods. Instant results.",
  },
  {
    icon: Search,
    title: "Search Jobs + Saved Jobs ⭐",
    desc: "LinkedIn-synced job search. Star listings to save for later and optimize your CV per listing.",
    bullet: "2 searches/day on trial · Unlimited on Pro.",
  },
  {
    icon: ShieldCheck,
    title: "My CVs",
    desc: "Manage multiple CV profiles and versions in one dashboard. Switch context between applications instantly.",
    bullet: "2 CVs on trial · Unlimited on Pro.",
  },
  {
    icon: Share2,
    title: "My Letters",
    desc: "View, download as PDF, or copy the shareable link for any generated Presentation Letter.",
    bullet: "4 letters on trial · Unlimited on Pro.",
  },
];

// Mock job search data
const mockJobs = [
  { title: "Senior Product Manager", company: "Spotify", location: "Remote · Full-time", tag: "LinkedIn", saved: true },
  { title: "AI Engineer", company: "Anthropic", location: "San Francisco · Hybrid", tag: "LinkedIn", saved: false },
  { title: "UX Lead", company: "Figma", location: "New York · On-site", tag: "LinkedIn", saved: false },
];

function JobSearchPreview() {
  const [saved, setSaved] = useState<boolean[]>([true, false, false]);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="w-full py-24 bg-[#fafafa] border-t border-zinc-100">
      <div className="container px-6 mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">Job Search</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-5">
            Find it. Save it. Win it.
          </h2>
          <p className="text-lg text-zinc-500 font-medium max-w-xl mx-auto">
            Search LinkedIn-synced jobs, save the ones you love, and optimize your CV for each one — all in one place.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-4">
          {/* Mock Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-center gap-3 bg-white border border-zinc-200 rounded-2xl px-5 py-4 shadow-sm"
          >
            <Search className="w-5 h-5 text-zinc-400 flex-shrink-0" />
            <span className="text-zinc-500 font-medium flex-1">AI Engineer, Remote</span>
            <div className="h-8 px-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center text-white text-[13px] font-bold">
              Search
            </div>
          </motion.div>

          {/* Mock Job Cards */}
          {mockJobs.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.1 }}
              className="flex items-center gap-4 bg-white border border-zinc-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 border border-zinc-200 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-black text-zinc-400">{job.company[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-zinc-900 truncate">{job.title}</p>
                <p className="text-[12px] text-zinc-400 font-medium truncate">{job.company} · {job.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{job.tag}</span>
                <button
                  onClick={() => setSaved(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
                  className="p-1.5 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <Star
                    className={`w-4 h-4 transition-all ${saved[i] ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'}`}
                  />
                </button>
              </div>
            </motion.div>
          ))}

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-center text-[13px] text-zinc-400 font-medium pt-2"
          >
            ⭐ Saved jobs appear in your dashboard — ready for CV optimization
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

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
            <Link className="hover:text-zinc-900 transition-colors cursor-pointer" href="/#pricing">Pricing</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/login">Login</Link>
            <Link href="/signup">
              <Button className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold rounded-full px-6 h-10 shadow-sm transition-all hover:scale-105 active:scale-95">
                Get Started Free
              </Button>
            </Link>
          </nav>

          {/* Mobile Nav */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/login" className="text-[13px] font-bold text-zinc-600 hover:text-zinc-900">
              Login
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold rounded-full px-4 h-8 text-[13px]">
                Get Started
              </Button>
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1">

        {/* --- Hero Section (A) --- */}
        <section className="relative w-full overflow-hidden bg-[#fafafa] min-h-[85vh] flex flex-col items-center justify-center pt-24 pb-12">

          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_80%,transparent_100%)] opacity-30 pointer-events-none" />
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#2563eb] to-[#93c5fd] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>

          <div className="container px-6 mx-auto relative z-20 mt-6 mb-8 h-auto min-h-[400px] flex flex-col justify-center">

            <div className="flex w-full justify-between items-center gap-12">

              {/* Left Column (Text & CTAs) */}
              <div className="flex flex-col z-20 w-full lg:w-[55%] items-center text-center lg:items-start lg:text-left">

                <Link href="/signup">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-[13px] font-semibold mb-8 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-200 group">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    CV Optimizer AI 2.0 is live
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-0.5" />
                  </div>
                </Link>

                <h1 className="font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-6 text-5xl md:text-[64px] lg:text-[72px]">
                  Build, tailor, and share<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">job-winning CVs</span> — fast.
                </h1>

                <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight mb-8 w-full max-w-xl">
                  Create stunning CVs, import from LinkedIn, PDF, or plain text, optimize for any role, and share a professional letter link directly in your LinkedIn invite.
                </p>

                {/* Proof Chips */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-10">
                  {proofChips.map((chip, i) => (
                    <div
                      key={chip}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-bold border
                        ${i === 2
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-zinc-200 text-zinc-600'
                        }`}
                    >
                      {chip}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-8 w-full z-30 relative mt-2">
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Link href="/signup" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold text-[15px] shadow-[0_0_24px_rgba(59,130,246,0.3)] hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] transition-all hover:scale-[1.02] active:scale-95 border border-blue-400/20">
                        Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <a href="#demo" className="w-full sm:w-auto">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full bg-white border-zinc-200 text-zinc-700 font-bold text-[15px] hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm hover:shadow-md">
                        See how it works
                      </Button>
                    </a>
                  </div>

                  {/* Social Proof Avatars centered above text */}
                  <div className="flex flex-col items-center gap-1.5 mt-4 lg:mt-0 lg:ml-2">
                    <div className="flex -space-x-3 mb-1">
                      {testimonials.map((t, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#fafafa] bg-zinc-100 overflow-hidden shadow-sm relative z-[10] hover:scale-110 transition-transform cursor-pointer">
                          <Image src={t.author.avatar} alt={t.author.name} width={32} height={32} className="object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(i => (
                          <svg key={i} className="w-4 h-4 fill-[#f59e0b]" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                        ))}
                      </div>
                      <p className="text-[14px] font-bold text-zinc-600 tracking-tight whitespace-nowrap">Joined by <AnimatedCounter />+ top professionals</p>
                    </div>
                  </div>
                </div>



              </div>

              {/* Right Column (HeroInteractiveDemo) */}
              <div
                className="hidden lg:flex w-[45%] h-[550px] items-center justify-center relative"
              >
                <HeroInteractiveDemo />
              </div>

            </div>
          </div>

        </section>

        {/* --- B) Interactive Demo Strip --- */}
        <LandingDemoStrip />

        {/* --- C) Feature Grid — 6 cards --- */}
        <section className="w-full bg-[#fbfcfd] py-28 border-y border-zinc-100/80">
          <div className="container px-6 mx-auto max-w-6xl">
            <div className="max-w-3xl mb-16 text-center mx-auto">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">Everything you need</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-5">
                Unfair advantage in the job market.
              </h2>
              <p className="text-lg md:text-xl text-zinc-500 font-medium tracking-tight leading-relaxed">
                Every tool you need — from first CV to shareable letter link — in one premium platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat, i) => (
                <div key={feat.title} className="bg-white p-8 rounded-[24px] border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="size-12 rounded-[16px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center mb-6">
                    <feat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-3 tracking-tight">{feat.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-medium text-[15px] mb-4">{feat.desc}</p>
                  <p className="text-[12px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 inline-block">{feat.bullet}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- D) "Copy Link" Spotlight --- */}
        <LandingCopyLinkSpotlight />

        {/* --- E) Job Search Flow Preview --- */}
        <JobSearchPreview />

        {/* Testimonials */}
        <div className="bg-white border-t border-zinc-100">
          <TestimonialsSection
            title="Trusted by professionals worldwide"
            description="Join thousands of professionals who are already landing interviews at top companies with CV Optimizer."
            testimonials={testimonials}
          />
        </div>

        {/* --- F) Pricing / Trial --- */}
        <section id="pricing" className="w-full py-28 bg-[#fafafa] border-t border-zinc-100 relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-blue-50/50 to-transparent pointer-events-none" />

          <div className="container px-6 mx-auto text-center relative z-10 max-w-5xl">
            <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-5 tracking-tight">
              Simple, transparent pricing.
            </h2>
            <p className="text-lg text-zinc-500 font-medium mb-16 max-w-xl mx-auto">
              Start free for 14 days. Upgrade once when you&apos;re ready — no subscription, ever.
            </p>

            <div className="flex flex-col md:flex-row gap-8 mx-auto mb-16 items-stretch justify-center">
              {/* Trial Plan */}
              <div className="flex-1 max-w-[400px] w-full bg-white rounded-[32px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] p-10 flex flex-col border border-zinc-200 hover:shadow-xl transition-shadow text-left">
                <div className="mb-6">
                  <h3 className="text-[28px] font-extrabold text-black leading-tight tracking-tight">14-Day Trial</h3>
                  <p className="text-zinc-500 text-[15px] mt-2 font-medium">Try everything free. No credit card.</p>
                </div>
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="text-[48px] font-extrabold tracking-tighter text-zinc-900 leading-none">$0</span>
                  <span className="text-zinc-500 text-[15px] font-bold">/ 14 days</span>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    { text: "2 CVs", included: true },
                    { text: "4 Custom Cover Letters", included: true },
                    { text: "2 LinkedIn Job Searches / day", included: true },
                    { text: "Shareable links → cvoptimizerai.com after trial", included: true },
                    { text: "Branded shareable links", included: false },
                    { text: "Unlimited everything", included: false },
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
                    Start Free Trial
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="flex-1 max-w-[400px] w-full relative bg-white rounded-[32px] shadow-[0_12px_40px_-4px_rgba(37,99,235,0.15)] border-[2.5px] border-[#2563eb] p-10 flex flex-col hover:scale-[1.02] transition-transform text-left">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white text-[11px] font-extrabold tracking-wider px-4 py-1.5 rounded-full uppercase shadow-lg shadow-blue-600/20 z-20">
                  Most Popular
                </div>

                <div className="mb-6">
                  <h3 className="text-[28px] font-extrabold text-black leading-tight tracking-tight">Pro Plan</h3>
                  <p className="text-zinc-500 text-[15px] mt-2 font-medium">One-time payment. 3 years of access.</p>
                </div>

                <div className="flex flex-col mb-8">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[48px] font-extrabold tracking-tighter text-zinc-900 leading-none">$99</span>
                    <span className="text-zinc-600 text-[15px] font-bold">one-time · 3 years</span>
                  </div>
                  <p className="text-[11px] text-[#2563eb] font-black mt-3 uppercase tracking-wider bg-blue-50 border border-blue-100 w-fit px-2.5 py-1 rounded-md">
                    ≈ $2.75 / month for 3 years
                  </p>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    "Unlimited CVs",
                    "Unlimited Cover Letters",
                    "Unlimited Job Searches",
                    "Your own branded shareable letter links",
                    "Advanced AI Optimization",
                    "No Watermark PDF Exports",
                    "LinkedIn Integration",
                    "Premium Templates",
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

        {/* --- G) Final CTA with Sparkles --- */}
        <section ref={ctaRef} className="relative w-full h-[550px] border-t border-zinc-100 bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden">
          <div className="relative z-20 flex flex-col items-center w-full">
            <p className="text-3xl md:text-5xl font-extrabold tracking-tighter text-zinc-900 text-center px-4 drop-shadow-sm relative z-30">
              Stop Applying. <span className="text-[#2563eb]">Start Getting Offers.</span>
            </p>

            {/* Sparkles positioned exactly below the text */}
            <div className="w-full max-w-[40rem] h-40 relative mt-1 mb-[-4rem] z-10 pointer-events-none">
              {/* Base gradients for glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-600 to-transparent h-[2px] w-3/4 md:w-full blur-sm opacity-80" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-600 to-transparent h-px w-3/4 md:w-full opacity-100" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-400 to-transparent h-[5px] w-1/4 sm:w-1/2 blur-sm opacity-80" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-400 to-transparent h-px w-1/4 sm:w-1/2 opacity-100" />

              {/* Core component */}
              <SparklesCore
                background="transparent"
                minSize={0.8}
                maxSize={2.0}
                particleDensity={1800}
                className="w-full h-full"
                particleColor="#1d4ed8"
              />

              {/* Radial Gradient to blend borders smoothly back to background color */}
              <div className="absolute inset-0 w-full h-full bg-[#fafafa] [mask-image:radial-gradient(400px_200px_at_top,transparent_20%,white)]" />
            </div>

            <Link href="/signup" className="pointer-events-auto relative z-30 mt-6 hover:scale-105 transition-transform duration-300">
              <Button size="lg" className="rounded-full bg-zinc-900 hover:bg-black text-white h-14 px-10 text-[15px] font-bold shadow-xl shadow-zinc-900/20 hover:shadow-2xl transition-all">
                Create Your First CV <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
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
                <Link className="hover:text-zinc-900 transition-colors" href="/#pricing">Pricing</Link>
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
