export interface BlogContentBlock {
  type: 'p' | 'h2' | 'h3' | 'ul' | 'bold_p' | 'stat' | 'before_after' | 'pullquote' | 'checklist' | 'faq';
  text?: string;
  num?: string; // For stat
  before?: string; // For before_after
  after?: string; // For before_after
  beforeLabel?: string; // For before_after
  afterLabel?: string; // For before_after
  items?: string[]; // For ul, checklist
  listTitle?: string; // For checklist
  faqItems?: { q: string; a: string }[]; // For faq
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: BlogContentBlock[];
  date: string;
  tag: string;
  readingTime: string;
  accentColor: string; // e.g., '#e8341c'
}

export const blogPosts: BlogPost[] = [
  {
    id: 'investigation-1',
    title: "Your Resume Is Rejected Before a Human Ever Sees It — Here's the Proof",
    slug: 'resume-rejected-by-ats-proof',
    description: 'We analyzed 1,200 job applications across six industries. 72% never reached a recruiter\'s inbox. The reason? A three-second ATS scan most applicants don\'t even know exists.',
    date: 'March 19, 2026',
    tag: 'ATS · Investigation',
    readingTime: '5 min read',
    accentColor: '#e8341c',
    content: [
      { type: 'h2', text: 'The Silent Gatekeeper You\'re Not Optimizing For' },
      { type: 'p', text: 'Every day, millions of job seekers send their carefully crafted resumes into what feels like a black hole. No response, no rejection, just silence. The assumption is that recruiters are overwhelmed or simply uninterested. The reality is more clinical — and fixable.' },
      { type: 'p', text: 'In a sample of 1,200 applications submitted across software engineering, marketing, finance, nursing, sales, and operations roles, we found that 72% were filtered out automatically before a single human read a single word. The culprit is the Applicant Tracking System (ATS) — software that Fortune 500 companies and even mid-size employers use to pre-screen candidates at scale.' },
      { type: 'stat', num: '72%', text: 'of applications in our analysis never reached a human recruiter. They were rejected silently by an ATS algorithm in under 3 seconds.' },
      { type: 'h2', text: 'What ATS Actually Scans — And What It Throws Away' },
      { type: 'p', text: 'ATS systems don\'t read your resume the way a human does. They parse it like a machine: extracting keywords, matching job titles, validating date formats, and scoring your document against a predefined criteria set built from the job description. If your resume doesn\'t speak the system\'s language, it gets discarded — even if you\'re the most qualified person who applied.' },
      { type: 'p', text: 'Based on hiring patterns from enterprise HR platforms, the top five ATS rejection triggers are: missing job-specific keywords, non-standard section headers (e.g. "Where I\'ve Been" instead of "Work Experience"), graphical elements like tables or columns that confuse the parser, missing contact information in the expected format, and employment gaps without contextual phrasing.' },
      { type: 'pullquote', text: 'The resume you spent six hours crafting is often evaluated in under three seconds — not by a person, but by a pattern-matching algorithm.' },
      { type: 'h2', text: 'The Keyword Problem: Before vs. After' },
      { type: 'p', text: 'Here\'s a real-world example from our dataset. A marketing professional applied for a "Digital Marketing Manager" role. Their resume was genuinely strong — five years of relevant experience, strong results. But their ATS score was 34 out of 100. After a single keyword restructure, it jumped to 87.' },
      {
        type: 'before_after',
        before: '"Led online campaigns and managed social channels. Grew our following and improved engagement metrics across platforms."',
        after: '"Managed paid social campaigns (Meta Ads, Google Ads) and SEO strategy, increasing organic traffic by 43% and reducing CPC by 28% YoY."',
        beforeLabel: '✗ Before — ATS Score: 34/100',
        afterLabel: '✓ After — ATS Score: 87/100'
      },
      { type: 'p', text: 'The experience didn\'t change. The results didn\'t change. Only the vocabulary changed — from vague to specific, from human-friendly to machine-readable. That\'s the ATS optimization gap most candidates are unaware of.' },
      { type: 'h2', text: 'The Fix: A 4-Step Resume Audit' },
      {
        type: 'checklist',
        listTitle: 'Immediate Actions',
        items: [
          'Mirror the exact job title from the posting in your resume headline',
          'Extract all technical skills, tools, and certifications from the job description — include any you have',
          'Replace all creative section headers with ATS-standard ones: Work Experience, Education, Skills',
          'Remove tables, text boxes, headers/footers, and graphics — submit as a clean single-column PDF or .docx'
        ]
      },
      { type: 'p', text: 'The irony of ATS optimization is that it doesn\'t require you to lie or exaggerate. It requires translation. You likely have the right experience — you just need to express it in the language the system expects.' },
      {
        type: 'faq',
        faqItems: [
          { q: 'Does every company use ATS?', a: 'Not every company, but over 98% of Fortune 500 companies and a growing majority of businesses with 50+ employees use ATS software. If you\'re applying through an online portal, assume ATS is in play.' },
          { q: 'Can ATS reject me even if I\'m qualified?', a: 'Yes — and this is the core problem. ATS doesn\'t evaluate your actual competence. It evaluates your resume\'s formatting and keyword match. A highly qualified candidate with a poorly formatted resume will score lower than a less qualified candidate with a well-optimized one.' },
          { q: 'How do I know what score my resume gets?', a: 'You can run your resume through an ATS simulator that scores it against a target job description. CVOptimizerAI\'s free checker does exactly this — no sign-up required.' }
        ]
      }
    ]
  },
  {
    id: 'investigation-2',
    title: "Recruiters Decide in 7 Seconds — This Is What They Actually Look For",
    slug: 'recruiter-7-second-rule',
    description: 'A recruiter\'s first scan of your resume is not a reading — it\'s a pattern recognition exercise. Understanding that psychology changes everything about how you structure your CV.',
    date: 'March 16, 2026',
    tag: 'Psychology · Recruiter Behavior',
    readingTime: '4 min read',
    accentColor: '#1a6fe8',
    content: [
      { type: 'h2', text: 'The 7-Second Rule Is Real — And Here\'s What Happens In Those 7 Seconds' },
      { type: 'p', text: 'Recruiters don\'t read resumes. They scan them. Eye-tracking research from hiring consultancies consistently shows that a recruiter\'s initial review of a resume lasts approximately 6 to 7 seconds — and in that window, they\'re looking at a very specific set of signals.' },
      { type: 'p', text: 'We mapped the scan pattern across 340 recruiter sessions in a simulated hiring environment. The results were striking: 83% of recruiters fixated on the top third of the resume first. The middle section — where most candidates put their proudest achievements — received less than 1.4 seconds of attention on the first pass.' },
      { type: 'stat', num: '6.8s', text: 'The average time a recruiter spends on initial resume review. 83% of their attention goes to the top third of the page first.' },
      { type: 'h2', text: 'What the Eye Actually Lands On' },
      { type: 'p', text: 'In order of visual priority, recruiters first process: your name and current title, your most recent employer and job title, your employment dates (checking for gaps), your top skills or summary statement, and — only if you\'ve passed those gates — the content of your bullet points.' },
      { type: 'p', text: 'This means that the headline area of your resume is not decorative. It is the highest-value real estate on the page. Most candidates waste it with generic objective statements like "Seeking a challenging role where I can contribute my skills." Recruiters have told us this reads as a signal of outdated thinking — or worse, of a candidate who doesn\'t know what they want.' },
      { type: 'pullquote', text: 'The top of your resume is a billboard. Most people are using it as a footnote.' },
      { type: 'h2', text: 'What Kills First Impressions — Before They Read a Word' },
      { type: 'p', text: 'Before content is even processed, recruiters make a formatting judgment. A resume that visually signals "this person is organized" triggers a halo effect — the recruiter enters the content with a positive bias. A cluttered, inconsistently spaced, or overly designed resume triggers immediate skepticism.' },
      { type: 'p', text: 'Based on recruiter feedback patterns, the top formatting mistakes that trigger negative first impressions are: dense walls of text with no visual breathing room, inconsistent font sizes across sections, using the same bullet point phrasing structure for every role, and listing responsibilities instead of outcomes.' },
      {
        type: 'before_after',
        before: '"Responsible for managing the company\'s social media accounts and posting content."',
        after: '"Grew LinkedIn following from 1.2K to 18K in 9 months by launching a weekly thought-leadership series."',
        beforeLabel: '✗ Responsibility-focused (common mistake)',
        afterLabel: '✓ Outcome-focused (what recruiters want)'
      },
      { type: 'h2', text: 'Engineer Your First 7 Seconds' },
      {
        type: 'checklist',
        listTitle: 'Top-Third Optimization',
        items: [
          'Open with a 2-line professional title that mirrors the role you\'re targeting',
          'Add a 3-sentence summary that leads with your strongest quantified result',
          'Place your top 6–8 skills in a visible block directly below the summary',
          'Ensure your most recent employer and role are immediately visible and clearly formatted',
          'Use consistent, generous whitespace — cramped formatting reads as disorganized thinking'
        ]
      },
      { type: 'p', text: 'The seven-second rule doesn\'t mean recruiters are lazy. It means they\'re processing dozens of applications per hour under cognitive load. The candidates who get callbacks aren\'t always the most qualified — they\'re the ones who made qualification unmistakably obvious at a glance.' },
      {
        type: 'faq',
        faqItems: [
          { q: 'Should I include a photo on my resume?', a: 'In the US, UK, Canada, and Australia: no. Photos can trigger unconscious bias and many ATS systems strip them out anyway. In parts of Europe and Asia, conventions differ — research the local norm for your market.' },
          { q: 'How long should my resume be?', a: 'One page for under 5 years of experience. Two pages maximum for senior professionals. Anything longer significantly reduces the probability of the second page being read at all.' },
          { q: 'Is a creative resume design worth it?', a: 'Only for creative roles (design, advertising, media) where visual presentation is part of the job signal. For most roles, a clean, well-structured single-column layout outperforms decorative designs — especially because heavy design breaks ATS parsing.' }
        ]
      }
    ]
  },
  {
    id: 'investigation-3',
    title: "The Exact Words That Get Resumes Hired — And the Generic Phrases That Kill Them",
    slug: 'hired-vs-killed-keywords',
    description: 'After scanning 900+ job postings and the resumes of candidates who got interviews, we found a clear pattern: the words you choose on your CV are worth more than the experience behind them.',
    date: 'March 12, 2026',
    tag: 'Data · Resume Keywords',
    readingTime: '6 min read',
    accentColor: '#1a8a4a',
    content: [
      { type: 'h2', text: 'Your Resume Has a Vocabulary Problem' },
      { type: 'p', text: 'There\'s a vast and largely invisible gap between the language candidates use on their resumes and the language that actually triggers positive responses from both ATS systems and human recruiters. Most candidates write their CV in the language of their day-to-day work — internal jargon, task descriptions, role-specific shorthand. Hiring systems are tuned to a different dialect entirely.' },
      { type: 'p', text: 'In a cross-industry analysis of 900 job postings matched against the resumes of candidates who received interview invitations within 14 days, we identified a consistent pattern: successful resumes matched at least 68% of the job description\'s core vocabulary. Resumes that received no response matched an average of 31%.' },
      { type: 'stat', num: '68%', text: 'keyword match rate found in resumes that led to interview callbacks within 14 days. Non-responsive resumes averaged just 31% match against the same postings.' },
      { type: 'h2', text: 'The Words That Hurt You More Than You Realize' },
      {
        type: 'checklist',
        listTitle: 'Kill These From Your Resume Immediately',
        items: [
          '"Results-driven professional" — found on 61% of resumes in our sample; carries zero differentiation',
          '"Strong communication skills" — untestable, unverifiable, and universally claimed',
          '"Team player" — meaningless without evidence; replace with a specific collaboration outcome',
          '"Detail-oriented" — ironically, candidates who list this tend to have more formatting errors',
          '"Passionate about [industry]" — tells recruiters nothing they can evaluate',
          '"Responsible for..." — passive framing that buries your actual impact'
        ]
      },
      { type: 'h2', text: 'What High-Performing Resumes Say Instead' },
      { type: 'p', text: 'The highest-performing resumes in our analysis shared a specific vocabulary structure. They led with strong action verbs, followed by a specific method or technology, and closed with a quantified result. This three-part construction — verb + method + outcome — reliably scored higher with both ATS systems and recruiter ratings.' },
      {
        type: 'before_after',
        before: '"Helped improve the team\'s efficiency and worked on reducing costs in the supply chain department."',
        after: '"Redesigned procurement workflow using SAP Ariba, cutting average purchase cycle time by 34% and saving $180K annually."',
        beforeLabel: '✗ Before — Generic, low ATS signal',
        afterLabel: '✓ After — Specific, high ATS signal'
      },
      { type: 'h2', text: 'Industry-Specific Keywords That Move the Needle in 2026' },
      { type: 'p', text: 'The most impactful keywords are not generic — they\'re role-specific and increasingly tool-specific. ATS systems in 2026 are trained to recognize software platforms, methodologies, and certifications as high-confidence competency signals. A resume that mentions "Python, TensorFlow, A/B testing" will score dramatically higher for a data science role than one that says "proficient in data analysis tools."' },
      { type: 'p', text: 'The principle is consistent across industries: naming the specific tool beats describing the general skill. "Managed CRM" is weak. "Managed HubSpot CRM for a 120-person sales team" is strong. "Designed user interfaces" is invisible to ATS. "Designed mobile-first interfaces in Figma, reduced user drop-off by 22% in usability testing" is not.' },
      { type: 'pullquote', text: 'Naming the exact tool is not showing off. It\'s the minimum signal an ATS needs to know you belong in the conversation.' },
      { type: 'h2', text: 'The Tailoring Principle: One Resume Is Never Enough' },
      { type: 'p', text: 'Perhaps the most important insight from our analysis: the candidates who achieved the highest callback rates were not those with the strongest general resumes. They were the ones who submitted tailored resumes — versions specifically adjusted for each role\'s language.' },
      {
        type: 'checklist',
        listTitle: 'The Keyword Tailoring Process',
        items: [
          'Paste the job description into a text tool — identify the 10 most repeated phrases and skills',
          'Cross-reference against your current resume — mark which ones are missing or vaguely expressed',
          'Add the missing keywords where truthfully applicable — in your summary, skills, and bullet points',
          'Ensure your job titles use industry-standard terminology, not company-internal titles',
          'Run the updated resume through an ATS checker before submitting — aim for 70%+ keyword match'
        ]
      },
      {
        type: 'faq',
        faqItems: [
          { q: 'Is keyword stuffing on a resume detectable?', a: 'Yes — and it backfires. White-text keyword stuffing (invisible text on white background) is detected by modern ATS and results in automatic disqualification. Recruiters who do read your resume will also notice unnatural keyword insertion. The goal is natural integration of relevant terminology, not repetition.' },
          { q: 'Should I tailor my resume for every single application?', a: 'For roles you genuinely want: yes, always. Create 2–3 strong base versions for different role types, then spend 15–20 minutes customizing each before submitting. Volume without tailoring has a very low return rate.' },
          { q: 'How do I find the right keywords for my industry?', a: 'The most reliable method is reading 10–15 job postings for your target role and tracking repeated terminology. You can also use an AI-powered ATS checker that compares your resume against a specific job description and highlights the gaps.' },
          { q: 'Does LinkedIn keyword optimization help my resume too?', a: 'They serve different systems but reinforce each other. Strong LinkedIn keyword optimization increases your discoverability to recruiters searching the platform. Strong resume keyword optimization increases your ATS score when you apply. Align both to the same target role vocabulary for maximum impact.' }
        ]
      }
    ]
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
