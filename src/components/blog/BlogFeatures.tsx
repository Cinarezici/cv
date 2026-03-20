'use client';

import { useState } from 'react';
import { Zap, Pen, Link2, Search, Star, CheckCircle2, Linkedin } from 'lucide-react';

type TabId = 'ats' | 'rewrite' | 'letter' | 'jobs';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'ats', label: 'ATS Scanner', icon: Zap },
  { id: 'rewrite', label: 'AI CV Rewrite', icon: Pen },
  { id: 'letter', label: 'Shareable Letter', icon: Link2 },
  { id: 'jobs', label: 'Job Search', icon: Search },
];

const content: Record<TabId, { headline: string; description: string; stat: string; statLabel: string }> = {
  ats: {
    headline: 'Know exactly why you get filtered out.',
    description: 'Paste your CV and the job description. Get a score out of 100 in seconds — with every weakness ranked by impact, so you fix the right things first.',
    stat: '61%',
    statLabel: 'of CVs are rejected before a human ever reads them',
  },
  rewrite: {
    headline: 'Weak lines rewritten before any recruiter sees them.',
    description: 'AI rewrites every bullet point to match the exact language of the job description. Keyword-matched automatically — no guessing, no manual editing.',
    stat: '94%',
    statLabel: 'of users score higher after one AI rewrite pass',
  },
  letter: {
    headline: 'Send a link, not a PDF attachment.',
    description: "LinkedIn invite notes don't support file attachments. So send a shareable Presentation Letter link instead — and let the recruiter see exactly why you're the right hire.",
    stat: '3\u00d7',
    statLabel: 'higher response rate vs. an attached PDF',
  },
  jobs: {
    headline: 'Find it. Save it. Optimize for it in one click.',
    description: 'Browse LinkedIn-synced job listings, save the ones you want, and tailor your CV to each role in one click. Your pipeline, fully organized.',
    stat: '71%',
    statLabel: 'keyword match rate in CVs that generated interview calls',
  },
};

/* ── Per-tab preview panels ─────────────────────────────────────────── */

