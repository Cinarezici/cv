import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blog-posts';
import { BlogCard } from '@/components/blog/BlogCard';

export const metadata: Metadata = {
  title: 'Resume & CV Tips 2026 | CVOptimizerAI Blog',
  description: 'Career tips, ATS guides, and AI insights. Learn how to land more interviews and write a resume that gets noticed with our expert guides.',
  alternates: { canonical: 'https://cvoptimizerai.com/blog' },
  openGraph: {
    title: 'Resume & CV Tips 2026 | CVOptimizerAI Blog',
    description: 'Career tips, ATS guides, and AI insights from the CVOptimizerAI team.',
    type: 'website',
    url: 'https://cvoptimizerai.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume & CV Tips 2026 | CVOptimizerAI Blog',
    description: 'Career tips, ATS guides, and AI insights.',
  },
};

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900">

      {/* ── Floating Navbar ─────────────────────────────── */}

      <main className="flex-1 pt-36 pb-24">
        <div className="container px-6 mx-auto max-w-5xl">

          {/* ── Editorial Masthead ─────────────────────────── */}
          <div className="mb-20 text-center border-b-2 border-zinc-900 pb-16">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-6">CVOptimizerAI · Editorial</p>
            <h1 className="font-serif text-5xl md:text-7xl font-black tracking-tight text-zinc-950 leading-[1.05] mb-8">
              What Nobody Tells You<br />About <span className="italic text-[#f97316]">Getting Hired</span>
            </h1>
            <p className="font-mono text-[11px] text-zinc-400 uppercase tracking-[0.1em] flex items-center justify-center gap-4">
              <span>Investigations</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300" />
              <span>cvoptimizerai.com</span>
            </p>
          </div>

          {/* ── Blog Grid ──────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {/* ── Newsletter strip ───────────────────────────── */}
          <div className="mt-20 text-center">
            <p className="text-sm text-zinc-400 font-medium">
              More posts coming soon.{' '}
              <Link href="/signup" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
                Start optimising your CV now <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-zinc-100 bg-[#fafafa]">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
          <Link className="flex items-center gap-2" href="/">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600">
              <Zap className="h-3.5 w-3.5 text-white fill-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-zinc-900">CV Optimizer AI</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-bold text-zinc-500">
            <Link className="hover:text-zinc-900 transition-colors" href="/templates">Templates</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/free-ats-checker">Free ATS Checker</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/resume-score-checker">Resume Score Checker</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/about">About</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/blog">Blog</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/login">Login</Link>
          </nav>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">© {new Date().getFullYear()} CV Optimizer AI</p>
        </div>
      </footer>
    </div>
  );
}
