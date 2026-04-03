import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function RelatedComparisons({ currentPath }: { currentPath?: string }) {
  const links = [
    { title: "Rezi vs Teal", path: "/rezi-vs-teal" },
    { title: "Rezi vs Jobscan", path: "/rezi-vs-jobscan" },
    { title: "Jobscan vs Resume.io", path: "/jobscan-vs-resume-io" },
    { title: "Best ATS Resume Checker", path: "/best-ats-resume-checker" },
  ].filter(l => l.path !== currentPath);

  return (
    <section className="w-full bg-[#fafafa] py-16 border-t border-zinc-100/80">
      <div className="container px-6 mx-auto max-w-5xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 mb-8">Related Comparisons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {links.map(link => (
            <Link key={link.path} href={link.path} className="group bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
              <h3 className="font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors">{link.title}</h3>
              <p className="text-sm font-medium text-blue-600 flex items-center gap-1">Read comparison <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
