import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export function BlogCTA() {
  return (
    <section className="mt-12 mb-8 bg-white border border-zinc-100 p-8 md:p-10 text-center rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col items-center max-w-3xl mx-auto">
      
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mb-6 shadow-lg shadow-blue-600/20">
        <Zap className="h-5 w-5 text-white fill-white" />
      </div>

      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 mb-3">
        Ready to optimize your CV?
      </h2>
      
      <div className="flex flex-col items-start md:items-center gap-y-3 mb-8 text-zinc-600 text-[15px] font-semibold px-4 max-w-xl mx-auto">
        <div className="flex items-center gap-3 text-left md:text-center">
          <span className="text-blue-500 shrink-0">✦</span>
          <span>Your CV scored against the real job description — in seconds</span>
        </div>
        <div className="flex items-center gap-3 text-left md:text-center">
          <span className="text-blue-500 shrink-0">✦</span>
          <span>AI rewrites weak bullet points before any recruiter sees them</span>
        </div>
        <div className="flex items-center gap-3 text-left md:text-center">
          <span className="text-blue-500 shrink-0">✦</span>
          <span>Most users receive interview callbacks within 2 weeks</span>
        </div>
      </div>

      <Link
        href="/signup"
        className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.03] active:scale-95 text-[14px]"
      >
        Get Started Free
        <ArrowRight className="w-4 h-4" />
      </Link>

      <p className="text-[12px] text-zinc-400 font-medium mt-6">
        14-day free trial · No credit card required
      </p>
    </section>
  );
}
