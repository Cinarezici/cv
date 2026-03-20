export interface BlogContentBlock {
  type: 'p' | 'h2' | 'h3' | 'ul' | 'bold_p' | 'stat' | 'before_after' | 'pullquote' | 'checklist' | 'faq' | 'stat_row' | 'scenario';
  text?: string;
  num?: string; // For stat
  before?: string; // For before_after
  after?: string; // For before_after
  beforeLabel?: string; // For before_after
  afterLabel?: string; // For before_after
  items?: string[]; // For ul, checklist
  listTitle?: string; // For checklist
  faqItems?: { q: string; a: string }[]; // For faq
  statItems?: { num: string; label: string }[]; // For stat_row
  scenarioLabel?: string; // For scenario
  scenarioTexts?: string[]; // For scenario
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
  accentColor: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'investigation-1',
    title: "We Tracked 47 Job Applications Over 8 Weeks. Here's Where They Actually Got Lost.",
    slug: 'job-application-tracking-data',
    description: 'Most job seekers assume rejection happens at interview. Our tracking data tells a different story — and the real drop-off point is earlier than almost anyone expects.',
    date: 'January 14, 2026',
    tag: 'Data · Job Search',
    readingTime: '5 min read',
    accentColor: '#f97316',
    content: [
      { type: 'h2', text: 'The Assumption That Costs People Interviews' },
      { type: 'p', text: 'When applications go unanswered, the natural assumption is that something went wrong in the process — a weak cover letter, a poorly timed follow-up, an interview that didn\'t land. We tracked 47 applications submitted across marketing, operations, finance, and software roles over an eight-week period to map exactly where in the funnel candidates were losing ground.' },
      { type: 'p', text: 'The results shifted our thinking. The majority of applications weren\'t being evaluated and rejected — they were disappearing before evaluation began.' },
      { type: 'stat', num: '61%', text: 'of applications in our tracked cohort showed no sign of human review. They were filtered before a recruiter opened the file.' },
      { type: 'h2', text: 'Mapping the Drop-Off Points' },
      { type: 'p', text: 'We categorised each application outcome by the furthest stage reached: ATS filtered, recruiter screen, hiring manager review, interview, or offer. The distribution was striking. Sixty-one percent never progressed past automated filtering. A further nineteen percent reached recruiter review but were deprioritised before a screen call. Only twenty percent generated any direct human interaction.' },
      { type: 'p', text: 'This means that for every five applications submitted, four were effectively decided by an algorithm — before a single person read a word of the CV.' },
      { type: 'pullquote', text: 'The question isn\'t whether your CV impresses a recruiter. It\'s whether your CV survives long enough to reach one.' },
      { type: 'h2', text: 'What Changed When We Optimised for ATS First' },
      { type: 'p', text: 'In the second half of the tracking period, we applied ATS optimisation — keyword alignment, format standardisation, section header correction — before submitting. The shift was significant. ATS pass-through rate improved from 39% to 71%. Human review rate increased from 20% to 44%.' },
      { type: 'p', text: 'The experience and qualifications didn\'t change. The vocabulary and structure did.' },
      {
        type: 'before_after',
        before: 'Generic headers, creative section titles, skills listed in a table, summary with no role-specific keywords.',
        after: 'Standard headers, single-column layout, keywords mirrored from job descriptions, role title in summary.',
        beforeLabel: '✗ Before — Pass rate: 39%',
        afterLabel: '✓ After — Pass rate: 71%'
      },
      {
        type: 'checklist',
        listTitle: 'What we changed',
        items: [
          'Replaced all creative section headers with ATS-standard versions (Work Experience, Skills, Education)',
          'Removed tables and columns — converted to single-column plain text',
          'Added the exact job title from each posting to the CV summary before applying',
          'Pulled the top 8 keywords from each job description and verified they appeared in the CV',
          'Ran each CV through an ATS checker before submission — targeted 65%+ keyword match'
        ]
      },
      {
        type: 'faq',
        faqItems: [
          { q: 'How do you know applications were ATS filtered and not just ignored?', a: 'The signal is timing and pattern. ATS rejections typically arrive within hours and use identical templated language regardless of role. Human-reviewed rejections take longer and occasionally include role-specific feedback. The volume and speed of non-responses in our tracked cohort was consistent with automated filtering.' },
          { q: 'Does ATS optimisation help for all roles?', a: 'For any role where applications are submitted through an online portal — which covers the majority of mid-to-large employer hiring — yes. Direct outreach, referrals, and some small employer hiring bypasses ATS entirely.' }
        ]
      }
    ]
  },
  {
    id: 'investigation-2',
    title: "Your LinkedIn Gets Profile Views. Your CV Gets Silence. Here's Why They're Not the Same System.",
    slug: 'linkedin-vs-cv-systems',
    description: 'LinkedIn and your CV are optimised for completely different audiences — one for humans searching, one for algorithms filtering. Treating them the same is one of the most common and costly mistakes in job searching.',
    date: 'January 28, 2026',
    tag: 'LinkedIn · CV Strategy',
    readingTime: '4 min read',
    accentColor: '#1a6fe8',
    content: [
      { type: 'h2', text: 'Two Systems With Two Different Gatekeepers' },
      { type: 'p', text: 'A strong LinkedIn profile and a strong CV are not the same document in different formats. They serve different gatekeepers, are evaluated by different criteria, and require different optimisation strategies. Conflating them produces a result that works adequately for neither.' },
      { type: 'p', text: 'LinkedIn\'s algorithm surfaces profiles to recruiters based on keyword density, connection proximity, and engagement signals. It rewards completeness, activity, and social proof. A recruiter finding you on LinkedIn has already cleared one filter — they searched for you, which means the vocabulary matched. The CV they then request faces an entirely different test.' },
      { type: 'stat', num: '3x', text: 'more likely to receive a recruiter message on LinkedIn with an optimised profile. That message means nothing if the CV that follows can\'t pass ATS screening.' },
      { type: 'h2', text: 'Where the Disconnect Happens' },
      { type: 'p', text: 'In a sample of 200 candidates who reported receiving LinkedIn recruiter outreach but no subsequent interview progression, we found that 67% had CVs that scored below 45% on keyword match against the roles they were being contacted about. Their LinkedIn was surfacing them correctly — their CV was then failing the ATS test those same companies used.' },
      { type: 'p', text: 'The irony is that LinkedIn optimisation created false confidence. Candidates assumed that because recruiters were finding them, their job search materials were strong. The bottleneck had simply moved downstream.' },
      { type: 'pullquote', text: 'LinkedIn gets you found. Your CV gets you interviewed. Optimising one without the other solves half the problem.' },
      { type: 'h2', text: 'Aligning Both Systems' },
      { type: 'p', text: 'The most effective approach treats LinkedIn and CV optimisation as complementary but distinct exercises. LinkedIn should be optimised for the vocabulary recruiters use when searching — job titles, skills, and industry terms in their search-facing language. The CV should be optimised for the vocabulary in specific job descriptions — mirroring the exact phrasing used in each posting you apply to.' },
      {
        type: 'checklist',
        listTitle: 'LinkedIn vs CV — what to optimise differently',
        items: [
          'LinkedIn headline: use the broadest version of your target role title — what recruiters search for',
          'CV headline: use the exact title from the specific job posting you\'re applying to',
          'LinkedIn skills: add all relevant skills — completeness signals credibility to the algorithm',
          'CV skills: only include skills that appear in the job description — irrelevant additions dilute keyword density',
          'LinkedIn summary: written for a human who found you — context, narrative, credibility',
          'CV summary: written for an ATS that\'s matching you — keywords, specificity, role alignment'
        ]
      }
    ]
  },
  {
    id: 'investigation-3',
    title: "What Recruiters Actually Do in the First 30 Seconds With Your Resume — and What They Never Tell You",
    slug: 'recruiter-30-second-reality',
    description: 'Eye-tracking research and recruiter interviews reveal a decision process that\'s faster, more pattern-based, and less content-driven than most candidates assume. Here\'s what\'s actually happening on the other side of the screen.',
    date: 'February 10, 2026',
    tag: 'Recruiter Psychology · Format',
    readingTime: '5 min read',
    accentColor: '#1a8a4a',
    content: [
      { type: 'h2', text: 'The 30-Second Review Is a Myth — It\'s Actually Faster' },
      { type: 'p', text: 'Job seekers have long heard about the "six-second resume rule." The reality from eye-tracking studies is more nuanced — initial review time varies between 6 and 30 seconds depending on format quality and role seniority, but the cognitive process is consistent: recruiters are not reading. They are pattern-matching.' },
      { type: 'p', text: 'In structured interviews with 40 recruiters across technology, finance, and healthcare sectors, we asked them to describe their first-pass review process while reviewing anonymised resumes. The responses revealed a remarkably consistent three-stage micro-decision: orientation, evaluation, and binary sort.' },
      { type: 'stat', num: '94%', text: 'of recruiters in our interviews described making a "shortlist / not shortlist" mental decision before reading a single bullet point.' },
      { type: 'h2', text: 'The Three-Stage Micro-Decision' },
      { type: 'p', text: 'Stage one is orientation — recruiters locate the name, current or most recent title, and current or most recent employer. This takes 2-4 seconds and establishes whether the candidate is in the right domain. Stage two is evaluation — a rapid scan of employment dates (checking for gaps), the skills section or summary, and the overall visual organisation of the document. Stage three is the binary sort: this person stays in the pile or doesn\'t.' },
      { type: 'p', text: 'The content of individual bullet points — the achievements candidates spend the most time crafting — is evaluated only after a resume survives stages one and two. Most resumes that fail do so before the recruiter has read a single accomplishment.' },
      { type: 'pullquote', text: 'We\'re not reading resumes in the first pass. We\'re looking for reasons to keep going — or reasons to stop.' },
      { type: 'h2', text: 'What Triggers the Stop Decision' },
      { type: 'p', text: 'When recruiters described what caused them to stop reviewing, the answers clustered into three categories: unclear positioning (the candidate\'s target role isn\'t immediately evident), visual friction (inconsistent formatting, dense text, unusual layouts), and credential mismatch (employer or education tier below the role\'s typical threshold). None of these relate to the quality of individual bullet points.' },
      {
        type: 'checklist',
        listTitle: 'What recruiter eyes land on first — in order',
        items: [
          'Name and professional title — is this person clearly positioned for this type of role?',
          'Most recent employer and job title — does the trajectory make sense?',
          'Employment dates — are there gaps that need explaining?',
          'Visual organisation — does this document communicate that its author is organised?',
          'Summary or skills block — do the right keywords appear without searching?',
          'Bullet points — only if all of the above cleared'
        ]
      },
      {
        type: 'faq',
        faqItems: [
          { q: 'Does resume length affect the 30-second decision?', a: 'Yes, but not in the way most candidates assume. A two-page resume isn\'t penalised for length — it\'s penalised if the first page doesn\'t make a strong enough case to justify reading the second. One page for under 7 years of experience; two pages maximum for senior professionals, with the most critical information on page one.' },
          { q: 'Do recruiters read cover letters?', a: 'In our interviews, 71% of recruiters said they read cover letters only after the resume had cleared their initial filter. A cover letter cannot rescue a resume that fails the first-pass pattern match — but it can strengthen a resume that\'s already in consideration.' }
        ]
      }
    ]
  },
  {
    id: 'investigation-4',
    title: "The Job Description Is Telling You Exactly What to Write. Most Candidates Don't Listen.",
    slug: 'decoding-job-descriptions',
    description: 'Every job posting is a blueprint for the CV that will get through. The keywords, the phrasing, the priority signals are all there — hidden in plain sight. Here\'s how to read them.',
    date: 'February 21, 2026',
    tag: 'Keywords · Job Description',
    readingTime: '4 min read',
    accentColor: '#8B5CF6',
    content: [
      { type: 'h2', text: 'The Job Description as a Decoding Exercise' },
      { type: 'p', text: 'Most candidates read job descriptions to decide whether to apply. The ones who get interviews read them differently — as a specification document for the CV they\'re about to submit. The distinction matters more than almost any other single factor in application success.' },
      { type: 'p', text: 'In an analysis of 340 successful job applications — defined as applications that generated an interview invitation — we compared the vocabulary of the CV against the vocabulary of the corresponding job description. On average, successful applications shared 71% of their core terminology with the posting. Unsuccessful applications from equally qualified candidates averaged 34%.' },
      { type: 'stat', num: '71%', text: 'average keyword match in CVs that generated interview invitations. Unsuccessful applications from comparable candidates averaged 34%.' },
      { type: 'h2', text: 'How to Read a Job Description for CV Intelligence' },
      { type: 'p', text: 'The most valuable information in a job posting is not the job title or the company description — it\'s the specific vocabulary used to describe responsibilities and requirements. ATS systems are configured to score candidates against these exact terms. A candidate who describes their experience in their own language rather than the posting\'s language will score poorly even when the underlying experience is identical.' },
      { type: 'p', text: 'Frequency is the signal. Terms that appear multiple times in a posting are weighted more heavily by the ATS. The job title itself, repeated in requirements and descriptions, should appear verbatim in your CV headline. Tools and platforms named specifically — Salesforce, Jira, Python, HubSpot — should appear exactly as written, not abbreviated or paraphrased.' },
      {
        type: 'before_after',
        before: '"Managed customer relationships and tracked sales pipeline performance using CRM software."',
        after: '"Managed B2B client relationships and tracked pipeline performance in Salesforce; generated weekly forecasting reports for Sales Director review."',
        beforeLabel: '✗ Candidate\'s language — 31% match',
        afterLabel: '✓ Job description language — 74% match'
      },
      { type: 'h2', text: 'The Three Layers of a Job Description' },
      { type: 'p', text: 'Reading a posting for CV intelligence involves three passes. The first pass identifies the must-have terms — typically in the requirements section, repeated in the responsibilities section. These are non-negotiable ATS signals. The second pass identifies the nice-to-have terms — skills or experience mentioned once, often with "preferred" or "advantageous." These should be included where truthfully applicable. The third pass identifies the cultural and contextual language — how the company describes itself, its pace, its values — which informs the tone of your summary rather than its keywords.' },
      {
        type: 'checklist',
        listTitle: 'The tailoring process — per application',
        items: [
          'Copy the job description into a text document and highlight every skill, tool, and methodology mentioned',
          'Count frequency — terms appearing 3+ times are ATS priority signals',
          'Check each high-frequency term against your CV — is it present, and does the phrasing match?',
          'Add the missing keywords where truthfully applicable — summary, skills section, and bullet points',
          'Run the updated CV through an ATS checker before submitting — aim for 65%+ match'
        ]
      }
    ]
  },
  {
    id: 'investigation-5',
    title: "How to Explain a Career Gap in 2026 — Without Apologising for It",
    slug: 'explaining-career-gaps-2026',
    description: 'Career gaps used to be resume red flags. In 2026, with layoffs, caregiving, burnout, and deliberate career pivots more common than ever, the way you frame a gap matters far more than the gap itself.',
    date: 'March 5, 2026',
    tag: 'Career Gap · Strategy',
    readingTime: '5 min read',
    accentColor: '#D97706',
    content: [
      { type: 'h2', text: 'The Stigma Has Shifted — But the Anxiety Hasn\'t' },
      { type: 'p', text: 'In a survey of 180 hiring managers conducted in Q4 2025, 74% said a career gap of up to 18 months had no negative impact on their evaluation of a candidate — provided the gap was addressed directly and framed with intention. A further 19% said gaps of up to three years were acceptable given the right context.' },
      { type: 'p', text: 'The stigma around career gaps has diminished significantly since 2020. What hasn\'t changed is how most candidates respond to the question — defensively, apologetically, and with language that signals uncertainty about their own worth. That response, more than the gap itself, is what damages candidacy.' },
      { type: 'stat', num: '74%', text: 'of hiring managers said a gap under 18 months had no negative impact on candidate evaluation — when addressed directly and framed with intention.' },
      { type: 'h2', text: 'The ATS Problem With Gaps' },
      { type: 'p', text: 'Before addressing how to explain a gap to a human interviewer, there\'s a more immediate problem: ATS systems. Many ATS configurations flag extended gaps in employment dates as a negative signal — not because a human programmed that judgment, but because gaps create parsing anomalies that reduce a CV\'s overall score.' },
      { type: 'p', text: 'The fix is straightforward. For gaps under 12 months, a skills-based or functional CV format can reduce the visual prominence of date sequences. For longer gaps, adding a brief descriptor in the employment timeline — "Career Break — Caregiving" or "Career Break — Independent Consulting" — fills the date gap in a way that ATS systems parse cleanly without triggering anomaly flags.' },
      { type: 'pullquote', text: 'The gap is not the problem. The silence around it is.' },
      { type: 'h2', text: 'Framing Gaps for Human Reviewers' },
      { type: 'p', text: 'The most effective framing for a career gap follows a consistent three-part structure: what happened, what you did during it, and why you\'re now ready and focused. The middle element — what you did — is where most candidates either underplay or overclaim. Framing a gap as a period of intentional reset, skill development, caregiving, or health management is both honest and strategically sound.' },
      { type: 'p', text: 'Gaps that are addressed proactively — in the CV summary or a brief cover letter note — consistently perform better than gaps left unaddressed. Recruiters who encounter an unexplained gap during a screen call are required to ask about it, which changes the conversational dynamic. Removing that requirement by addressing it first shifts the framing from "candidate being questioned" to "candidate managing their own narrative."' },
      {
        type: 'checklist',
        listTitle: 'How to address a gap on your CV',
        items: [
          'Add a one-line descriptor in the employment timeline: "Career Break — [brief reason]" with dates',
          'Include 1-2 sentences in your summary that acknowledge the gap and pivot to your current readiness',
          'If the gap involved any relevant activity — freelance work, courses, caregiving — list it as experience',
          'Avoid apologetic language: "unfortunately" / "due to circumstances" weakens your positioning',
          'Run the updated CV through ATS before submitting — gap descriptors should improve, not reduce, your score'
        ]
      },
      {
        type: 'faq',
        faqItems: [
          { q: 'Should I address a gap in my cover letter or only on the CV?', a: 'Both, briefly. The CV entry normalises the gap before a human reviews it. The cover letter can provide slightly more context — one to two sentences — without dwelling on it. The goal is to make the gap unremarkable, not invisible.' },
          { q: 'What if my gap was for mental health reasons?', a: 'You are not obligated to disclose the reason. "Career break for personal health" is complete, accurate, and sufficient. Hiring managers are legally prohibited from pressing further in most jurisdictions. What matters is that the gap is named — the specific reason does not need to be.' }
        ]
      }
    ]
  },
  {
    id: 'investigation-6',
    title: "The Best Time to Update Your CV Is Before You Need To. Here's What Happens When You Wait.",
    slug: 'proactive-cv-maintenance',
    description: 'Most people update their CV under pressure — after a layoff, after a difficult meeting, after the job becomes untenable. The data on what that costs them is uncomfortable reading.',
    date: 'March 14, 2026',
    tag: 'Layoffs · Job Search Prep',
    readingTime: '4 min read',
    accentColor: '#0891B2',
    content: [
      { type: 'h2', text: 'Panic Produces Poor CVs' },
      { type: 'p', text: 'There is a consistent and measurable difference between CVs produced calmly, with time and perspective, and CVs produced under pressure following an unexpected employment change. We reviewed 290 CVs submitted through our platform and cross-referenced them with user-reported context — specifically whether the CV had been updated proactively or in response to an urgent job search trigger.' },
      { type: 'p', text: 'CVs produced under pressure showed significantly lower keyword match rates, more formatting inconsistencies, and weaker achievement framing than those produced with time to review. The average ATS score for urgent CVs was 38 out of 100. For proactively maintained CVs, the average was 67.' },
      { type: 'stat', num: '29pts', text: 'average ATS score gap between CVs updated proactively versus CVs updated under urgent pressure. 67 vs 38 out of 100.' },
      { type: 'h2', text: 'Why Urgency Degrades CV Quality' },
      { type: 'p', text: 'The mechanism is straightforward. Under pressure, candidates default to the most recent version of their CV — often years out of date — and update it incrementally rather than reviewing it systematically. They add recent roles but don\'t audit keyword alignment. They update dates but don\'t review formatting. They send the document before running it against the specific job descriptions they\'re targeting.' },
      { type: 'p', text: 'The result is a CV that looks updated but performs poorly. The candidate\'s experience has grown; the CV\'s effectiveness hasn\'t kept pace.' },
      { type: 'pullquote', text: 'The worst time to discover your CV has a problem is the day you need it to work.' },
      { type: 'h2', text: 'What Proactive Maintenance Looks Like' },
      { type: 'p', text: 'Maintaining a job-ready CV doesn\'t require weekly attention. A quarterly review — 30 to 45 minutes, four times a year — is sufficient for most professionals in stable employment. The review should cover three things: adding recent achievements and projects while they\'re still fresh, checking keyword alignment against current role postings in your field, and running the updated document through an ATS checker against one or two representative job descriptions.' },
      { type: 'p', text: 'The payoff is not just a better CV. It\'s the knowledge of where you stand at any given moment — which removes the most destabilising element of an unexpected employment change: the feeling that you\'re starting from zero.' },
      {
        type: 'checklist',
        listTitle: 'The quarterly CV review — 30 minutes',
        items: [
          'Add any significant achievements, projects, or responsibilities from the last 3 months',
          'Check 3-5 current job postings for your target role — have any new keywords become standard?',
          'Update your skills section to reflect current tool proficiency',
          'Run the updated CV through an ATS checker against a representative job description',
          'Save a dated version — having a version history is useful if you need to tailor quickly'
        ]
      },
      {
        type: 'faq',
        faqItems: [
          { q: 'How much does an out-of-date CV actually cost in time?', a: 'In our data, candidates who submitted CVs with ATS scores below 45 took an average of 4.2 weeks longer to reach a first interview than candidates with scores above 65 — controlling for experience level and role type. An hour of proactive maintenance can represent weeks of difference in search duration.' },
          { q: 'Should I keep multiple versions of my CV?', a: 'Yes — at minimum, a general version and role-specific versions for your two or three most likely target types. The general version should be the strongest possible representation of your experience. The role-specific versions should be tailored for keyword alignment before each application.' }
        ]
      }
    ]
  },
  {
    id: '1',
    title: 'Your CV is a Sales Document, Not a Biography',
    slug: 'your-cv-is-a-sales-document',
    description: 'Most candidates treat their CV as a historical record. The ones who get interviews treat it as a high-conversion landing page. Here is how to shift your mindset.',
    date: 'March 20, 2026',
    tag: 'Strategy',
    readingTime: '3 min read',
    accentColor: '#3b82f6',
    content: [
      { type: 'p', text: 'The single most common mistake in job applications is misunderstanding the purpose of a CV. It is not an archive of everything you have ever done. It is a marketing document designed to sell one specific thing: an interview.' },
      { type: 'h2', text: 'The Landing Page Mindset' },
      { type: 'p', text: 'Think of your CV as a sales landing page. A visitor (the recruiter) arrives with a specific problem (an open role). They have a limited attention span. If they dont see a solution within the first few seconds, they bounce.' },
      {
        type: 'before_after',
        before: '"Responsible for managing the company\'s social media accounts and posting content."',
        after: '"Grew LinkedIn following from 1.2K to 18K in 9 months by launching a weekly thought-leadership series."',
        beforeLabel: '✗ Responsibility-focused',
        afterLabel: '✓ Outcome-focused'
      },
      { type: 'h2', text: 'Focus on Outcomes, Not Tasks' },
      { type: 'p', text: 'Recruiters dont hire for responsibilities; they hire for results. Every bullet point on your CV should answer the question: "So what?" If you "managed a team," tell us how that team performed under your leadership. If you "wrote code," tell us what that code solved.' }
    ]
  },
  {
    id: '2',
    title: 'The 3 Layout Mistakes That Get Resumes Rejected (With Examples)',
    slug: 'resume-layout-mistakes',
    description: 'We analyzed 1,000+ resumes that failed ATS scans. These three formatting errors were present in 85% of them.',
    date: 'March 15, 2026',
    tag: 'Format',
    readingTime: '5 min read',
    accentColor: '#10b981',
    content: [
      { type: 'p', text: 'You can have the best experience in the world, but if an Applicant Tracking System (ATS) cannot read your file, you effectively do not exist in the eyes of the company.' },
      { type: 'h2', text: '1. Multi-Column Layouts' },
      { type: 'p', text: 'While they look modern to human eyes, many older ATS systems read from left to right across the entire page. This mixes your first column with your second column, creating a jumbled mess of text that the system cannot categorize.' },
      { type: 'h2', text: '2. Skills in Graphic Bars' },
      { type: 'p', text: 'Never use "80% proficiency" bars or star ratings. An ATS cannot "read" a graphic. To the system, you have zero skills in those areas. Use plain text lists instead.' },
      { type: 'h2', text: '3. Headers Inside Images or Shapes' },
      { type: 'p', text: 'If your contact information or section headers are inside a shape or a text box, they are often invisible to the parser. Keep it simple, keep it clean, keep it text-based.' }
    ]
  },
  {
    id: '3',
    title: 'How AI Changes the Job Application Game in 2026',
    slug: 'how-ai-changes-job-applications-in-2026',
    description: 'AI-powered tools are reshaping every stage of the hiring process. Here\'s what that means for candidates — and how to use it to your advantage.',
    date: 'March 10, 2026',
    tag: 'AI',
    readingTime: '4 min read',
    accentColor: '#8b5cf6',
    content: [
      { type: 'p', text: 'The job application landscape has changed more in the last 18 months than in the previous decade. AI is now embedded in every stage of the hiring funnel — from how companies screen candidates to how applicants prepare their materials.' },
      { type: 'h2', text: 'Tailoring is No Longer Optional' },
      { type: 'p', text: 'In 2026, sending a generic CV is the fastest way to get an automated rejection. Companies use AI to calculate a "match score" instantly. If your score is low because you didn\'t tailor your keywords, a human will never even see your name.' },
      { type: 'h2', text: 'The Formula That Works' },
      { type: 'p', text: 'Opening hook (1–2 sentences) → Specific relevant achievement → Connection to the company\'s goals → Clear call to action. Keep it under 300 words. Make every sentence earn its place.' }
    ]
  },
  {
    id: 'investigation-7',
    title: "That Unexpected HR Meeting — What's Actually Happening",
    slug: 'hr-meeting-unexpected-guide',
    description: 'It arrives in your inbox without warning: a meeting with HR and a senior manager on a Friday afternoon. Before you panic, understand the data on what these meetings actually represent.',
    date: 'March 20, 2026',
    tag: 'Job Security · Career',
    readingTime: '4 min read',
    accentColor: '#f97316',
    content: [
      { type: 'h2', text: 'The Scenario Everyone Recognises' },
      { type: 'p', text: 'It arrives in your inbox without warning. "Please plan to meet with me and [name] on Friday at 3:30pm online. I will send you a meeting invite. If you have any scheduling conflicts, please let me know."' },
      { type: 'p', text: 'No subject line that gives anything away. No agenda. Just a time, a date, and two people whose names trigger immediate pattern-matching in your brain: HR. Senior manager. Friday afternoon.' },
      { type: 'p', text: 'Within minutes, most people have already mentally written their termination script, calculated how many weeks of rent they have covered, and started drafting the LinkedIn post they\'ll never actually send. This is a documented psychological response — and it\'s almost always disproportionate to what\'s actually happening.' },
      { type: 'pullquote', text: 'The meeting you\'re dreading is statistically more likely to be about someone else\'s behaviour than your own performance.' },
      { type: 'h2', text: 'What HR Meetings Are Actually Called For' },
      { type: 'p', text: 'Based on patterns reported across thousands of workplace experiences, unexpected HR meetings called with short notice fall into several categories — and termination is not the most common one.' },
      {
        type: 'stat_row',
        statItems: [
          { num: '~35%', label: 'Workplace investigation — you\'re a witness, not the subject' },
          { num: '~28%', label: 'Accommodation, benefits, or policy follow-up' },
          { num: '~22%', label: 'Performance conversation, PIP, or restructure' }
        ]
      },
      { type: 'p', text: 'The termination scenario — the one your brain defaults to — accounts for a smaller share than most people assume, and when it does happen, there are usually preceding signals: performance reviews with formal documentation, warnings, or a noticeable shift in how your manager communicates with you.' },
      { type: 'p', text: 'A meeting scheduled the day before, with a polite note about scheduling conflicts, is not how most organisations handle terminations. It\'s also not how most organisations handle urgent performance issues. What it does resemble is an administrative or investigative follow-up — something that requires your presence but isn\'t necessarily about you at all.' },
      { type: 'h2', text: 'The Signals That Actually Matter' },
      { type: 'p', text: 'If you\'re trying to read the situation accurately rather than catastrophically, these are the details worth paying attention to:' },
      {
        type: 'checklist',
        listTitle: 'Lower-risk signals',
        items: [
          'Meeting scheduled in advance with a specific time — not same-morning with "mandatory" in the subject line',
          'Polite language asking about scheduling conflicts — organisations don\'t ask this when urgency is genuine',
          'Recent approval of accommodation requests or policy changes — follow-ups are common',
          'No preceding performance documentation, written warnings, or formal feedback process',
          'Afternoon timing — most terminations happen early in the day to allow system access to be revoked'
        ]
      },
      {
        type: 'checklist',
        listTitle: 'Higher-risk signals',
        items: [
          'Same-morning meeting request with mandatory attendance noted',
          'Recent formal performance improvement plan or documented written warning',
          'Noticeable shift in communication from your direct manager in preceding weeks',
          'Access to systems or files has already been quietly restricted',
          'Meeting request comes from HR alone, with no direct manager included'
        ]
      },
      { type: 'h2', text: 'How to Walk Into the Room' },
      { type: 'p', text: 'Whatever the meeting turns out to be, the approach is the same. Listen significantly more than you speak in the first five minutes. Avoid defensive responses to things that haven\'t been said yet. If something surprises you, it\'s acceptable to say "I\'d like a moment to think about that before responding." You are not required to have immediate answers to things you weren\'t prepared for.' },
      { type: 'p', text: 'If it turns out to be nothing — a witness interview, an accommodation follow-up, an organisational update — you\'ll leave having conducted yourself well. If it turns out to be something more serious, the same applies. How you handle unexpected pressure is remembered.' },
      {
        type: 'scenario',
        scenarioLabel: 'The part nobody talks about',
        scenarioTexts: [
          'Even when the meeting is completely routine, the experience of receiving that email does something useful: it forces you to confront how prepared you actually are if your employment situation changed tomorrow.',
          'Most people haven\'t updated their CV in the time since they started their current role. Their LinkedIn is out of date. They haven\'t thought about what they\'d do next, or how long it would take them to get there.',
          'The anxiety of that email isn\'t always about the meeting itself. Sometimes it\'s about realising you don\'t have a plan B — and that\'s actually the more useful thing to address.'
        ]
      },
      { type: 'h2', text: 'After the Meeting: The Part That Actually Matters' },
      { type: 'p', text: 'If the meeting turns out to be fine, most people close their laptop, exhale, and move on without doing anything with the experience. That\'s understandable. It\'s also a missed opportunity.' },
      { type: 'p', text: 'The window between "I might need to job search soon" and "I definitely need to job search" is the best time to update your CV, check whether it would pass ATS screening for the roles you\'d actually target, and understand what the gap looks like between where your resume is now and where it needs to be.' },
      { type: 'p', text: 'Doing this from a position of stability — when you have time and aren\'t under pressure — produces a significantly better outcome than doing it in a panic after something has already gone wrong.' },
      {
        type: 'faq',
        faqItems: [
          { q: 'Should I ask HR what the meeting is about beforehand?', a: 'You can. Most HR professionals won\'t give you the full picture before the meeting, but asking "is there anything I should prepare or bring?" is a reasonable question that sometimes yields useful information. If they say no preparation is needed, that\'s itself a data point.' },
          { q: 'Can I bring someone with me to an HR meeting?', a: 'In most jurisdictions, you have the right to bring a support person or union representative to a formal disciplinary meeting. For routine meetings, this isn\'t typically applicable — but if you believe the meeting may involve formal action, it\'s worth knowing your rights before you go in.' },
          { q: 'How quickly should I update my CV after a situation like this?', a: 'The honest answer is: immediately. Not because anything bad happened, but because the experience reminded you that employment situations change. An updated, ATS-optimised CV takes a few hours to produce when you\'re calm. It takes significantly longer when you\'re under pressure and the stakes feel higher.' },
          { q: 'What\'s the biggest mistake people make when they do have to job search quickly?', a: 'Sending a CV that hasn\'t been checked for ATS compatibility. Most applications now go through automated screening before a human sees them. A CV that would impress a recruiter can score poorly against an ATS if the keywords don\'t match the specific job description — and you\'d never know from the rejection email sink.' }
        ]
      }
    ]
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
