import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

const stats = [
  { value: '61%', label: 'of CVs filtered before a human reads them', icon: '🚫' },
  { value: '94%', label: 'higher ATS score after one AI rewrite pass', icon: '✦' },
  { value: '71%', label: 'keyword match in CVs that landed interviews', icon: '🎯' },
];

export function BlogCTA() {
  return (
    <section className="mt-12 mb-8 bg-white border border-neutral-200 p-8 md:p-10 text-center rounded-[24px] shadow-sm relative overflow-hidden flex flex-col items-center max-w-3xl mx-auto">
      
      {/* Icon — matches homepage feature card icon style */}
      <div className="size-12 rounded-[16px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center mb-6">
        <Zap className="h-6 w-6 text-blue-600" />
      </div>

      <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-3">
        Your next move
      </p>

      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 mb-8">
        Ready to optimize your CV?
      </h2>
      
      {/* Stats row — each stat is its own mini card, matching the homepage card style */}
      <div className="grid grid-cols-3 gap-3 w-full mb-8">
        {stats.map((stat) => (
          <div
            key={stat.value}
            className="bg-[#fafafa] border border-zinc-100 rounded-2xl p-4 flex flex-col items-center gap-1.5"
          >
            <span className="text-xs leading-none">{stat.icon}</span>
            <span className="text-2xl md:text-3xl font-black text-[#2563eb] leading-none">{stat.value}</span>
            <span className="text-[11px] text-zinc-400 font-medium leading-snug text-center">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* CTA Button — matches homepage gradient button style */}
      <Link
        href="/signup"
        className="inline-flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold px-8 py-3.5 rounded-full shadow-[0_0_24px_rgba(59,130,246,0.25)] hover:shadow-[0_0_32px_rgba(59,130,246,0.4)] transition-all hover:scale-[1.02] active:scale-95 text-[14px]"
      >
        Get Started Free
        <ArrowRight className="w-4 h-4" />
      </Link>

      <p className="text-[12px] text-zinc-400 font-medium mt-5">
        14-day free trial · No credit card required
      </p>
    </section>
  );
}
