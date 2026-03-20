import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BlogCTA() {
  return (
    <section className="mt-12 mb-8 bg-white border border-neutral-200 rounded-[24px] shadow-sm p-8 md:p-10 flex flex-col items-center text-center max-w-3xl mx-auto">

      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 mb-3">
        Ready to optimize your CV?
      </h2>

      {/* Quiet stats — supporting context, not the hero */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-8 text-[12px] text-zinc-400 font-medium">
        <span>61% of CVs filtered before a human reads them</span>
        <span className="hidden sm:inline text-zinc-200">·</span>
        <span>94% score higher after one AI rewrite</span>
        <span className="hidden sm:inline text-zinc-200">·</span>
        <span>71% keyword match in CVs that land interviews</span>
      </div>

      {/* This is the hero */}
      <Link
        href="/signup"
        className="inline-flex items-center gap-3 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold px-10 py-4 rounded-full shadow-[0_0_24px_rgba(59,130,246,0.25)] hover:shadow-[0_0_32px_rgba(59,130,246,0.4)] transition-all hover:scale-[1.02] active:scale-95 text-[15px]"
      >
        Get Started Free
        <ArrowRight className="w-4 h-4" />
      </Link>

      <p className="text-[12px] text-zinc-400 font-medium mt-4">
        14-day free trial · No credit card required
      </p>
    </section>
  );
}
