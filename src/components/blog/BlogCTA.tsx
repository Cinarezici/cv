import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export function BlogCTA() {
  return (
    <section className="mt-20 mb-10 bg-white border border-zinc-100 p-12 md:p-16 text-center rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col items-center">
      
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 mb-8 shadow-lg shadow-blue-600/20">
        <Zap className="h-6 w-6 text-white fill-white" />
      </div>

      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4 max-w-lg">
        Ready to optimise your CV?
      </h2>
      <p className="text-zinc-500 text-[17px] font-medium mb-10 max-w-xl mx-auto leading-relaxed px-4">
        Get an instant ATS score, AI-powered rewrites, and land more interviews — in minutes.
      </p>

      <Link
        href="/signup"
        className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.03] active:scale-95 text-[15px]"
      >
        Get Started Free
        <ArrowRight className="w-4 h-4" />
      </Link>

      <p className="text-[13px] text-zinc-400 font-medium mt-8">
        14-day free trial · No credit card required
      </p>
    </section>
  );
}
