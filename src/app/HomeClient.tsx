"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FileText, Download, Share2, Zap, MessageSquare, ShieldCheck, X, Star, Search, Bookmark, Shield, Users } from "lucide-react";
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { useLang, type Lang } from "@/lib/i18n";
import type { CompanyLogoName } from "@/components/ui/company-logos";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

// Dynamic imports
const TestimonialsSection = dynamic(() => import("@/components/ui/testimonials-with-marquee").then(m => ({ default: m.TestimonialsSection })));
const LandingTestimonials = dynamic(() => import("@/components/ui/landing-testimonials").then(m => ({ default: m.LandingTestimonials })));
const LandingDemoStrip = dynamic(() => import("@/components/ui/landing-demo-strip").then(m => ({ default: m.LandingDemoStrip })));
const LandingPricing = dynamic(() => import("@/components/landing/LandingPricing").then(m => ({ default: m.LandingPricing })));
const LandingCopyLinkSpotlight = dynamic(() => import("@/components/ui/landing-copy-link-spotlight").then(m => ({ default: m.LandingCopyLinkSpotlight })));
const LandingATSScanner = dynamic(() => import("@/components/ui/landing-ats-scanner").then(m => ({ default: m.LandingATSScanner })));
const SparklesCore = dynamic(() => import("@/components/ui/sparkles").then(m => ({ default: m.SparklesCore })), { ssr: false });
const HeroInteractiveDemo = dynamic(
  () => import("@/components/ui/hero-interactive-demo").then(m => ({ default: m.HeroInteractiveDemo })),
  { ssr: false, loading: () => <div className="w-full h-full rounded-2xl bg-zinc-100 animate-pulse" /> }
);

function AnimatedCounter({ base = 20313 }: { base?: number }) {
  const [val, setVal] = useState(base);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const addUsers = () => {
        setVal(prev => prev + Math.floor(Math.random() * 3) + 1);
        const nextTick = Math.floor(Math.random() * 5000) + 3000;
        timeoutId = setTimeout(addUsers, nextTick);
      };
      let timeoutId = setTimeout(addUsers, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [inView]);

  return <span ref={ref}>{val.toLocaleString()}</span>;
}

const testimonials: { author: { name: string; handle: string; avatar: string; companyLogoName: CompanyLogoName }; text: string }[] = [
  {
    author: {
      name: "Emma T.",
      handle: "Product Manager",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face&fm=webp&q=70",
      companyLogoName: "stripe",
    },
    text: "Went from a 42 to a 91 ATS score. Got my first callback in 3 days after months of silence.",
  },
  {
    author: {
      name: "David P.",
      handle: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&fm=webp&q=70",
      companyLogoName: "spotify",
    },
    text: "Imported my LinkedIn, got a polished CV in seconds. The shareable letter link impressed every recruiter I sent it to.",
  },
  {
    author: {
      name: "Sofia R.",
      handle: "Sales Director",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face&fm=webp&q=70",
      companyLogoName: "salesforce",
    },
    text: "I had no idea my formatting was breaking the ATS. Fixed the issues in one scan and got two interview calls that week.",
  },
  {
    author: {
      name: "James W.",
      handle: "Senior Engineer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face&fm=webp&q=70",
      companyLogoName: "uber",
    },
    text: "The AI rewrote my bullet points better than I could in an hour. Exported a clean PDF and applied the same day.",
  }
];

