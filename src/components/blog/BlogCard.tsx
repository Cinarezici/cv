import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/data/blog-posts';

const tagColors: Record<string, string> = {
  ATS: 'bg-blue-50 text-blue-700 border-blue-100',
  'Career Tips': 'bg-violet-50 text-violet-700 border-violet-100',
  AI: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export function BlogCard({ post }: { post: BlogPost }) {
  const accentStyle = {
    color: post.accentColor,
    borderColor: `${post.accentColor}33`, // 20% opacity
    backgroundColor: `${post.accentColor}08`, // 3% opacity
  };

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white p-8 rounded-[24px] border border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      style={{ borderTop: `4px solid ${post.accentColor}` }}
    >
      <div className="flex items-center justify-between mb-5">
        <span 
          className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-sm border"
          style={accentStyle}
        >
          {post.tag}
        </span>
        <span className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em]">{post.readingTime}</span>
      </div>

      <h2 className="font-serif text-xl font-extrabold text-zinc-900 tracking-tight leading-snug mb-3 group-hover:opacity-70 transition-opacity">
        {post.title}
      </h2>

      <p className="text-zinc-500 text-[15px] leading-relaxed font-medium line-clamp-3 mb-6">
        {post.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-50">
        <div 
          className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-widest group-hover:gap-2.5 transition-all"
          style={{ color: post.accentColor }}
        >
          Read article
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
        <span className="font-mono text-[10px] text-zinc-400 font-medium uppercase tracking-widest">{post.date}</span>
      </div>
    </Link>
  );
}
