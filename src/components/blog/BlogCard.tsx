import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/data/blog-posts';

const tagColors: Record<string, string> = {
  ATS: 'bg-blue-50 text-blue-700 border-blue-100',
  'Career Tips': 'bg-violet-50 text-violet-700 border-violet-100',
  AI: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export function BlogCard({ post }: { post: BlogPost }) {
  const tagStyle = tagColors[post.tag] || 'bg-zinc-50 text-zinc-600 border-zinc-200';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white p-8 rounded-[24px] border border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-5">
        <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${tagStyle}`}>
          {post.tag}
        </span>
        <span className="text-xs text-zinc-400 font-medium">{post.date}</span>
      </div>

      <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight leading-snug mb-3 group-hover:text-blue-600 transition-colors">
        {post.title}
      </h2>

      <p className="text-zinc-500 text-[15px] leading-relaxed font-medium line-clamp-3 mb-6">
        {post.description}
      </p>

      <div className="flex items-center gap-1.5 text-[13px] font-bold text-blue-600 group-hover:gap-2.5 transition-all">
        Read article
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}