function ATSPreview() {
  const issues = [
    { label: 'Missing keywords from job description', sev: 'high' },
    { label: 'Non-standard section headers detected', sev: 'high' },
    { label: 'Multi-column layout may break parsing', sev: 'medium' },
    { label: 'Contact info inside header block', sev: 'low' },
  ];
  const color: Record<string, string> = {
    high: 'bg-red-50 border-red-100 text-red-600',
    medium: 'bg-amber-50 border-amber-100 text-amber-600',
    low: 'bg-zinc-50 border-zinc-200 text-zinc-500',
  };
  return (
    <div className="bg-white rounded-[24px] border border-neutral-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">ATS Compatibility</p>
        <span className="text-4xl font-black text-red-500">38<span className="text-zinc-200 text-2xl font-bold">/100</span></span>
      </div>
      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full" style={{ width: '38%' }} />
      </div>
      <div className="space-y-2 pt-1">
        {issues.map((issue, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className={`shrink-0 mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${color[issue.sev]}`}>{issue.sev}</span>
            <span className="text-[13px] text-zinc-600 font-medium leading-snug">{issue.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewritePreview() {
  return (
    <div className="bg-white rounded-[24px] border border-neutral-200 shadow-sm p-6 space-y-4">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-red-400 mb-2">Original</p>
        <p className="text-[14px] text-zinc-400 font-medium leading-relaxed line-through decoration-red-300">
          Responsible for managing social media accounts and posting content.
        </p>
      </div>
      <div className="h-px bg-zinc-100" />
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600 mb-2">AI Rewrite</p>
        <p className="text-[14px] text-zinc-800 font-semibold leading-relaxed">
          Grew LinkedIn following from 1.2K to 18K in 9 months by launching a weekly thought-leadership series — contributing to a 31% increase in inbound pipeline.
        </p>
      </div>
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">ATS Match: 89/100</span>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">+51 points</span>
      </div>
    </div>
  );
}

function LetterPreview() {
  return (
    <div
      className="rounded-[24px] p-6 space-y-5"
      style={{ background: 'linear-gradient(135deg, #0f1728 0%, #1a2744 50%, #0f1728 100%)' }}
    >
      {/* 3-step flow */}
      <div className="space-y-3">
        {[
          { step: '01', label: 'Find & Save a Job', desc: 'Search LinkedIn-synced listings, star the ones you love.' },
          { step: '02', label: 'Optimize CV + Generate Letter', desc: 'AI tailors your CV and creates a personalized letter.' },
          { step: '03', label: 'Copy Link \u2192 Paste in LinkedIn Note', desc: 'Share it directly — before anyone else can.', highlight: true },
        ].map((s) => (
          <div
            key={s.step}
            className={`flex items-start gap-3 p-3 rounded-xl border ${s.highlight ? 'bg-blue-600/10 border-blue-500/40' : 'bg-white/5 border-white/10'}`}
          >
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest shrink-0 pt-0.5">{s.step}</span>
            <div>
              <p className={`text-[13px] font-bold leading-snug ${s.highlight ? 'text-white' : 'text-zinc-200'}`}>{s.label}</p>
              <p className="text-[12px] text-zinc-400 font-medium leading-relaxed">{s.desc}</p>
            </div>
            {s.highlight && (
              <span className="ml-auto shrink-0 text-[10px] font-black bg-gradient-to-r from-blue-600 to-blue-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">USP</span>
            )}
          </div>
        ))}
      </div>

      {/* LinkedIn note mock */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Linkedin className="w-4 h-4 text-[#0a66c2]" />
          <span className="text-[12px] font-bold text-zinc-300">LinkedIn \u00b7 Add a note</span>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[13px] text-zinc-300 font-medium leading-relaxed">
          Hi Sarah \u2014 I prepared a letter specifically for this role:{' '}
          <span className="text-blue-400 font-bold underline underline-offset-2">
            cvoptimizerai.com/letter/abc123
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-[11px] text-zinc-500 font-medium">This is what separates you from every other applicant.</p>
        </div>
      </div>
    </div>
  );
}

function JobsPreview() {
  const [saved, setSaved] = useState([true, false, false]);
  const mockJobs = [
    { title: 'Product Manager', company: 'Stripe', location: 'Remote \u00b7 Full-time', match: 89 },
    { title: 'Growth Lead', company: 'Notion', location: 'London \u00b7 Hybrid', match: 74 },
    { title: 'Operations Manager', company: 'Revolut', location: 'Berlin \u00b7 On-site', match: 61 },
  ];
  return (
    <div className="bg-white rounded-[24px] border border-neutral-200 shadow-sm p-6 space-y-3">
      {mockJobs.map((job, i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-zinc-50 last:border-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 border border-zinc-200 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-black text-zinc-400">{job.company[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-zinc-900 truncate">{job.title}</p>
            <p className="text-[11px] text-zinc-400 font-medium">{job.company} \u00b7 {job.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${job.match >= 80 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : job.match >= 70 ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
              {job.match}%
            </span>
            <button onClick={() => setSaved(prev => { const n = [...prev]; n[i] = !n[i]; return n; })} className="p-1 rounded-lg hover:bg-zinc-50 transition-colors">
              <Star className={`w-4 h-4 transition-all ${saved[i] ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'}`} />
            </button>
          </div>
        </div>
      ))}
      <p className="text-center text-[12px] text-zinc-400 font-medium pt-1">
        \u2605 Saved jobs appear in your dashboard \u2014 ready for CV optimization
      </p>
    </div>
  );
}

const PreviewMap: Record<TabId, React.ElementType> = {
  ats: ATSPreview,
  rewrite: RewritePreview,
  letter: LetterPreview,
  jobs: JobsPreview,
};

/* ── Main component ─────────────────────────────────────────────────── */

export function BlogFeatures() {
  const [activeId, setActiveId] = useState<TabId>('ats');
  const active = content[activeId];
  const ActivePreview = PreviewMap[activeId];
  const ActiveIcon = tabs.find(t => t.id === activeId)!.icon;

  return (
    <section className="w-full py-24 bg-[#fafafa] border-t border-zinc-100">
      <div className="container px-6 mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-600 mb-4">
            Everything inside CV Optimizer AI
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">
            Every tool you need — in one place.
          </h2>
          <p className="text-base text-zinc-500 font-medium max-w-xl mx-auto">
            From CV score to shareable link. See exactly how each feature works.
          </p>
        </div>

        {/* Tab bar — matches the homepage pill style */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = id === activeId;
            return (
              <button
                key={id}
                onClick={() => setActiveId(id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold border transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Main 2-col panel */}
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Left — copy + stat */}
          <div className="space-y-6">
            <div className="size-12 rounded-[16px] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center">
              <ActiveIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tight leading-snug">
              {active.headline}
            </h3>
            <p className="text-[16px] text-zinc-500 font-medium leading-relaxed">
              {active.description}
            </p>
            {/* Data stat card — matches homepage feature card style */}
            <div className="bg-white p-5 rounded-[20px] border border-neutral-200 shadow-sm flex items-start gap-4">
              <span className="text-4xl font-black text-[#2563eb] shrink-0 leading-none">{active.stat}</span>
              <span className="text-[14px] text-zinc-500 font-medium leading-snug pt-1">{active.statLabel}</span>
            </div>
          </div>

          {/* Right — interactive preview */}
          <div>
            <ActivePreview />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[13px] text-zinc-400 font-medium mt-14">
          Joined by 20,313+ professionals \u00b7 14-day free trial \u00b7 No credit card required
        </p>
      </div>
    </section>
  );
}