const proofChips = [
  "✦ ATS Scanner + Score",
  "✦ AI-Powered CV Rewrite",
  "✦ LinkedIn Import + PDF Upload",
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
                  <Star className={`w-4 h-4 transition-all ${saved[i] ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const WaveDivider = () => (
  <div className="w-full" style={{ height: '20px', background: 'rgba(15, 35, 90, 0.85)', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '2.5rem 2.5rem' }} />
);

export default function HomeClient() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 overflow-x-hidden selection:bg-blue-500/30">

      <main className="flex-1">
        <section className="relative w-full overflow-hidden bg-[#fafafa] min-h-[700px] flex flex-col items-center justify-center pt-24 pb-12">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_80%,transparent_100%)] opacity-30 pointer-events-none" />
          <div className="container px-6 mx-auto relative z-20 mt-6 mb-8 min-h-[550px] flex flex-col justify-center">
            <div className="flex w-full justify-between items-center gap-12">
              <div className="flex flex-col z-20 w-full lg:w-[55%] items-center text-center lg:items-start lg:text-left">
                <Link href="/signup">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-[13px] font-semibold mb-8 shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span> CV Optimizer AI 2.0 is live
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                </Link>
                <h1 className="font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-6 text-5xl md:text-[64px] lg:text-[72px]">
                  Get more interviews.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">Start with your CV score.</span>
                </h1>

                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mb-10 text-left max-w-xl">
                  <p className="text-zinc-900 font-bold leading-relaxed">
                    CVOptimizerAI is a high-accuracy, free ATS resume checker that identifies formatting errors and missing keywords in seconds. Our AI-driven engine has optimized over 132,000 CVs, helping job seekers pass automated filters with confidence and land more interviews.
                  </p>
                </div>

                <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight mb-8 w-full max-w-xl">
                  AI analyzes your CV, gives you an ATS score, and rewrites it for the job you want — in seconds.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
                  {proofChips.map((chip, i) => (
                    <div key={chip} className={`inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-bold border ${i === 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-zinc-200 text-zinc-600'}`}>{chip}</div>
                  ))}
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-8 w-full z-30 relative mt-2">
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Link href="/signup" className="w-full sm:w-auto">
                      <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full bg-blue-600 text-white font-bold text-[15px] shadow-xl transition-all">Analyze My CV Free <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </Link>
                  </div>
                  <div className="flex flex-col items-center gap-2.5 mt-6 sm:mt-0 sm:ml-6">
                    <div className="flex -space-x-3">
                      {[
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face"
                      ].map((imgUrl, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#fafafa] overflow-hidden relative z-[10] shadow-sm"><Image src={imgUrl} alt="User" width={32} height={32} className="object-cover" /></div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">{[1,2,3,4,5].map(i => (<svg key={i} className="w-4 h-4 fill-[#f59e0b]" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>))}</div>
                      <p className="text-[14px] font-bold text-zinc-600 tracking-tight whitespace-nowrap">Joined by <AnimatedCounter base={20313} />+ top professionals</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex w-[45%] h-[550px] items-center justify-center relative"><HeroInteractiveDemo /></div>
            </div>
          </div>
        </section>

        <LandingDemoStrip />
        <LandingATSScanner />
        <TestimonialsSection title="Trusted by professionals who landed interviews." description="See what users say after their first ATS scan." testimonials={testimonials} />
        <WaveDivider />

        <section className="w-full bg-[#fbfcfd] py-28 border-y border-zinc-100/80">
          <div className="container px-6 mx-auto max-w-6xl text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-12">Unfair advantage in the job market.</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat) => (
                <div key={feat.title} className="bg-white p-8 rounded-[24px] border border-neutral-200 shadow-sm text-left">
                  <feat.icon className="h-6 w-6 text-blue-600 mb-6" />
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-3">{feat.title}</h3>
                  <p className="text-zinc-500 text-[15px] mb-4">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LandingCopyLinkSpotlight />
        <JobSearchPreview />
        <WaveDivider />

        {/* Stats Section: Minimalist Professional Trust Bar */}
        <section id="stats" className="w-full py-8 md:py-10 bg-[#0f172a]/[0.02] border-y border-zinc-100/10">
          <div className="container px-6 mx-auto max-w-5xl">
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-6 md:gap-0 bg-[#0f172a] rounded-2xl md:rounded-full py-4 px-8 border border-white/5 shadow-2xl shadow-indigo-950/20">
              
              {/* Stat 1: Optimized CVs */}
              <div className="flex flex-col items-center md:items-start flex-1 px-4 min-w-[140px]">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                  <span className="text-[15px] md:text-[18px] font-black text-white tracking-tight">
                    <AnimatedCounter base={132412} />+
                  </span>
                </div>
                <span className="text-[10px] md:text-[11px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">Optimized CVs</span>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

              {/* Stat 2 */}
              <div className="flex flex-col items-center md:items-start flex-1 px-4 min-w-[140px]">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[15px] md:text-[18px] font-black text-white tracking-tight">6</span>
                </div>
                <span className="text-[10px] md:text-[11px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">ATS Analysis Engines</span>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

              {/* Stat 3 */}
              <div className="flex flex-col items-center md:items-start flex-1 px-4 min-w-[140px]">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[15px] md:text-[18px] font-black text-white tracking-tight">12</span>
                </div>
                <span className="text-[10px] md:text-[11px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">Premium Templates</span>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

              {/* Stat 4 */}
              <div className="flex flex-col items-center md:items-start flex-1 px-4 min-w-[140px]">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  <span className="text-[15px] md:text-[18px] font-black text-white tracking-tight">&lt;30s</span>
                </div>
                <span className="text-[10px] md:text-[11px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">Real-time Analysis</span>
              </div>

            </div>
          </div>
        </section>

        <LandingTestimonials />
        <LandingPricing />

        <WaveDivider />
        <section ref={ctaRef} className="relative w-full h-[550px] bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden">
          <div className="relative z-20 flex flex-col items-center w-full px-4">
            <p className="text-3xl md:text-5xl font-extrabold tracking-tighter text-zinc-900 text-center mb-8">Stop Applying. <span className="text-blue-600">Start Getting Offers.</span></p>
            <Link href="/signup"><Button size="lg" className="rounded-full bg-zinc-900 hover:bg-black text-white h-14 px-10 text-[15px] font-bold shadow-xl">Create Your First CV <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-zinc-100 bg-[#fafafa]">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <span className="font-extrabold text-xl">CV Optimizer AI</span>
            <p className="text-sm text-zinc-600 max-w-xs">Handcrafted to help candidates land dream jobs.</p>
          </div>
          <div className="flex gap-24">
            <nav className="flex flex-col gap-4 text-sm font-bold text-zinc-600">
              <Link href="/pricing">Pricing</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/press">Press</Link>
            </nav>
            <nav className="flex flex-col gap-4 text-sm font-bold text-zinc-600">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </nav>
          </div>
        </div>
      </footer>
      <ExitIntentPopup />
    </div>
  );
}
