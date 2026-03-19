export interface BlogContentBlock {
  type: 'p' | 'h2' | 'h3' | 'ul' | 'bold_p';
  text?: string;
  items?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: BlogContentBlock[];
  date: string;
  tag: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Why Your Resume Gets Rejected by ATS (And How to Fix It)',
    slug: 'why-your-resume-gets-rejected-by-ats',
    description:
      'Most job applications never reach a human. Here\'s exactly why Applicant Tracking Systems reject your CV — and a step-by-step guide to fix every issue.',
    date: 'March 19, 2026',
    tag: 'ATS',
    content: [
      {
        type: 'p',
        text: 'You spent hours perfecting your resume. You hit apply. And you hear nothing. No interview, no feedback — just silence. The hard truth: your application was likely filtered out by an Applicant Tracking System (ATS) before any human ever saw it.',
      },
      {
        type: 'h2',
        text: 'What Is an ATS and Why Should You Care?',
      },
      {
        type: 'p',
        text: 'An ATS is software used by over 99% of Fortune 500 companies (and most mid-size businesses) to automatically screen incoming resumes. It parses your CV, assigns it a relevance score based on the job description, and decides whether a recruiter ever sees your application.',
      },
      {
        type: 'p',
        text: 'If your resume scores below a certain threshold, it is rejected automatically — regardless of your qualifications.',
      },
      {
        type: 'h2',
        text: 'The 6 Most Common ATS Failures',
      },
      {
        type: 'ul',
        items: [
          'Using a fancy template with tables, columns, or graphics — ATS parsers cannot read them reliably.',
          'Submitting a PDF when the job posting requires a Word document (or vice versa).',
          'Missing exact keywords from the job description — ATS uses keyword matching.',
          'Incorrect section titles — "Work Background" instead of "Work Experience" confuses parsers.',
          'Contact information inside the header or footer — many ATS systems skip these areas entirely.',
          'Unexplained acronyms — always write out the full phrase once (e.g., "Search Engine Optimisation (SEO)").',
        ],
      },
      {
        type: 'h2',
        text: 'How to Write an ATS-Optimised Resume',
      },
      {
        type: 'h3',
        text: '1. Mirror the Job Description Keywords',
      },
      {
        type: 'p',
        text: 'Read the job posting carefully and identify the specific skills, tools, and qualifications mentioned. Incorporate those exact phrases naturally into your resume. If the job says "data analysis using Python", your resume should say the same — not "Python programming" or "analytics work".',
      },
      {
        type: 'h3',
        text: '2. Use a Clean, Single-Column Layout',
      },
      {
        type: 'p',
        text: 'Avoid multi-column layouts, text boxes, and tables. A simple, single-column format with clear sections is the safest approach. ATS systems parse content linearly — things in the wrong column can end up in the wrong place.',
      },
      {
        type: 'h3',
        text: '3. Stick to Standard Section Headings',
      },
      {
        type: 'ul',
        items: [
          'Work Experience (not "Career History" or "Professional Journey")',
          'Education (not "Academic Background")',
          'Skills (not "Core Competencies" — though this one is usually fine)',
          'Summary or Professional Summary',
        ],
      },
      {
        type: 'h3',
        text: '4. Use Measurable Achievements',
      },
      {
        type: 'p',
        text: 'ATS systems rank resumes higher when they contain quantified results. Instead of "managed a team", write "led a team of 8 engineers, delivering the project 2 weeks ahead of schedule and 15% under budget". Numbers get noticed — by both software and humans.',
      },
      {
        type: 'h2',
        text: 'Check Your ATS Score Before You Apply',
      },
      {
        type: 'p',
        text: 'The fastest way to know how your resume performs is to test it. CV Optimizer AI provides an instant ATS score alongside specific recommendations for every weakness. Paste your CV, paste the job description, and get a detailed report in seconds.',
      },
      {
        type: 'bold_p',
        text: 'Stop guessing. Start optimising.',
      },
    ],
  },
  {
    id: '2',
    title: '7 Cover Letter Mistakes That Kill Your Chances',
    slug: '7-cover-letter-mistakes-that-kill-your-chances',
    description:
      'A weak cover letter can disqualify even the strongest candidate. Learn the 7 most common mistakes — and how to write one that actually gets read.',
    date: 'March 15, 2026',
    tag: 'Career Tips',
    content: [
      {
        type: 'p',
        text: 'Most candidates write the same cover letter for every job. Recruiters notice immediately. Here are the seven mistakes that ensure yours goes straight to the bin.',
      },
      {
        type: 'h2',
        text: 'Mistake 1: Starting With "I Am Writing To Apply For..."',
      },
      {
        type: 'p',
        text: 'This opening is used in approximately 70% of all cover letters. It signals zero creativity and zero effort. Lead with your strongest value proposition instead. "In my three years at Revolut, I reduced customer churn by 22% — and I\'m excited to bring that same focus to the growth team at Stripe."',
      },
      {
        type: 'h2',
        text: 'Mistake 2: Summarising Your Resume',
      },
      {
        type: 'p',
        text: 'A cover letter is not a repeat of your resume. It is your chance to tell the story behind the numbers, explain a career transition, or show genuine enthusiasm for the specific company. Use it differently.',
      },
      {
        type: 'h2',
        text: 'Mistake 3: Addressing It "To Whom It May Concern"',
      },
      {
        type: 'p',
        text: 'Five minutes on LinkedIn will almost always reveal the hiring manager\'s name. Use it. "Dear Sarah," is always better than "Dear Hiring Manager".',
      },
      {
        type: 'h2',
        text: 'The Other 4 Mistakes',
      },
      {
        type: 'ul',
        items: [
          'Writing more than one page — recruiters spend 6–8 seconds on a first read.',
          'Focusing on what the company can do for you, not what you can do for them.',
          'Sending a generic letter with no mention of the company\'s specific product, mission, or recent news.',
          'Typos and grammatical errors — instant disqualification in many companies.',
        ],
      },
      {
        type: 'h2',
        text: 'The Formula That Works',
      },
      {
        type: 'p',
        text: 'Opening hook (1–2 sentences) → Specific relevant achievement → Connection to the company\'s goals → Clear call to action. Keep it under 300 words. Make every sentence earn its place.',
      },
    ],
  },
  {
    id: '3',
    title: 'How AI Changes the Job Application Game in 2026',
    slug: 'how-ai-changes-job-applications-in-2026',
    description:
      'AI-powered tools are reshaping every stage of the hiring process. Here\'s what that means for candidates — and how to use it to your advantage.',
    date: 'March 10, 2026',
    tag: 'AI',
    content: [
      {
        type: 'p',
        text: 'The job application landscape has changed more in the last 18 months than in the previous decade. AI is now embedded in every stage of the hiring funnel — from how companies screen candidates to how applicants prepare their materials.',
      },
      {
        type: 'h2',
        text: 'How Companies Are Using AI to Screen You',
      },
      {
        type: 'ul',
        items: [
          'ATS systems with AI scoring (not just keyword matching, but semantic relevance)',
          'AI video interview analysis — tone, word choice, and pacing are all scored',
          'Automated LinkedIn outreach assessments',
          'GitHub and portfolio AI scans for technical roles',
        ],
      },
      {
        type: 'h2',
        text: 'How Top Candidates Are Using AI to Win',
      },
      {
        type: 'p',
        text: 'The candidates landing interviews in 2026 are not those with the best raw experience. They are the ones who best match their presentation to what the system — and the human behind it — is looking for.',
      },
      {
        type: 'h3',
        text: 'Tailoring Every Application',
      },
      {
        type: 'p',
        text: 'A generic CV sent to 100 jobs yields fewer interviews than a tailored CV sent to 10. AI tools now make per-job tailoring fast enough to be practical. Paste the job description, get a rewrite that speaks the company\'s language — in seconds.',
      },
      {
        type: 'h3',
        text: 'Instant ATS Scoring',
      },
      {
        type: 'p',
        text: 'You no longer have to guess whether your resume will pass the filter. AI-powered scanners give you a score and tell you exactly what to fix before you apply.',
      },
      {
        type: 'h2',
        text: 'The Bottom Line',
      },
      {
        type: 'bold_p',
        text: 'AI does not replace great experience. It amplifies the ability to present it effectively. The candidates who learn to use these tools will consistently out-compete those who don\'t.',
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
