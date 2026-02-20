import { Hero } from "@/components/ui/hero-1";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 z-10 bg-transparent">
        <span className="text-sm tracking-[0.14em] uppercase text-zinc-400 font-bold">
          Interview-Ready CV
        </span>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900/50">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <Hero
        title="Nail Your Next Interview"
        subtitle="Upload your LinkedIn profile or resume text, paste the job description, and let our AI tailor your experience instantly. Land more interviews with ATS-optimized, targeted resumes."
        eyebrow="Powered by AI & OpenAI"
        ctaLabel="Start Optimizing Free"
        ctaHref="/signup"
      />
    </div>
  );
}
