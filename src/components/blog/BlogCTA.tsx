import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export function BlogCTA() {
  return (
    <section className="mt-16 mb-4 rounded-[24px] bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-100 p-10 md:p-14 text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mx-auto mb-6 shadow-md shadow-blue-600/20">
        <Zap className="h-5 w-5 text-white fill-white" />
      </div>

      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 mb-3">
        Ready to optimise your CV?
      </h2>
      <p className="text-zinc-500 text-[15px] font-medium mb-8 max-w-md mx-auto leading-relaxed">
        Get an instant ATS score, AI-powered rewrites, and land more interviews — in minutes.
      </p>

      <Link
        href="/signup"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full shadow-md shadow-blue-600/25 hover:shadow-lg transition-all hover:scale-[1.03] active:scale-95 text-[15px]"
      >
        Get Started Free
        <ArrowRight className="w-4 h-4" />
      </Link>

      <p className="text-xs text-zinc-400 font-medium mt-4">
        14-day free trial · No credit card required
      </p>
    </section>
  );
}
