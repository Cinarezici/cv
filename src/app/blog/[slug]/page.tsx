import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Zap, ArrowLeft, Calendar, Tag } from 'lucide-react';
import { blogPosts, getPostBySlug, BlogContentBlock } from '@/data/blog-posts';
import { BlogCTA } from '@/components/blog/BlogCTA';

// ── Static Params / SEO ──────────────────────────────────────────────
export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | CV Optimizer AI Blog`,
      description: post.description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

// ── Content Renderer ─────────────────────────────────────────────────
function renderContent(blocks: BlogContentBlock[], accentColor: string) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case 'h2':
        return (
          <h2 key={i} className="text-2xl font-extrabold text-zinc-900 tracking-tight mt-12 mb-6">
            {block.text}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={i} className="text-lg font-bold text-zinc-800 tracking-tight mt-8 mb-4">
            {block.text}
          </h3>
        );
      case 'p':
        return (
          <p key={i} className="text-zinc-600 leading-[1.85] text-[16px] font-medium mb-6">
            {block.text}
          </p>
        );
      case 'bold_p':
        return (
          <p key={i} className="text-zinc-800 leading-[1.85] text-[16px] font-bold mb-6 border-l-4 pl-4 italic" style={{ borderColor: accentColor }}>
            {block.text}
          </p>
        );
      case 'ul':
        return (
          <ul key={i} className="space-y-3 mb-8 ml-1">
            {block.items?.map((item, j) => (
              <li key={j} className="flex items-start gap-3 text-zinc-600 text-[15px] font-medium leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                {item}
              </li>
            ))}
          </ul>
        );
      case 'stat':
        return (
          <div key={i} className="bg-zinc-950 text-white p-8 md:p-10 my-10 rounded-2xl flex items-center gap-8 flex-wrap md:flex-nowrap border-l-4" style={{ borderLeftColor: accentColor }}>
            <div className="text-5xl md:text-6xl font-black leading-none" style={{ color: accentColor }}>
              {block.num}
            </div>
            <div className="text-[14px] md:text-[15px] text-zinc-400 font-medium leading-relaxed">
              {block.text}
            </div>
          </div>
        );
      case 'pullquote':
        return (
          <div key={i} className="border-t-2 border-b-2 py-8 my-10" style={{ borderTopColor: accentColor, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
            <p className="text-xl md:text-2xl font-serif italic text-zinc-900 leading-relaxed text-center">
              "{block.text}"
            </p>
          </div>
        );
      case 'before_after':
        return (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
            <div className="p-6 rounded-xl bg-red-50/50 border border-red-100">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3">{block.beforeLabel}</span>
              <p className="text-[14px] text-zinc-700 italic font-medium leading-relaxed m-0">
                {block.before}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-3">{block.afterLabel}</span>
              <p className="text-[14px] text-zinc-700 italic font-medium leading-relaxed m-0">
                {block.after}
              </p>
            </div>
          </div>
        );
      case 'checklist':
        return (
          <div key={i} className="bg-zinc-50 border border-zinc-200 p-8 my-10 rounded-2xl">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">{block.listTitle}</h3>
            <ul className="space-y-4">
              {block.items?.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-[15px] font-semibold text-zinc-800 leading-relaxed">
                  <span className="mt-1 font-black text-lg leading-none" style={{ color: accentColor }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'faq':
        return (
          <div key={i} className="mt-16 pt-12 border-t border-zinc-200">
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight mb-8">Frequently Asked Questions</h2>
            <div className="space-y-0">
              {block.faqItems?.map((item, j) => (
                <div key={j} className="py-6 border-b border-zinc-100 last:border-0">
                  <p className="text-[16px] font-bold text-zinc-900 mb-2">{item.q}</p>
                  <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'stat_row':
        return (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
            {block.statItems?.map((item, j) => (
              <div key={j} className="bg-white border border-zinc-200 p-6 text-center rounded-xl shadow-sm">
                <span className="block text-4xl font-black mb-2" style={{ color: accentColor }}>{item.num}</span>
                <span className="text-[12px] text-zinc-500 font-medium leading-tight block">{item.label}</span>
              </div>
            ))}
          </div>
        );
      case 'scenario':
        return (
          <div key={i} className="bg-zinc-950 text-white p-8 md:p-10 my-10 rounded-2xl border-l-4 shadow-xl" style={{ borderLeftColor: accentColor }}>
            <span className="block text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: accentColor }}>{block.scenarioLabel}</span>
            {block.scenarioTexts?.map((text, j) => (
              <p key={j} className="text-[15px] text-zinc-300 font-medium leading-relaxed mb-4 last:mb-0">
                {text}
              </p>
            ))}
          </div>
        );
      default:
        return null;
    }
  });
}

const tagColors: Record<string, string> = {
  ATS: 'bg-blue-50 text-blue-700 border-blue-100',
  'Career Tips': 'bg-violet-50 text-violet-700 border-violet-100',
  AI: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

// ── Page ─────────────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const tagStyle = tagColors[post.tag] || 'bg-zinc-50 text-zinc-600 border-zinc-200';

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900">

      {/* ── Floating Navbar ─────────────────────────────── */}
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
            <Link className="hover:text-zinc-900 transition-colors" href="/#pricing">Pricing</Link>
            <Link className="text-blue-600" href="/blog">Blog</Link>
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
        <div className="container px-6 mx-auto max-w-2xl xl:max-w-3xl">

          {/* ── Back link ──────────────────────────────────── */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All articles
          </Link>

          {/* ── Article Header ─────────────────────────────── */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span 
                className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border inline-flex items-center gap-1.5"
                style={{ color: post.accentColor, borderColor: `${post.accentColor}33`, backgroundColor: `${post.accentColor}08` }}
              >
                <Tag className="w-2.5 h-2.5" />
                {post.tag}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <Calendar className="w-3 h-3" />
                {post.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 leading-[1.15] mb-5">
              {post.title}
            </h1>

            <p className="text-zinc-500 text-[17px] font-medium leading-relaxed border-b border-zinc-100 pb-8">
              {post.description}
            </p>
          </header>

          {/* ── Article Body ───────────────────────────────── */}
          <article>
            {renderContent(post.content, post.accentColor)}
          </article>

          {/* ── CTA ────────────────────────────────────────── */}
          <BlogCTA />

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
            <Link className="hover:text-zinc-900 transition-colors" href="/blog">Blog</Link>
            <Link className="hover:text-zinc-900 transition-colors" href="/login">Login</Link>
          </nav>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">© {new Date().getFullYear()} CV Optimizer AI</p>
        </div>
      </footer>
    </div>
  );
}
