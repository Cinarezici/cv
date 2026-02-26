import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, FileText, Download, Share2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <FileText className="h-6 w-6 text-indigo-600" />
          <span className="ml-2 text-xl font-bold">Interview-Ready CV</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/templates">
            Templates
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-zinc-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Build Your Career with a <span className="text-indigo-600">Perfect Resume</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl">
                  Create ATS-friendly resumes in minutes. Choose from professional templates and stand out to recruiters with our AI-powered suggestions.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button size="lg" className="px-8 font-bold">
                    Create My Resume <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" size="lg" className='font-bold'>
                    Browse Templates
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-zinc-900">Powerful Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 rounded-full bg-indigo-50">
                  <FileText className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold">Smart Editor</h3>
                <p className="text-zinc-500 text-sm">Real-time preview and intuitive editing tools to build your resume effortlessly.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 rounded-full bg-emerald-50">
                  <Download className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold">One-Click PDF</h3>
                <p className="text-zinc-500 text-sm">Download your resume as a professional PDF, ready to be sent to recruiters.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 rounded-full bg-violet-50">
                  <Share2 className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold">Shareable Link</h3>
                <p className="text-zinc-500 text-sm">Host your resume online and share it with a short, professional link.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 lg:px-6 border-t">
        <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Interview-Ready CV. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
