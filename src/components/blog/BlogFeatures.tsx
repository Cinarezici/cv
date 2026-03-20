import { Zap, Pen, Link2, Briefcase } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'ATS Scanner',
    text: 'Upload your CV and get a score out of 100. See exactly what\u2019s holding you back \u2014 ranked by impact.',
  },
  {
    icon: Pen,
    title: 'AI CV Rewrite',
    text: 'Weak bullet points rewritten before any recruiter sees them. Keyword-matched to the job description automatically.',
  },
  {
    icon: Link2,
    title: 'Shareable Presentation Letter',
    text: 'Generate a personalized letter and send a link \u2014 not an attachment \u2014 directly in your LinkedIn note.',
  },
  {
    icon: Briefcase,
    title: 'Job Search',
    text: 'LinkedIn-synced job listings. Save the ones you want, then optimize your CV for each role in one click.',
  },
];

export function BlogFeatures() {
  return (
    <section className="w-full bg-[#F8F9FA] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section label */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 text-center mb-8">
          Everything inside CV Optimizer AI
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 shrink-0 self-start">
                <Icon className="w-4 h-4 text-[#2563EB]" strokeWidth={2} />
              </div>
              <h3 className="text-[15px] font-bold text-zinc-900 leading-snug">
                {title}
              </h3>
              <p className="text-[14px] text-zinc-500 font-medium leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Footer social proof */}
        <p className="text-center text-[12px] text-zinc-400 font-medium mt-8">
          Joined by 20,313+ professionals · 14-day free trial · No credit card required
        </p>
      </div>
    </section>
  );
}
