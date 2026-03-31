import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, Shield, Target, Sparkles, Users, Award, LineChart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About CVOptimizerAI | The Ultimate Resume Optimization Tool',
  description:
    'Learn about CVOptimizerAI, our mission to democratize the job search, and how our ATS scoring and AI tools help candidates land more interviews.',
  openGraph: {
    title: 'About CVOptimizerAI | The Ultimate Resume Optimization Tool',
    description:
      'Our mission is to help professionals bypass applicant tracking systems and get their resumes into the hands of real humans.',
    type: 'website',
    url: 'https://cvoptimizerai.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 overflow-x-hidden selection:bg-blue-500/30">

      {/* ── Navbar ───────────────────────────────────────────── */}
      <div className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-5xl z-50 flex justify-center pointer-events-none">
        <header className="flex items-center justify-between w-full h-16 px-4 md:px-6 border border-zinc-200/80 bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] pointer-events-auto transition-all">
          <Link className="flex items-center gap-2 group" href="/">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 transition-transform group-hover:scale-110 shadow-md shadow-blue-600/20 flex-shrink-0">
              <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-zinc-900">CV Optimizer AI</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center text-[15px] font-bold text-zinc-500">
            <Link className="hover:text-zinc-900 transition-colors" href="/templates">Templates</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/#pricing">Pricing</Link>
            <Link className="text-blue-600" href="/about">About</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/blog">Blog</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[14px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block">
              Login
            </Link>
            <Link href="/signup">
              <Button className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold rounded-full px-5 h-9 md:px-6 md:h-10 shadow-sm transition-all hover:scale-105 active:scale-95">
                <span className="hidden sm:inline">Get Started Free</span>
                <span className="inline sm:hidden">Try Free</span>
              </Button>
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative w-full min-h-[600px] flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden bg-[#fafafa]">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_80%,transparent_100%)] opacity-30 pointer-events-none" />
          
          <div className="container px-6 mx-auto max-w-4xl text-center relative z-20 mt-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-[13px] font-semibold mb-8 shadow-sm">
              <span className="text-blue-500">✦</span> Our Story
            </div>

            <h1 className="font-extrabold tracking-tighter leading-[0.95] text-zinc-900 mb-6 text-5xl md:text-[68px]">
              We level the playing field.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
                You get the interview.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium tracking-tight max-w-2xl mx-auto">
              CVOptimizerAI is the intelligent bridge between talented candidates and frustrating automated recruiting software. We give you the tools to beat the algorithms.
            </p>
          </div>
        </section>

        {/* ── Story Content ────────────────────────────────────── */}
        <section className="w-full py-20 bg-white border-y border-zinc-100">
          <div className="container px-6 mx-auto max-w-3xl">
            <div className="prose prose-lg prose-zinc mx-auto">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-6">The Broken Hiring System</h2>
              <p className="text-zinc-600 font-medium leading-relaxed mb-8">
                Over 98% of Fortune 500 companies—and increasingly, companies of all sizes—rely on Applicant Tracking Systems (ATS) to filter resumes. Unfortunately, these systems are notoriously flawed. They routinely reject highly qualified candidates simply because a resume lacks a specific keyword, uses a creative layout, or features a table that the software cannot parse.
              </p>
              
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-6">Enter CVOptimizerAI</h2>
              <p className="text-zinc-600 font-medium leading-relaxed mb-8">
                CVOptimizerAI was built to solve this exact problem. It is a comprehensive suite of AI-driven tools designed to ensure that a candidate&apos;s resume is perfectly formatted, intelligently keyword-optimized, and structurally sound before it ever reaches an employer&apos;s inbox. 
              </p>

              <blockquote className="border-l-4 border-blue-500 pl-6 italic text-zinc-800 font-medium my-10 bg-blue-50/50 py-4 rounded-r-2xl">
                "Our mission is simple: get your resume past the robots so that a real human can see your potential."
              </blockquote>

              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-6">Who It&apos;s For</h2>
              <p className="text-zinc-600 font-medium leading-relaxed mb-12">
                Whether you are a recent graduate trying to land your first role, a seasoned professional aiming for the C-suite, or a career switcher struggling to translate past experience into new industry jargon, CVOptimizerAI provides the unfair advantage needed in today&apos;s hyper-competitive job market.
              </p>
            </div>
          </div>
        </section>

        {/* ── Feature Grid ─────────────────────────────────────── */}
        <section className="w-full bg-[#fbfcfd] py-28 border-b border-zinc-100">
          <div className="container px-6 mx-auto max-w-6xl">
            <div className="max-w-3xl mb-16 text-center mx-auto">
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">Core Technology</p>
              <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 mb-5">
                What drives our platform
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Target, title: 'Deep ATS Gap Analysis', desc: 'Our scanner reverse-engineers ATS parsers, assigning a precise score out of 100 based on keyword density, readability, and structural integrity.' },
                { icon: Sparkles, title: 'One-Click AI Rewrite', desc: 'Powered by advanced language models, our platform instantly corrects formatting issues and injects high-impact, role-specific terminology.' },
                { icon: Shield, title: 'ATS-Safe Templates', desc: 'Every template we offer is battle-tested. No hidden tables or unreadable graphics—just clean, modern design that software can effortlessly read.' },
                { icon: Users, title: 'Scout Jobs Integration', desc: 'Find targeted job listings directly within the platform and optimize your CV against them in real-time.' },
                { icon: Award, title: 'Smart Cover Letters', desc: 'Generate highly personalized motivation letters perfectly aligned with both your CV and the target job description.' },
                { icon: LineChart, title: 'Progress Tracking', desc: 'Save different variations of your resume, track your application readiness, and manage your job hunt from one centralized dashboard.' },
              ].map(feature => (
                <div key={feature.title} className="bg-white p-8 rounded-[24px] border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="size-12 rounded-[16px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-medium text-[15px]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────── */}
        <section className="relative w-full h-[380px] bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden border-t border-zinc-100">
          <div className="relative z-20 flex flex-col items-center w-full px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-zinc-900 mb-8">
              Ready to take control of your career?
            </h2>
            <Link href="/signup">
              <Button size="lg" className="rounded-full bg-zinc-900 hover:bg-black text-white h-14 px-10 text-[15px] font-bold shadow-xl shadow-zinc-900/20 hover:shadow-2xl transition-all hover:scale-[1.03] active:scale-95">
                Join CVOptimizerAI Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="py-20 px-6 border-t border-zinc-100 bg-[#fafafa]">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-6 max-w-xs">
            <Link className="flex items-center gap-2" href="/">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-zinc-900">CV Optimizer AI</span>
            </Link>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">Handcrafted with precision to help candidates land their dream jobs at top companies worldwide.</p>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-4">© {new Date().getFullYear()} CV Optimizer AI. AI-Powered.</p>
          </div>
          <div className="grid grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-widest text-[#2563eb]">Product</p>
              <nav className="flex flex-col gap-4 text-sm font-bold text-zinc-600">
                <Link className="hover:text-zinc-900 transition-colors" href="/templates">Templates</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/#pricing">Pricing</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/free-ats-checker">Free ATS Checker</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/resume-score-checker">Resume Score Checker</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/about">About</Link>
                <Link className="hover:text-zinc-900 transition-colors" href="/blog">Blog</Link>
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
