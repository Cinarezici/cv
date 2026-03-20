'use client';

import { useState } from 'react';
import { Zap, Pen, Link2, Briefcase } from 'lucide-react';

const tabs = [
  {
    id: 'ats',
    label: 'ATS Scanner',
    icon: Zap,
    headline: 'Know your score before any recruiter does.',
    description:
      'Paste your CV and a job description. Get a score out of 100 in seconds \u2014 with every weakness ranked by how much it is costing you.',
    stat: { value: '61%', label: 'of CVs are filtered before a human ever reads them' },
    previewType: 'ats' as const,
  },
  {
    id: 'rewrite',
    label: 'AI CV Rewrite',
    icon: Pen,
    headline: 'Weak lines rewritten before any recruiter sees them.',
    description:
      'AI rewrites each bullet point to match the language of the job description \u2014 automatically, keyword by keyword.',
    stat: { value: '94%', label: 'of users see a higher ATS score after one rewrite pass' },
    previewType: 'rewrite' as const,
  },
  {
    id: 'letter',
    label: 'Shareable Letter',
    icon: Link2,
    headline: 'Send a link, not a PDF attachment.',
    description:
      'Generate a personalized presentation letter and share it via link \u2014 directly in your LinkedIn note. No attachments, no friction.',
    stat: { value: '3\u00d7', label: 'higher response rate when a link replaces an attached document' },
    previewType: 'letter' as const,
  },
  {
    id: 'jobs',
    label: 'Job Search',
    icon: Briefcase,
    headline: 'Find the job. Optimize your CV for it. In one flow.',
    description:
      'Browse LinkedIn-synced listings, save the ones you want, then tailor your CV to each role in one click.',
    stat: { value: '71%', label: 'keyword match rate in CVs that generated interview invitations' },
    previewType: 'jobs' as const,
  },
];

type PreviewType = 'ats' | 'rewrite' | 'letter' | 'jobs';

function PreviewPane({ type }: { type: PreviewType }) {
  if (type === 'ats') {
    const issues = [
      { label: 'Missing keywords from job description', severity: 'high' },
      { label: 'Non-standard section headers detected', severity: 'high' },
      { label: 'Multi-column layout may break parsing', severity: 'medium' },
      { label: 'Contact info inside header block', severity: 'low' },
    ];
    const severityColor: Record<string, string> = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-zinc-100 text-zinc-500',
    };
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3 w-full">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">ATS Score</span>
          <span className="text-3xl font-black text-red-500">38<span className="text-zinc-300 font-bold text-lg">/100</span></span>
        </div>
        <div className="space-y-2">
          {issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`shrink-0 mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${severityColor[issue.severity]}`}>{issue.severity}</span>
              <span className="text-[13px] text-zinc-600 leading-snug">{issue.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'rewrite') {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3 w-full">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">Before</p>
          <p className="text-[13px] text-zinc-500 leading-relaxed line-through">
            Responsible for managing social media accounts and posting content.
          </p>
        </div>
        <div className="h-px bg-zinc-100" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">After \u2014 AI Rewrite</p>
          <p className="text-[13px] text-zinc-800 font-medium leading-relaxed">
            Grew LinkedIn following from 1.2K to 18K in 9 months by launching a weekly thought-leadership series.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'letter') {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 w-full space-y-4">
        <p className="text-[12px] font-semibold text-zinc-500">Works directly in LinkedIn messages</p>
        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
          <Link2 className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-[13px] font-mono text-zinc-700 truncate">cvoptimizerai.com/cv/abc123</span>
        </div>
        <div className="text-[12px] text-zinc-400 text-center">Opens on any device \u00b7 No login required for viewer</div>
      </div>
    );
  }

  // jobs
  const jobs = [
    { role: 'Product Manager', company: 'Stripe', match: 74 },
    { role: 'Growth Lead', company: 'Notion', match: 61 },
    { role: 'Operations Manager', company: 'Revolut', match: 89 },
  ];
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3 w-full">
      {jobs.map((job, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-bold text-zinc-800">{job.role}</p>
            <p className="text-[12px] text-zinc-400">{job.company}</p>
          </div>
          <div className={`text-[12px] font-black px-3 py-1 rounded-full ${job.match >= 80 ? 'bg-green-50 text-green-600' : job.match >= 65 ? 'bg-amber-50 text-amber-600' : 'bg-zinc-100 text-zinc-500'}`}>
            {job.match}% match
          </div>
        </div>
      ))}
    </div>
  );
}

export function BlogFeatures() {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const active = tabs.find((t) => t.id === activeId)!;
  const Icon = active.icon;

  return (
    <section className="w-full bg-[#F8F9FA] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Label */}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 text-center mb-10">
          Everything inside CV Optimizer AI
        </p>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveId(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold border transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: copy + stat */}
          <div className="space-y-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 self-start">
              <Icon className="w-4 h-4 text-[#2563EB]" strokeWidth={2} />
            </div>
            <h3 className="text-[20px] font-extrabold text-zinc-900 leading-tight tracking-tight">
              {active.headline}
            </h3>
            <p className="text-[15px] text-zinc-500 font-medium leading-relaxed">
              {active.description}
            </p>
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-start gap-4">
              <span className="text-3xl font-black text-blue-600 shrink-0">{active.stat.value}</span>
              <span className="text-[13px] text-zinc-500 font-medium leading-snug pt-1">{active.stat.label}</span>
            </div>
          </div>

          {/* Right: preview */}
          <div>
            <PreviewPane type={active.previewType} />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-zinc-400 font-medium mt-10">
          Joined by 20,313+ professionals \u00b7 14-day free trial \u00b7 No credit card required
        </p>
      </div>
    </section>
  );
}
