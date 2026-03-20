import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export function BlogCTA() {
  return (
    <section className="mt-12 mb-8 max-w-3xl mx-auto">
      {/* Card with light blue radial gradient — matches the reference image */}
      <div
        className="relative overflow-hidden rounded-[28px] border border-blue-100 px-8 py-12 md:px-16 flex flex-col items-center text-center"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #dbeafe 0%, #f0f7ff 40%, #ffffff 100%)',
        }}
      >
        {/* Blue circle icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2563eb] shadow-lg shadow-blue-600/30 mb-6">
          <Zap className="h-5 w-5 text-white fill-white" />
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 mb-3">
          Ready to optimize your CV?
        </h2>

        <p className="text-[16px] text-zinc-500 font-medium leading-relaxed max-w-sm mb-8">
          Get an instant ATS score, AI-powered rewrites, and land more interviews — in minutes.
        </p>

        <Link
          href="/signup"
          className="inline-flex items-center gap-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 text-[15px]"
        >
          Get Started Free
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-[13px] text-zinc-400 font-medium mt-5">
          14-day free trial · No credit card required
        </p>
      </div>
    </section>
  );
}
