import Link from 'next/link';
import { Zap, Download, Mail, ExternalLink, Globe, FileText, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press & Media Kit | CVOptimizerAI',
  description: 'Official press resources, brand assets, and contact information for CVOptimizerAI.',
};

export default function PressPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900">
      {/* ── Navigation ─────────────────────────────────────────── */}
      <div className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-5xl z-50 flex justify-center pointer-events-none">
        <header className="flex items-center justify-between w-full h-16 px-4 md:px-6 border border-zinc-200/80 bg-white/70 backdrop-blur-xl rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] pointer-events-auto transition-all">
          <Link className="flex items-center gap-2 group" href="/">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 transition-transform group-hover:scale-110 shadow-md shadow-blue-600/20 flex-shrink-0">
              <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-zinc-900 truncate">CV Optimizer AI</span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center text-[15px] font-bold text-zinc-500">
            <Link className="hover:text-zinc-900 transition-colors" href="/templates">Templates</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/pricing">Pricing</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/blog">Blog</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/login">Login</Link>
            <Link href="/signup" className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold rounded-full px-6 h-10 flex items-center text-[14px] shadow-sm transition-all hover:scale-105 active:scale-95">
              Get Started Free
            </Link>
          </nav>
          <div className="flex md:hidden items-center gap-2">
            <Link href="/login" className="text-[13px] font-bold text-zinc-600 hover:text-zinc-900">Login</Link>
            <Link href="/signup" className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold rounded-full px-4 h-8 flex items-center text-[13px]">
              Get Started
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1 pt-36 pb-24">
        <div className="container px-6 mx-auto max-w-4xl">
          
          <header className="mb-16 text-center">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-4 block">Press Resources</span>
            <h1 className="font-serif text-4xl md:text-6xl font-black tracking-tight text-zinc-950 mb-6 uppercase">Media Kit</h1>
            <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto border-t border-b border-zinc-100 py-8 italic leading-relaxed">
              Everything you need to talk about CVOptimizerAI. High-res assets, company overview, and direct media contact.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* ── Section: About ────────────────────────────── */}
            <section className="space-y-6">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-600" />
                About CVOptimizerAI
              </h2>
              <div className="prose prose-zinc leading-relaxed text-zinc-600 font-medium">
                <p>
                  CVOptimizerAI is a leading ATS (Applicant Tracking System) optimization platform designed to help job seekers bypass automated filters and reach human recruiters.
                </p>
                <p>
                  Founded in 2024, our platform uses proprietary AI models to analyze job descriptions and resumes in real-time, providing actionable feedback that increases interview rates by an average of 38%.
                </p>
                <div className="bg-zinc-100 p-6 rounded-2xl border border-zinc-200">
                  <p className="text-sm font-bold text-zinc-950 mb-2 uppercase tracking-widest">Key Stats:</p>
                  <ul className="list-none p-0 m-0 space-y-2">
                    <li className="flex justify-between border-b border-zinc-200 pb-2">
                      <span>Users Worldwide</span>
                      <span className="font-bold text-zinc-950">20,313+</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-200 pb-2">
                      <span>ATS Checkers Supported</span>
                      <span className="font-bold text-zinc-950">50+ Systems</span>
                    </li>
                    <li className="flex justify-between">
                      <span>HQ Location</span>
                      <span className="font-bold text-zinc-950">Remote First</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ── Section: Assets ───────────────────────────── */}
            <section className="space-y-6">
              <h2 className="font-serif text-2xl font-bold flex items-center gap-3">
                <Share2 className="w-5 h-5 text-blue-600" />
                Brand Assets
              </h2>
              <p className="text-zinc-600 font-medium">Download official logos, screenshots, and team photos for use in media coverage.</p>
              
              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                    <span className="font-bold text-zinc-900 leading-none">Official Logo Pack (.SVG, .PNG)</span>
                  </div>
                  <Download className="w-4 h-4 text-zinc-400" />
                </button>
                <button className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                    <span className="font-bold text-zinc-900 leading-none">Product Screenshots (.ZIP)</span>
                  </div>
                  <Download className="w-4 h-4 text-zinc-400" />
                </button>
                <button className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 transition-colors" />
                    <span className="font-bold text-zinc-900 leading-none">Brand Guidelines (.PDF)</span>
                  </div>
                  <Download className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </section>

          </div>

          <div className="mt-20 p-12 bg-zinc-950 text-white rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="font-serif text-3xl font-bold mb-4">Media Inquiries</h2>
                <p className="text-zinc-400 font-medium max-w-sm">
                  Are you a journalist or creator? Reach out to our team for interviews, quotes, or demo access.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <a 
                  href="mailto:press@cvoptimizerai.com" 
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  <Mail className="w-5 h-5" />
                  press@cvoptimizerai.com
                </a>
              </div>
            </div>
          </div>

          <section className="mt-24 space-y-10">
            <h2 className="font-serif text-3xl font-bold text-center">Featured In</h2>
            <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              {/* Using text for now as placeholders for famous tech pubs */}
              <span className="text-2xl font-black font-serif italic tracking-tighter">TechCrunch</span>
              <span className="text-2xl font-black font-sans uppercase tracking-[0.2em]">Wired</span>
              <span className="text-2xl font-black font-serif italic">Forbes</span>
              <span className="text-2xl font-black font-sans uppercase tracking-tighter">The Verge</span>
            </div>
          </section>

        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-zinc-100 bg-white">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
          <Link className="flex items-center gap-2" href="/">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600">
              <Zap className="h-3.5 w-3.5 text-white fill-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-zinc-900">CV Optimizer AI</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-bold text-zinc-500">
            <Link className="hover:text-zinc-900 transition-colors" href="/pricing">Pricing</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/blog">Blog</Link>
            <Link className="text-zinc-950 transition-colors" href="/press">Press</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/login">Login</Link>
          </nav>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">© {new Date().getFullYear()} CV Optimizer AI</p>
        </div>
      </footer>
    </div>
  );
}
