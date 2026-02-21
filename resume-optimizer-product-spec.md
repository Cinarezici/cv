# AI-Powered Resume & CV Optimizer — Full Product Specification

> **Audience:** This document is written for an AI system (Antigravity) tasked with designing and/or building this product end-to-end. Every section contains explicit feature logic, UX flows, AI decision trees, data models, and monetization mechanics. Follow all instructions literally unless a section is marked as optional.

---

## Table of Contents

1. [Product Vision & Philosophy](#1-product-vision--philosophy)
2. [Manual Resume Builder Interface](#2-manual-resume-builder-interface)
3. [First Resume — Conversational AI Flow](#3-first-resume--conversational-ai-flow)
4. [Smart Resume Optimization Engine](#4-smart-resume-optimization-engine)
5. [Monetization — Edit Lock & Pro Access](#5-monetization--edit-lock--pro-access)
6. [Resume Sharing & Performance Insights](#6-resume-sharing--performance-insights)
7. [Competitive Positioning & Defensibility](#7-competitive-positioning--defensibility)
8. [Technical Architecture Overview](#8-technical-architecture-overview)
9. [AI Logic Design Reference](#9-ai-logic-design-reference)
10. [Full UX Flow Map](#10-full-ux-flow-map)

---

## 1. Product Vision & Philosophy

### What This Product Is

This is not a resume template website. It is a **career intelligence platform** that meets users at their exact skill level — whether they are a student writing their first CV or a senior engineer targeting FAANG — and guides them to produce the strongest possible resume for their specific career goals.

The product must feel like three things simultaneously:
- A **smart design tool** (like Figma or Canva, but for resumes)
- A **career coach** (like a human interview coach, but always available)
- A **data analytics layer** (like Mixpanel, but tracking your resume's performance)

### Core Differentiators vs. Existing Tools

| Capability | Typical Resume Builder | This Product |
|---|---|---|
| Design | Template-based, rigid | Visual editor with full layout control |
| Content creation | User writes everything | AI coaches user through writing |
| ATS optimization | Basic keyword lists | Deep semantic job description matching |
| Sharing | PDF download | Live shareable link with view analytics |
| Monetization | Paywall at export | Paywall at editing (psychological lock-in) |
| Learning | Static | Gets smarter with each user interaction |

### Design Philosophy

Every screen must embody these three principles:

**1. Zero Blank Page Anxiety.** Users should never feel stranded. There is always a prompt, a suggestion, an example, or a next step visible on screen.

**2. Progressive Disclosure.** Show simple options first. Reveal advanced features as users engage more deeply. Never overwhelm a first-time user.

**3. Confidence Through Momentum.** Small wins drive retention. Every completed section should feel like an accomplishment. Use micro-animations, progress indicators, and encouraging copy throughout.

---

## 2. Manual Resume Builder Interface

### 2.1 Overall UI Architecture

The editor is a **three-panel layout**:

```
┌─────────────────────────────────────────────────────┐
│  LEFT PANEL         │  CENTER CANVAS   │ RIGHT PANEL │
│  (Section Nav +     │  (Live Resume    │  (Style &   │
│   Content Inputs)   │   Preview)       │   Theme)    │
└─────────────────────────────────────────────────────┘
```

- **Left Panel (300px):** Collapsible tree of resume sections. Clicking any section jumps to it in the canvas. Sections can be reordered via drag-and-drop.
- **Center Canvas (flexible):** A pixel-perfect WYSIWYG preview of the resume. Clicking any element opens its edit form inline or in the left panel. The canvas updates in real time as the user types.
- **Right Panel (280px):** Theme selector, color palette, font picker, spacing controls, and export options.

On mobile, these collapse to a tab-based interface: Edit → Preview → Style.

### 2.2 Profile Photo Upload

**Behavior:**
- Click the circular photo placeholder in the canvas to open the upload modal.
- Accepted formats: JPG, PNG, WEBP (max 5MB).
- After upload, show a crop/zoom tool with aspect ratio locked to 1:1.
- Apply a subtle circular mask by default; offer square and rounded-square options.
- Pro feature: AI background removal to produce a clean headshot.

**Storage:** Store the original and the cropped version. Never compress below 200x200px.

**Accessibility:** If no photo is uploaded, display the user's initials in a color-matched circle.

### 2.3 Contact Information Block

This block is always at the top of the resume. It contains:

- Full Name (large, bold — this is the headline of the document)
- Job Title / Professional Summary Tagline (one line, below the name)
- Email Address
- Phone Number (with country code selector)
- Location (City, Country — not full address for privacy)
- LinkedIn URL (auto-formatted to show only the username)
- Personal Website / Portfolio URL
- GitHub URL (optional, shown for technical roles)

**Behavior:** Each field has a visibility toggle. Users can hide fields they don't want shown without deleting them.

### 2.4 Resume Sections System

The following sections are available. Each section can be added, removed, renamed, and reordered:

**Always present (cannot be removed):**
- Contact Info
- Work Experience
- Education

**Optional sections (add via "+" button in left panel):**
- Skills
- Projects
- Certifications
- Languages
- Volunteer Work
- Publications
- Awards & Honors
- References
- Custom Section (user-defined title)

**Section behavior:**
- Each section has a title that can be renamed (e.g., "Work Experience" → "Professional Experience")
- Sections support multiple entries (e.g., multiple jobs)
- Within a section, entries can be reordered via drag-and-drop
- Each entry has a context menu: Edit, Duplicate, Delete, Move to Top

### 2.5 Work Experience Entry Form

Each job entry captures:

```
Company Name          [text input]
Job Title             [text input]
Start Date            [month/year picker]
End Date              [month/year picker] OR [✓ Present]
Location              [text input, optional]
Employment Type       [dropdown: Full-time / Part-time / Contract / Internship / Freelance]
Description           [rich text area — bullet points only, max 6 bullets]
```

**Rich Text Constraints:** The description field supports only bullet points. No paragraphs. This is intentional — it enforces ATS-friendly formatting and prevents walls of text.

**AI Assist Button:** Every bullet point has an inline "✨ Improve this" button that triggers the optimization engine (see Section 4).

### 2.6 Education Entry Form

```
Institution Name      [text input]
Degree                [dropdown + custom]
Field of Study        [text input]
Start Date            [month/year picker]
End Date              [month/year picker] OR [✓ Present / Expected YYYY]
GPA                   [number input, optional] + [Show/Hide toggle]
Relevant Coursework   [tag input, optional]
Honors / Activities   [text area, optional]
```

### 2.7 Skills Section

Skills are entered as tags. Each tag has:
- Skill name
- Proficiency level (optional): Beginner / Intermediate / Advanced / Expert
- Proficiency can be displayed as a label, a bar, dots, or hidden (style setting)

The AI engine (Section 4) will flag if skills mentioned in experience bullets are absent from the skills section.

### 2.8 References Section

Two display modes:
1. **Listed:** Shows reference name, title, company, email, phone
2. **Available Upon Request:** Just shows the phrase — no personal data exposed

Default is mode 2 for privacy. Pro users can unlock a "Reference Request" feature that sends automated emails to references asking for a recommendation letter.

### 2.9 Layout & Visual Design System

**Theme Architecture:**

Every theme is defined by a JSON configuration object:

```json
{
  "themeId": "executive-dark",
  "name": "Executive Dark",
  "tier": "premium",
  "fonts": {
    "heading": "Playfair Display",
    "body": "Inter"
  },
  "colors": {
    "primary": "#1a1a2e",
    "accent": "#e94560",
    "background": "#ffffff",
    "text": "#2d2d2d",
    "muted": "#777777"
  },
  "layout": {
    "columns": 2,
    "headerStyle": "full-width-banner",
    "sectionDivider": "line",
    "bulletStyle": "dash"
  },
  "spacing": {
    "sectionGap": 24,
    "entryGap": 16,
    "lineHeight": 1.5
  }
}
```

**Free Themes (5 minimum):**
1. **Clean** — Single column, black/white, Times New Roman. Classic, safe for all industries.
2. **Modern** — Two column, Inter font, blue accent. Popular for tech roles.
3. **Minimal** — Single column, lots of whitespace, subtle gray accents.
4. **Compact** — Maximizes content density. Good for experienced candidates.
5. **Academic** — Follows academic CV conventions. Good for researchers.

**Premium Themes (10+ minimum):**
1. Executive Dark, 2. Creative Portfolio, 3. Tech Startup, 4. Finance Professional, 5. Healthcare, 6. Legal, 7. Marketing Bold, 8. International (right-to-left support), 9. Video Game Industry, 10. Architect / Designer

**Color Customization:**
- Users can override the accent color on any theme using a color picker.
- Font can be changed independently (Google Fonts integration, limited to print-safe fonts).
- Pro users can customize all color slots.

**Typography Controls:**
- Body font size: 10pt–12pt
- Section heading size: 12pt–16pt
- Name/headline size: 18pt–28pt
- Line height: 1.2–1.8

**Spacing Controls:**
- Margin size: Narrow / Normal / Wide
- Section spacing: Compact / Normal / Spacious

### 2.10 Export Options

**Free Users:**
- Download PDF with a subtle watermark in the footer (e.g., "Created with [Product Name]")
- PDF is generated server-side using headless Chromium for pixel-perfect output

**Pro Users:**
- Watermark-free PDF
- DOCX export (formatted Word document)
- TXT export (plain text for ATS paste)
- Multiple versions in a single ZIP

---

## 3. First Resume — Conversational AI Flow

### 3.1 Philosophy

The "First Resume" feature is the most important differentiator. It solves the hardest problem in resume writing: **the blank page**.

Most people know what they've done but don't know how to describe it professionally. They don't know the language of resumes. They undersell themselves because they don't recognize their own achievements as impressive.

This feature acts as a trained career coach conducting a structured interview. The AI asks questions in a natural, warm, conversational tone — like a mentor, not a form.

### 3.2 Entry Point

The conversational flow is triggered in two scenarios:

**Scenario A — New User, No Resume:**
After signup, if the user skips or cannot fill out the manual editor, a button reads: **"Don't know what to write? Let AI guide you →"**

**Scenario B — Existing User, Weak Section:**
When the AI optimization engine detects that a section (e.g., Work Experience) has fewer than 2 bullet points or uses vague language, it offers: **"Want me to help you improve this section? Answer a few questions →"**

### 3.3 Career Level Detection

Before the guided interview begins, the system classifies the user's career level. This is done through a short (3-question) pre-screening:

**Question 1:** "Are you currently working, studying, or neither?"
- Options: Currently employed / Student / Recently graduated / Looking for first job / Freelancer/Entrepreneur / Career changer

**Question 2:** "How many years of relevant work experience do you have?"
- Options: 0 (none yet) / 1–2 years / 3–5 years / 6–10 years / 10+ years

**Question 3:** "What type of role are you targeting?"
- Options: Technical (engineering, data, IT) / Business (management, operations, finance) / Creative (design, content, marketing) / Healthcare / Legal / Academic / Other

The system uses this to select a question tree. The career levels are:

| Level Tag | Description |
|---|---|
| `student` | In school, no or minimal work experience |
| `junior` | 0–2 years of experience post-graduation |
| `mid` | 3–7 years, individual contributor |
| `senior` | 7+ years, possibly with leadership |
| `founder` | Self-employed, startup founder, freelancer |
| `career_changer` | Significant experience in a different field |

### 3.4 The Interview Flow

The conversation is rendered as a chat interface — not a form. Messages appear from the "AI coach" side, and users type responses in a chat input.

**UI Rules:**
- AI messages appear with a subtle avatar (abstract AI icon, not a human face)
- Messages animate in (fade + slide up)
- User responses are shown on the right side of the chat
- Between messages, a subtle typing indicator plays for 0.5–1 second before the next AI message
- Previous messages remain visible for context

**Conversation Structure — Work Experience (Example Flow for `mid` level):**

```
AI: "Let's talk about your most recent job. What was your job title and where did you work?"

USER: "I was a product manager at a fintech startup called Paytric."

AI: "Great! How long were you at Paytric, and was this a full-time role?"

USER: "About 2.5 years, full-time."

AI: "What were your main responsibilities there? Don't worry about formatting — just tell me what you actually did day to day."

USER: "I managed the roadmap, worked with engineers, ran sprints, talked to customers, and helped launch a new payments feature."

AI: "That sounds like a lot of ground covered. Let me ask about that payments feature — roughly how many users were affected by it, or did it have a measurable impact on revenue or engagement?"

USER: "Yeah it helped increase checkout completion by like 30% I think. We had about 50,000 active users."

AI: "Perfect, that's exactly the kind of detail that makes a resume stand out. Did you lead this project, or were you one of several PMs working on it?"

USER: "I led it from start to finish."

AI: "One more: did you manage any engineers or cross-functional teams on this? Even informally?"

USER: "I worked closely with a team of 6 engineers and a designer."

AI: "This is great material. Here's how I'd write this as a resume bullet point:"

[Generated bullet]: "Led end-to-end delivery of a new payments feature, coordinating a cross-functional team of 6 engineers and 1 designer, resulting in a 30% increase in checkout completion across 50,000 active users."

AI: "Does this sound right, or would you like to adjust anything?"
```

The AI continues this pattern for 3–5 bullet points per job, then moves to the next section.

### 3.5 STAR-to-Bullet Extraction Logic

The AI's internal logic when extracting resume content:

**Step 1 — Extract STAR components from user's natural language:**
- **Situation:** What was the context? (company size, team, project stage)
- **Task:** What was the user responsible for?
- **Action:** What specifically did the user do?
- **Result:** What was the measurable outcome?

**Step 2 — Identify missing components and ask targeted follow-up questions:**
- Missing Result → Ask: "Did this have a measurable impact? Any numbers you remember?"
- Missing Scope → Ask: "How many people / users / dollars were involved?"
- Missing ownership → Ask: "Did you lead this, or was it a team effort?"

**Step 3 — Generate bullet using this formula:**
`[Strong Action Verb] + [What You Did] + [How / Method] + [Result with Metric]`

**Strong Action Verb Bank by Category:**

| Category | Verbs |
|---|---|
| Leadership | Led, Directed, Managed, Oversaw, Spearheaded, Championed |
| Creation | Built, Designed, Developed, Architected, Launched, Created |
| Improvement | Optimized, Streamlined, Reduced, Improved, Accelerated, Enhanced |
| Growth | Grew, Expanded, Scaled, Increased, Drove, Generated |
| Analysis | Analyzed, Identified, Evaluated, Researched, Mapped, Quantified |
| Collaboration | Partnered, Coordinated, Aligned, Facilitated, Bridged |

**Step 4 — Propose metric estimates when user cannot provide exact numbers:**

If user says "I don't know the exact number," the AI responds:
> "No problem — do you remember roughly whether it was a small change (under 10%), a medium change (10–30%), or a significant change (over 30%)? Even a rough estimate is better than nothing, and it's honest."

This allows the AI to generate bullets with appropriate hedging: "reduced processing time by approximately 20%."

### 3.6 Adaptive Question Trees

**For `student` level:**
- Focus on academic projects, coursework, internships, extracurriculars, leadership roles in clubs
- Ask about capstone projects and thesis work
- Ask about skills demonstrated rather than business outcomes

**For `founder` level:**
- Ask about company mission, team size, revenue, funding
- Ask about specific products built or decisions made
- Frame experience around entrepreneurial impact

**For `career_changer`:**
- Ask about transferable skills
- Identify overlapping capabilities between old and new field
- Help user reframe experience in language of target industry

### 3.7 Saving & Resuming

The conversation state is auto-saved every 30 seconds. If the user leaves and returns, they see:

> "Welcome back! You were working on your resume for [last job title] at [company]. Want to pick up where you left off?"

The generated content populates the manual editor in real time as it is produced. The user can switch between the chat and the visual editor at any point.

---

## 4. Smart Resume Optimization Engine

### 4.1 Overview

The optimization engine is a persistent AI layer that runs continuously in the background while the user edits their resume. It provides three types of feedback:

1. **ATS Compatibility Analysis** — Can this resume be parsed by automated systems?
2. **Content Quality Scoring** — Are the bullet points strong, specific, and impactful?
3. **Job Match Analysis** — How well does this resume match a specific job description?

### 4.2 ATS Compatibility Analysis

**What ATS systems check for (and what this engine must validate):**

| Check | Pass Condition |
|---|---|
| File format | PDF or DOCX only (no images, no JPEGs) |
| Fonts | Standard system fonts (no custom/decorative fonts) |
| Text in images | No text embedded in images or graphics |
| Tables | No critical content inside tables (ATS often skips table content) |
| Column layout | Single-column preferred; two-column flagged as risk |
| Headers/Footers | No critical info in page header or footer |
| Section labels | Standard section names recognized by ATS |
| Date formats | Consistent, machine-readable (MM/YYYY or Month YYYY) |
| Email format | Valid email format |
| File name | No special characters in filename |
| Character encoding | UTF-8, no special symbols |

**ATS Score Calculation:**

The engine assigns a score from 0–100:
- 100: Fully ATS-compatible
- 80–99: Minor issues, very likely to parse correctly
- 60–79: Moderate issues, some information may be lost
- Below 60: High risk of ATS rejection

The score is displayed in the right panel as a circular progress indicator with color coding: green (80+), yellow (60–79), red (below 60).

**Inline Issue Flags:**

Issues are shown as yellow or red highlights directly on the canvas, with a tooltip explaining the problem and an auto-fix option.

Example:
> ⚠️ "Your contact information is inside a table. ATS systems may not read this correctly. [Fix automatically]"

### 4.3 Content Quality Scoring

Each bullet point receives a quality score based on:

| Dimension | Weight | What It Checks |
|---|---|---|
| Action verb strength | 20% | Does it start with a strong action verb? |
| Specificity | 25% | Does it include specific details (tech, methods, scope)? |
| Measurable impact | 30% | Does it include a metric or quantifiable outcome? |
| Length | 15% | Is it 1–2 lines? (Too short = vague, too long = hard to read) |
| Uniqueness | 10% | Is it generic ("Responsible for...") or distinctive? |

**Weak Bullet Detection Examples:**

Flagged bullets (weak):
- "Responsible for managing social media accounts."
- "Helped the team with various tasks."
- "Worked on improving performance."
- "Participated in agile development."

**Auto-Rewrite Feature:**

When a weak bullet is detected, clicking the ✨ icon shows the original vs. an AI-rewritten version side by side:

```
BEFORE: "Worked on improving performance of the backend system."

AFTER:  "Reduced API response time by 40% by refactoring database 
         query logic and implementing Redis caching for high-traffic 
         endpoints serving 200K daily requests."
```

The user can Accept, Edit, or Dismiss each suggestion. Accepted suggestions instantly update the canvas.

### 4.4 Job Description Matching

**How it works:**

1. User pastes a job description (JD) into a text field in the right panel.
2. The engine performs semantic analysis of the JD to extract:
   - Required skills (hard skills, software, tools)
   - Preferred skills
   - Key responsibilities
   - Industry-specific terminology
   - Seniority signals (years of experience required, management language)
3. The engine compares these against the resume content.
4. A match score (0–100%) is displayed.
5. Missing keywords are listed with context (where in the JD they appear).
6. The engine suggests where to naturally add each missing keyword in the resume.

**Keyword Integration Suggestions:**

The engine does not just list missing keywords. It shows the user exactly how to add them:

> "The job description requires 'cross-functional collaboration.' Your resume mentions working with engineers and designers but doesn't use this phrase. Consider adding it to your [Job X] summary."

**Job-Tailored Version Generation (Pro Feature):**

Users can generate a new version of their resume optimized for a specific job in one click. The engine:
1. Creates a copy of the resume
2. Reweights bullet points (those most relevant to the JD appear first)
3. Adds missing keywords naturally
4. Adjusts the professional summary to mirror the JD's language
5. Renames sections if appropriate (e.g., "Projects" → "Relevant Projects")

This is the "Tailor for This Job" button — one of the most powerful Pro features.

### 4.5 Real-Time Optimization Sidebar

A collapsible sidebar in the right panel shows:

```
📊 Resume Score: 78/100

ATS Compatibility:   ████████░░  82%
Content Quality:     ███████░░░  71%
Job Match:           ████░░░░░░  N/A (Paste a JD to score)

⚠️ 3 issues to fix:
  → 2 weak bullet points detected
  → Missing: Leadership keywords
  → Date format inconsistency in Education section

✅ Strengths:
  → Strong action verbs in 7/9 bullets
  → Good use of metrics in Experience section
```

---

## 5. Monetization — Edit Lock & Pro Access

### 5.1 The Core Monetization Philosophy

This product uses **access psychology** rather than feature gating alone. The most powerful conversion trigger is not blocking features — it is blocking **the user's own work**.

When a Pro subscription expires, the resume is locked. The user can still view it, share it, and show it to others — but they cannot change a single word. This creates:

- **Loss aversion:** The resume represents hours of work. The fear of losing control over it is more motivating than the desire to gain a new feature.
- **Time pressure:** The lock activates immediately upon expiry. There is no grace period delay. This encourages pre-emptive renewal.
- **Visible progress blockage:** The lock UI is professionally designed — not punishing, but clearly present. It feels urgent without feeling hostile.

### 5.2 Free Tier Capabilities

Free users can:

- Create up to 2 resumes
- Use the 5 free themes
- Fill in all sections manually
- Access basic ATS score (single score number only, no issue details)
- Download PDF with watermark
- Share resume via public link (basic, no analytics)

Free users **cannot:**
- Use the Conversational AI builder
- Use the optimization engine's suggestions (can see the score, not the details)
- Edit after Pro expires (see 5.4)
- Export DOCX or watermark-free PDF
- Access premium themes
- Generate job-tailored versions
- View sharing analytics

### 5.3 Pro Tier Capabilities

Pro users (monthly or annual subscription) can:

- Create unlimited resumes
- Use all premium themes
- Use the full Conversational AI builder
- Access full optimization engine with inline suggestions and auto-rewrites
- Generate unlimited job-tailored versions
- Export PDF (no watermark), DOCX, TXT
- Share with full analytics (views, time-per-section, device type)
- A/B test multiple resume versions
- Priority AI processing (faster generation)

### 5.4 The Edit Lock — Detailed UX

When a Pro subscription expires:

**1. In-app state change:**
- The center canvas gains a semi-transparent overlay
- Each section shows a lock icon
- The toolbar is grayed out and non-interactive
- A persistent banner at the top reads:
  > "Your Pro plan has expired. Your resume is preserved but cannot be edited."

**2. Click to edit behavior:**
When a user clicks any part of the locked resume, a modal appears:

```
┌────────────────────────────────────────────────┐
│                                                │
│    🔒  Your resume is locked                  │
│                                                │
│  You updated this resume 3 days ago.           │
│  Renew Pro to keep it current and editable.   │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │         Renew Pro — $12/month           │  │
│  │      ✓ Annual plan saves 40%            │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  [View your resume]   [Not now]               │
│                                                │
└────────────────────────────────────────────────┘
```

This modal is shown a maximum of 3 times per day per user to avoid becoming annoying.

**3. Retention email sequence (triggered at expiry):**

- Day 0: "Your resume is now locked — here's how to unlock it"
- Day 3: "Your resume has had [X] views this week — but you can't update it yet"
- Day 7: "A lot can change in a week. Keep your resume ready."
- Day 14: Personalized offer (e.g., "We've noticed you applied to 3 jobs this week. Get 20% off Pro.")

**4. Lifetime value reasoning:**

The edit lock is not designed to frustrate — it is designed to create a **genuine need**. A resume that cannot be updated is professionally dangerous. Every job seeker understands this. The lock makes the product's value tangible in a way that paywalled features do not.

### 5.5 Pricing Strategy

**Monthly Pro:** $12/month
**Annual Pro:** $72/year ($6/month, 50% savings)
**Lifetime deal (optional, limited release):** $149 one-time

**Trial:** 14-day free trial of Pro (no credit card required) for all new users.

During trial, surface Pro features prominently. On day 12, send in-app notification: "2 days left on your Pro trial. Your AI-built resume will be locked on [date]."

### 5.6 Teams & B2B Tier (Future)

Design for a future "Career Services" tier targeting:
- University career centers (bulk seats for students)
- Recruitment agencies (white-label version)
- Outplacement firms (helping laid-off employees)

This tier unlocks: recruiter dashboard, bulk resume review, team analytics, custom branding.

---

## 6. Resume Sharing & Performance Insights

### 6.1 The Shareable Resume Link

Every resume gets a unique public URL:
`app.domain.com/r/username-firstname-lastname` (human-readable slug)

The shared resume is a **live web page** — not a PDF link. It renders the user's chosen theme in the browser, is mobile-responsive, and can be viewed without any account.

**Options per resume:**
- Public (anyone with the link can view)
- Private (requires a password)
- Off (link deactivated)

**Custom link slugs (Pro):** Users can customize their URL slug.

**Open Graph metadata (Pro):** When shared on LinkedIn or via email, the link generates a preview card with the user's name, current title, and a clean resume thumbnail.

### 6.2 Analytics Dashboard

Pro users access a per-resume analytics dashboard showing:

**Traffic metrics:**
- Total link views (all time, last 7 days, last 30 days)
- Unique viewers
- View source breakdown (direct link, LinkedIn, email, other)
- Device type (desktop vs. mobile)

**Engagement metrics:**
- Average time spent on resume
- Scroll depth (what percentage of the resume did viewers reach?)
- Section heatmap: which sections received the most viewing time?
- Drop-off point: where did viewers stop reading?

**Version comparison (Pro):**
- Users can have up to 5 active resume versions simultaneously
- A/B comparison shows which version gets more views, deeper reads, and longer engagement
- The system can recommend which version to "promote" as the primary based on performance data

**Recruiter insight (hypothetical, clearly labeled):**
The system cannot know who is viewing the resume. But it can show patterns:
> "Your resume was viewed 4 times in the past 48 hours — often a sign of recruiter shortlisting activity."

### 6.3 The Optimization Feedback Loop

Analytics feed back into the optimization engine:

**Example:**
> "Viewers spent 80% of their time on your Skills section and only 12 seconds on your Work Experience. This may indicate your experience bullets need strengthening. [Review now]"

**Version intelligence:**
> "Version B (with the Executive Dark theme) has 35% longer average viewing time than Version A. Consider making it your primary resume."

### 6.4 Privacy & Data Handling

- View data is anonymized. The system records IP hash + timestamp, not identity.
- Users can reset their analytics at any time.
- A GDPR-compliant banner is shown on the shared resume page explaining that the resume owner may see anonymized viewing statistics.
- Users can disable analytics entirely if they prefer privacy over data.

---

## 7. Competitive Positioning & Defensibility

### 7.1 The Market Landscape

Current players fall into four categories:

| Category | Examples | Core Value | Weakness |
|---|---|---|---|
| Template sites | Resume.io, Zety, Novoresume | Beautiful templates | No AI, no intelligence |
| ATS tools | Jobscan | Keyword matching | No resume building |
| AI writers | Kickresume AI | AI-generated content | Generic, no coaching |
| Career platforms | LinkedIn | Network effects | Weak resume builder |

This product attacks the intersection of all four. No existing product does all of:
- Beautiful visual editor
- Conversational AI coaching
- Deep ATS optimization
- Shareable link with analytics
- Psychologically smart monetization

### 7.2 Pain Points Solved Better

**Pain Point 1: "I don't know how to describe my experience."**

Template sites: Provide empty text boxes.
This product: Conducts an interview and writes the content for you.

**Pain Point 2: "I don't know if my resume will pass ATS."**

Template sites: Don't tell you at all. Some even use two-column layouts that fail ATS.
This product: Shows a live ATS score, flags every issue, and explains how to fix it.

**Pain Point 3: "I'm applying to 10 jobs and need different versions."**

Template sites: Require manual duplication and editing.
This product: Generates a job-tailored version in one click.

**Pain Point 4: "I don't know if recruiters are actually reading my resume."**

Template sites: No visibility after the PDF is downloaded.
This product: Shows exactly how many people viewed it, for how long, and what they looked at.

**Pain Point 5: "My resume feels outdated but I've been too busy to update it."**

Template sites: Passive — they don't remind you.
This product: Sends smart nudges ("You updated your resume 6 months ago — is it current?") and locks editing on expiry to create urgency.

### 7.3 Long-Term Retention Mechanics

**Habit formation:** The resume is never "done." Job seeking is ongoing. The product positions itself as the permanent home of a user's professional identity — not a one-time download tool.

**Lifecycle engagement:**
- Student → First job application → First job → Promotion → Job change → Executive resume
- Each career stage triggers a new use case, a new feature need, a new reason to upgrade.

**Network effects (future):** If users share resumes via the platform's link, every view is a brand touchpoint. If recruiters start recognizing the resume format as high-quality, the platform gains B2B interest organically.

**Content moat:** The Conversational AI accumulates data on what types of answers lead to strong bullets, what bullet patterns lead to interviews, and what keywords lead to views. This data makes the AI better over time in a way competitors cannot replicate without the same user base.

### 7.4 Defensibility Pillars

| Pillar | Description |
|---|---|
| AI training data | Proprietary dataset of user-approved bullet points and their outcomes |
| UX quality | The conversational flow requires significant design and AI investment to replicate |
| Lock-in mechanics | Users who have built a resume through the conversational AI are deeply invested in the platform |
| Analytics data | Users who can see their resume's performance have a reason to stay and optimize |
| Career lifecycle | A product that serves users from first job to C-suite has a decades-long LTV |

---

## 8. Technical Architecture Overview

> This section is a high-level guide. The AI system building this product should fill in specific implementation details based on the stack being used.

### 8.1 Frontend

**Recommended Stack:**
- **Framework:** React (Next.js for SSR) or SvelteKit
- **Resume Canvas:** Custom render engine OR CSS-based layout with print-accurate styling
- **Chat Interface:** Custom chat UI component (not a third-party widget)
- **PDF Export:** Puppeteer (headless Chromium) running server-side
- **DOCX Export:** docx.js or python-docx

**Resume Data Model (simplified):**

```json
{
  "resumeId": "uuid",
  "userId": "uuid",
  "title": "Software Engineer Resume",
  "themeId": "modern-blue",
  "themeOverrides": { "accentColor": "#0052cc" },
  "sections": [
    {
      "sectionId": "uuid",
      "type": "work_experience",
      "title": "Work Experience",
      "order": 1,
      "entries": [
        {
          "entryId": "uuid",
          "company": "Acme Corp",
          "title": "Senior Engineer",
          "startDate": "2021-03",
          "endDate": null,
          "current": true,
          "bullets": [
            {
              "bulletId": "uuid",
              "text": "Led migration of monolithic API to microservices...",
              "aiGenerated": true,
              "qualityScore": 87
            }
          ]
        }
      ]
    }
  ],
  "shareSettings": {
    "isPublic": true,
    "slug": "john-doe-engineer",
    "password": null,
    "analyticsEnabled": true
  },
  "metadata": {
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T14:30:00Z",
    "proLockedAt": null
  }
}
```

### 8.2 Backend

- **API:** REST or GraphQL
- **AI Integration:** OpenAI GPT-4 API or Anthropic Claude API (for conversational flow and bullet rewriting)
- **ATS Analysis:** Custom NLP pipeline OR third-party ATS testing API
- **Job Matching:** Semantic embeddings (e.g., OpenAI text-embedding-ada-002 or sentence-transformers) + cosine similarity scoring
- **Analytics:** Custom event tracking table (PostgreSQL) OR Mixpanel/Amplitude with custom events

### 8.3 AI Prompting Architecture

The conversational flow uses a **stateful prompt chain**:

Each user message is sent to the LLM with:
1. A system prompt defining the AI's role (career coach persona)
2. The current career level context
3. The current resume state (what has been filled in so far)
4. The full conversation history (for context continuity)
5. The specific task instruction (e.g., "extract STAR components from this answer and generate a bullet point")

The system prompt must enforce:
- Tone: warm, professional, encouraging (not clinical)
- Behavior: ask one question at a time, never multiple questions in one message
- Output format: when generating bullets, always use JSON so the front-end can parse and insert them cleanly

### 8.4 Database Schema Notes

Key tables:
- `users` — account data, subscription status, tier
- `resumes` — resume metadata and JSON content blob
- `resume_versions` — historical versions (for A/B testing and version history)
- `conversations` — serialized chat history for the AI builder
- `share_events` — analytics events (resume_id, timestamp, ip_hash, section, duration)
- `optimization_cache` — cached ATS scores and bullet quality scores (invalidated on edit)

---

## 9. AI Logic Design Reference

### 9.1 Bullet Quality Scorer — Prompt Template

```
You are an expert resume reviewer. Given the following resume bullet point, score it from 0–100 on each of these dimensions:

1. action_verb_strength (0–20): Does it start with a strong, specific action verb?
2. specificity (0–25): Does it include specific details, technologies, methods, or scope?
3. measurable_impact (0–30): Does it contain a quantifiable result (numbers, percentages, dollar amounts)?
4. length_quality (0–15): Is it 1–2 lines (not too short, not too long)?
5. uniqueness (0–10): Does it avoid generic phrases like "responsible for" or "helped with"?

Bullet point: "{bullet_text}"

Return JSON only:
{
  "total_score": number,
  "dimensions": { "action_verb_strength": n, "specificity": n, "measurable_impact": n, "length_quality": n, "uniqueness": n },
  "weak_points": ["list of specific weaknesses"],
  "rewrite": "improved version of the bullet point"
}
```

### 9.2 Conversational Interview — System Prompt Template

```
You are an expert career coach helping a user build their resume. Your role is to conduct a friendly, professional interview to extract the information needed to write strong, impactful resume bullet points.

USER CONTEXT:
- Career level: {career_level}
- Target role type: {role_type}
- Current section being built: {section_name}
- Resume built so far: {resume_summary}

CONVERSATION RULES:
1. Ask ONE question at a time. Never ask multiple questions in a single message.
2. Be warm, conversational, and encouraging. Avoid clinical or robotic language.
3. When you have enough information for a bullet point (situation, task, action, result), generate it.
4. Always ask for metrics if they're missing. If the user doesn't know exact numbers, accept estimates.
5. After generating a bullet, ask: "Does this sound right, or would you like to change anything?"
6. When generating bullets, output them in this JSON block at the END of your message:

<bullet_output>
{"text": "Generated bullet point text here.", "confidence": 0.0-1.0}
</bullet_output>

Current conversation history:
{conversation_history}
```

### 9.3 Job Description Parser — Prompt Template

```
Analyze the following job description and extract structured data for resume matching.

Job Description:
{job_description_text}

Return JSON only:
{
  "job_title": "...",
  "company_type": "startup/enterprise/agency/other",
  "seniority_level": "junior/mid/senior/lead/executive",
  "required_skills": ["list of hard skills, tools, technologies"],
  "preferred_skills": ["list of nice-to-have skills"],
  "key_responsibilities": ["3-5 main responsibilities as short phrases"],
  "industry_keywords": ["important terminology specific to this role/industry"],
  "soft_skills": ["communication, leadership, etc."],
  "years_experience_required": number or null
}
```

---

## 10. Full UX Flow Map

### 10.1 New User Onboarding Flow

```
Landing Page
    ↓
Sign Up (email / Google OAuth)
    ↓
Welcome Screen: "Let's build your resume. How would you like to start?"
    ├── [Build it myself] → Manual Editor (blank)
    ├── [Let AI guide me] → Career Level Detection → Conversational Interview
    └── [Import LinkedIn] → LinkedIn Import → Manual Editor (pre-filled)
    ↓
Resume Editor (active)
    ↓
[At any point] → Optimization Sidebar → ATS Score visible
    ↓
Export or Share → Paywall check
    ├── Free User → Watermarked PDF only
    └── Pro User → Full export options + Share link
```

### 10.2 Returning User Flow

```
Login
    ↓
Dashboard: "My Resumes" (card grid)
    ↓
Select resume → Resume Editor
    ├── Pro Active → Full editing access
    └── Pro Expired → Locked view + Upgrade modal on click
    ↓
Check Analytics (if shared) → View insights → Optimization suggestions
```

### 10.3 Job Application Flow (Pro Feature)

```
Resume Editor
    ↓
"Tailor for a Job" button (right panel)
    ↓
Paste Job Description
    ↓
AI analyzes JD → Shows match score + missing keywords
    ↓
[Generate tailored version] → Creates copy of resume
    ↓
AI rewrites bullets for relevance, adds missing keywords
    ↓
Side-by-side comparison: Original vs. Tailored
    ↓
User approves → Tailored version saved as new resume
    ↓
Export or Share tailored version
```

### 10.4 Subscription Conversion Flow

```
Free User hits paywall (export / AI feature / analytics)
    ↓
[Upgrade to Pro] modal appears
    → Shows monthly vs. annual pricing
    → Highlights 3 features they're missing
    → Shows social proof ("Used by 50,000 job seekers")
    ↓
Select plan → Stripe checkout
    ↓
Confirmation screen → "Your resume is now unlocked"
    ↓
Immediate feature access — no page reload required
```

---

## Appendix A: Copywriting Principles

Every piece of UI copy must follow these rules:

1. **Action-oriented:** "Build your resume" not "Resume builder"
2. **User-centric:** "Your resume is locked" not "Subscription expired"
3. **Specific:** "2 weak bullet points detected" not "Some issues found"
4. **Encouraging on errors:** "Here's how to fix this" not just "Error"
5. **Value-forward on upsells:** "Unlock AI coaching" not "Upgrade to Pro"

---

## Appendix B: Success Metrics

The product should be instrumented to track:

| Metric | Target |
|---|---|
| Resume completion rate (at least 3 sections filled) | > 60% of new users |
| Conversational AI activation rate | > 40% of new users |
| Free-to-Pro conversion rate | > 8% within 14-day trial |
| Pro renewal rate (month 1 → month 2) | > 70% |
| Resume share rate | > 30% of Pro users |
| Average session length | > 12 minutes |
| ATS score improvement (before vs. after using tool) | > 20 points average |

---

*End of Product Specification Document*
*Version 1.0 — For use by AI design/build systems*
