import { getOpenAI } from './openai-client';
import { CompanyProfile, ToneType } from '@/types/motivation-letter';



// ──────────────────────────────────────────────
// Deep Tone Profiles
// Each profile defines: how to WRITE (not just what to say)
// ──────────────────────────────────────────────
const TONE_PROFILES: Record<ToneType, {
    label: string;
    systemPersona: string;
    writingStyle: string;
    forbiddenPhrases: string;
    vocabularyExamples: string;
    sectionInstructions: { intro: string; strengths: string; whyCompany: string; closing: string };
}> = {
    executive: {
        label: 'Executive / C-Level',
        systemPersona: `You are a C-level executive ghostwriter with 20+ years of experience writing 
leadership communications for Fortune 500 executives. Your words exude authority, vision, 
and strategic intelligence. Every sentence is purposeful — there is no fluff.`,
        writingStyle: `Use authoritative, decisive language. Short powerful statements. 
Strategic vocabulary. Refer to P&L, organizational transformation, stakeholder alignment, 
and enterprise-scale impact. Write as if the reader is a board or a hiring committee.
Paragraphs should feel commanding — like a leader who is accustomed to making decisions worth millions.`,
        forbiddenPhrases: `Do NOT use: "I believe", "I think", "I feel", "perhaps", "maybe", "kind of", "sort of".
Do NOT be apologetic or tentative. Do NOT use exclamation marks.`,
        vocabularyExamples: `Use: orchestrated, spearheaded, catalyzed, drove $X growth, board-level, 
P&L ownership, cross-functional alignment, scaled from X to Y, organizational transformation, 
enterprise-wide initiatives, C-suite, visionary leadership, compelled results.`,
        sectionInstructions: {
            intro: `Open with a powerful statement of who you are as a leader and what you've built. 
Then connect your strategic leadership background to the specific leadership challenge of the role at this company. 
No pleasantries — this is a peer conversation between equals.`,
            strengths: `Present 2-3 of your most impactful executive-level achievements with specific scale 
(revenue, teams, transformation scope). Use the word "I" deliberately and confidently. 
Reference the enterprise scale of your past work.`,
            whyCompany: `Express why this company's strategic position, market opportunity, or leadership 
challenge is exactly the arena where your abilities create maximum leverage. 
Reference the company's industry, mission, or competitive position specifically.`,
            closing: `Close with conviction. State clearly that you are the right person, you will bring 
measurable value, and you welcome a strategic conversation. Be brief and final.`,
        },
    },

    startup: {
        label: 'Startup & Innovation',
        systemPersona: `You are a startup growth expert and builder. Your writing is direct, energetic, 
and optimistic. You've built things from zero to one and helped companies grow 10x. 
Your communication style is clear, fast-paced, and filled with builder energy.`,
        writingStyle: `Write in active voice. Short sentences. High energy. 
Show genuine excitement about the product/mission. Use "I built", "I shipped", "I grew", "I launched".
Sound like someone who moves fast, breaks things intelligently, and has real passion for the work.
Do NOT sound corporate — sound like a builder talking to another builder.`,
        forbiddenPhrases: `Avoid: corporate jargon, passive voice, long meandering sentences, 
"I was responsible for", "I was tasked with", vague outcome descriptions.`,
        vocabularyExamples: `Use: shipped, built from scratch, grew X to Y, zero-to-one, scale, iterate, 
product-minded, moves fast, mission-driven, scrappy, high-impact, MVPs, product-market fit, 
10x growth, full-stack thinking, owned end-to-end, maker, disrupt.`,
        sectionInstructions: {
            intro: `Open with who you are as a builder — be direct and exciting. What have you built? 
What fires you up about this company's product or mission? Show genuine enthusiasm in 1-2 punchy sentences.`,
            strengths: `Highlight your most impressive builder achievements: what you shipped, what grew, 
what you owned end-to-end. Include a specific metric (10x growth, 50k users, etc.). 
Keep it snappy — no fluff. Real results, real impact.`,
            whyCompany: `Explain what excites you about this specific company's product, tech, or mission. 
Be specific — reference what the company actually does. Show you've done your homework. 
Sound like someone who genuinely wants to work here, not just anywhere.`,
            closing: `End with enthusiasm and directness. You want to work together. 
You'll hit the ground running. Keep it short — one or two strong sentences.`,
        },
    },

    friendly_formal: {
        label: 'Warm & Professional',
        systemPersona: `You are a seasoned career communications coach who specializes in writing 
authentic, warm professional content. You help candidates sound like their best professional selves — 
competent, genuine, and personable — without sounding stiff or corporate.`,
        writingStyle: `Write in a warm, confident first-person voice. 
Balance professionalism with humanity. Show the candidate's personality while maintaining credibility.
Use collaborative language ("together", "contribute", "grow with"). 
Sentences should flow naturally, as if the candidate is speaking with genuine enthusiasm.`,
        forbiddenPhrases: `Avoid overly cold corporate language, excessive buzzwords, 
impersonal passive constructions, or anything that sounds generic or template-like.`,
        vocabularyExamples: `Use: passionate about, genuinely excited, thrilled to contribute, 
collaborate, meaningful work, team player who also leads, grow with the team, 
shared values, make a real difference, connect with the mission, authentic, energized.`,
        sectionInstructions: {
            intro: `Open warmly — introduce yourself and express genuine excitement about the opportunity. 
Make it feel like a real person wrote this. What drew you to this role specifically? 
Sound enthusiastic yet professional.`,
            strengths: `Share your key strengths in a relatable way. Back up with a specific example or result.
Show how your skills have helped teams or companies achieve meaningful things.`,
            whyCompany: `Express genuine connection to the company's culture, mission, or people. 
Be specific about what resonates — culture fit, product impact, or company values.`,
            closing: `Close warmly and confidently. Express that you'd love to connect and discuss 
how you can contribute. Sign off like a professional who genuinely cares.`,
        },
    },

    corporate: {
        label: 'Professional & Corporate',
        systemPersona: `You are a professional communications specialist for large enterprises. 
You write polished, precise, results-oriented content for top-tier corporate environments 
including banking, consulting, law, and Fortune 500 companies.`,
        writingStyle: `Write formally and precisely. Every claim should be backed by a result. 
Use structured arguments. Focus on deliverables, ROI, alignment with organizational objectives. 
Be thorough but efficient — no unnecessary words.`,
        forbiddenPhrases: `Avoid: casual language, slang, emojis, first-name informality, 
overly personal anecdotes, unprofessional enthusiasm.`,
        vocabularyExamples: `Use: delivered, demonstrated, achieved, contributed, ensured compliance, 
aligned with strategic objectives, measurable outcomes, cross-departmental collaboration, 
proficiency, expertise, stakeholder management, consistent track record.`,
        sectionInstructions: {
            intro: `Open with a formal professional statement about your background and why you are 
applying. Reference your years of experience and alignment with the role requirements.`,
            strengths: `Present 2-3 specific professional achievements backed by quantifiable results. 
Use formal, precise language. Reference skills directly relevant to the target role.`,
            whyCompany: `Explain your interest in the company and role based on the organization's 
objectives, market position, or professional reputation. Be factual and respectful.`,
            closing: `Close formally with a clear call to action — offer to provide additional documentation 
and express availability for an interview. Use a professional sign-off.`,
        },
    },
};

// ──────────────────────────────────────────────
// Rich CV Data Extractor
// Pulls maximum relevant data from the CV JSON
// ──────────────────────────────────────────────
function extractCvContext(resumeJSON: any, targetRole: string): string {
    if (!resumeJSON) return 'No CV data provided.';

    const name = resumeJSON.header?.full_name || resumeJSON.name || resumeJSON.full_name || 'Candidate';
    const headline = resumeJSON.header?.headline || resumeJSON.headline || '';
    const summary = resumeJSON.summary || resumeJSON.about || '';
    const email = resumeJSON.header?.email || resumeJSON.email || '';
    const location = resumeJSON.header?.location || resumeJSON.location || '';

    // Skills — handle both array and nested object formats
    let skills: string[] = [];
    if (Array.isArray(resumeJSON.skills)) {
        skills = resumeJSON.skills.slice(0, 15).map((s: any) =>
            typeof s === 'string' ? s : s.name || s.skill || JSON.stringify(s)
        );
    } else if (resumeJSON.skills && typeof resumeJSON.skills === 'object') {
        skills = Object.values(resumeJSON.skills).flat().slice(0, 15).map((s: any) =>
            typeof s === 'string' ? s : String(s)
        );
    }

    // Experience — rich format
    const experiences: string[] = (resumeJSON.experience || resumeJSON.work_experience || resumeJSON.experiences || [])
        .slice(0, 4)
        .map((e: any) => {
            const title = e.title || e.role || e.position || 'Unknown Role';
            const company = e.company || e.organization || '';
            const duration = e.duration || e.period || e.dates || '';
            const desc = (e.description || e.summary || e.achievements || '')
                .substring(0, 200);
            return `• ${title}${company ? ` at ${company}` : ''}${duration ? ` (${duration})` : ''}${desc ? ': ' + desc : ''}`;
        });

    // Education
    const education: string[] = (resumeJSON.education || [])
        .slice(0, 2)
        .map((ed: any) => {
            const degree = ed.degree || ed.title || '';
            const school = ed.school || ed.institution || ed.university || '';
            const year = ed.year || ed.graduation_year || '';
            return `${degree}${school ? ` from ${school}` : ''}${year ? ` (${year})` : ''}`;
        });

    // Achievements / Certifications
    const achievements: string[] = (resumeJSON.achievements || resumeJSON.accomplishments || [])
        .slice(0, 3)
        .map((a: any) => typeof a === 'string' ? a : a.title || a.name || JSON.stringify(a));

    const certifications: string[] = (resumeJSON.certifications || resumeJSON.certificates || [])
        .slice(0, 3)
        .map((c: any) => typeof c === 'string' ? c : c.name || c.title || JSON.stringify(c));

    const languages: string[] = (resumeJSON.languages || [])
        .slice(0, 4)
        .map((l: any) => typeof l === 'string' ? l : `${l.language || l.name} (${l.proficiency || l.level || ''})`);

    return `
=== CANDIDATE CV DATA ===
Full Name: ${name}
Professional Headline: ${headline}
Location: ${location}
Email: ${email}
Target Role: ${targetRole}

PROFESSIONAL SUMMARY:
${summary || 'Not provided'}

CORE SKILLS (use these specifically in your writing!):
${skills.length > 0 ? skills.join(', ') : 'Not specified'}

WORK EXPERIENCE (reference these real companies and titles):
${experiences.length > 0 ? experiences.join('\n') : 'Not provided'}

EDUCATION:
${education.length > 0 ? education.join('\n') : 'Not provided'}

KEY ACHIEVEMENTS:
${achievements.length > 0 ? achievements.join(', ') : 'Not specified'}

CERTIFICATIONS:
${certifications.length > 0 ? certifications.join(', ') : 'None listed'}

LANGUAGES:
${languages.length > 0 ? languages.join(', ') : 'Not specified'}
`.trim();
}

// ──────────────────────────────────────────────
// Master Prompt Builder
// ──────────────────────────────────────────────
function buildPresentationPrompt(
    companyProfile: CompanyProfile,
    resumeJSON: any,
    targetRole: string,
    tone: ToneType,
    language: 'en' | 'tr' = 'en',
    jobDescription?: string
): string {
    const lang = language === 'tr' ? 'Turkish' : 'English';
    const toneProfile = TONE_PROFILES[tone] ?? TONE_PROFILES.corporate;
    const cvContext = extractCvContext(resumeJSON, targetRole);
    const candidateName = resumeJSON?.header?.full_name || resumeJSON?.name || resumeJSON?.full_name || 'Candidate';

    const companyContext = `
=== TARGET COMPANY ===
Company: ${companyProfile.name}
Industry: ${companyProfile.industry || 'Not specified'}
Mission: ${companyProfile.mission || 'Not specified'}
Values: ${(companyProfile.values || []).join(', ') || 'Not specified'}
Products/Services: ${(companyProfile.products || []).join(', ') || 'Not specified'}
Culture: ${(companyProfile.cultureIndicators || []).join(', ') || 'Not specified'}
${jobDescription ? `\nJOB DESCRIPTION CONTEXT (use specific requirements from this):\n${jobDescription.substring(0, 1000)}` : ''}`.trim();

    return `${toneProfile.systemPersona}

WRITING STYLE REQUIREMENTS:
${toneProfile.writingStyle}

STRICTLY FORBIDDEN:
${toneProfile.forbiddenPhrases}

VOCABULARY TO USE:
${toneProfile.vocabularyExamples}

OUTPUT LANGUAGE: ${lang}
TONE: ${toneProfile.label}

OUTPUT FORMAT:
Generate EXACTLY 4 sections with the markers below.
Each section = ONE flowing paragraph of 2-4 sentences (target 350-600 characters).
The text must fill the slide naturally — write richly, not sparingly.
NO bullet points. NO line breaks within a section. NO preamble before [INTRO].

PERSPECTIVE & VOICE (CRITICAL INSTRUCTION):
You ARE the candidate (${candidateName}).
Write entirely in the FIRST-PERSON ("I", "my", "me" / "Ben", "benim", "bana").
NEVER write in the third-person. NEVER talk about the candidate from an external perspective.
Do NOT say "${candidateName} is an experienced professional". Say "I am an experienced professional".

IMPORTANT — DEALING WITH SPARSE CV DATA:
If the CV data is limited or thin, DO NOT invent fake job titles or fake companies that are not in the CV.
Instead, focus on generalized enthusiasm, relevant soft skills, and your alignment with the company context (${companyProfile.name}) and the target role (${targetRole}).
Write as yourself (${candidateName}) with absolute confidence and the selected tone (${toneProfile.label}).

${cvContext}

${companyContext}

SECTION INSTRUCTIONS:

[INTRO]
${toneProfile.sectionInstructions.intro}
IMPORTANT: Write strictly as yourself ("I" / "Ben"). Mention your actual name (${candidateName}).
[/INTRO]

[STRENGTHS]
${toneProfile.sectionInstructions.strengths}
IMPORTANT: Reference REAL job titles, REAL companies, and REAL skills from the CV. Not generic.
[/STRENGTHS]

[WHY_COMPANY]
${toneProfile.sectionInstructions.whyCompany}
IMPORTANT: Use the company name "${companyProfile.name}" explicitly. Reference actual company details above.
[/WHY_COMPANY]

[CLOSING]
${toneProfile.sectionInstructions.closing}
[/CLOSING]

CRITICAL RULES:
1. Use the EXACT writing style for "${toneProfile.label}" — this should feel unmistakably ${toneProfile.label}
2. Pull SPECIFIC data from the CV — real job titles, real companies, real skills
3. Each section is ONE paragraph, no markdown formatting inside
4. Language: ${lang}
5. Return ONLY the 4 section blocks starting with [INTRO]. Nothing before it.`;
}

// ──────────────────────────────────────────────
// Section Parser — robust multi-strategy
// ──────────────────────────────────────────────
export function parsePresentationSections(raw: string): {
    intro: string;
    strengths: string;
    whyCompany: string;
    closing: string;
} {
    // Strategy 1: parse [TAG]...[/TAG] closed markers
    const closed = (tag: string): string => {
        const m = raw.match(new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[\\/${tag}\\]`, 'i'));
        return m ? clean(m[1]) : '';
    };

    // Strategy 2: extract text between [TAG] and the next [ANYTHING] or end
    const open = (tag: string): string => {
        const m = raw.match(new RegExp(`\\[${tag}\\]([\\s\\S]*?)(?=\\[[A-Z_]+\\]|$)`, 'i'));
        return m ? clean(m[1]) : '';
    };

    // Clean: collapse newlines, remove any leftover brackets markers
    const clean = (s: string): string =>
        s
            .replace(/\[\/?[A-Z_]+\]/g, '')  // strip raw markers
            .replace(/\n+/g, ' ')            // flatten newlines
            .trim();

    const extract = (tag: string): string => closed(tag) || open(tag);

    const intro = extract('INTRO');
    const strengths = extract('STRENGTHS');
    const why = extract('WHY_COMPANY');
    const closing = extract('CLOSING');

    // If all fail (completely malformed output), split by position
    if (!intro && !strengths && !why) {
        const plainText = clean(raw);
        const quarter = Math.floor(plainText.length / 4);
        return {
            intro: plainText.substring(0, quarter * 1),
            strengths: plainText.substring(quarter * 1, quarter * 2),
            whyCompany: plainText.substring(quarter * 2, quarter * 3),
            closing: plainText.substring(quarter * 3),
        };
    }

    return {
        intro,
        strengths,
        whyCompany: why,
        closing,
    };
}

// ──────────────────────────────────────────────
// Main Generator
// ──────────────────────────────────────────────
export async function generateMotivationLetter(
    companyProfile: CompanyProfile,
    resumeJSON: any,
    targetRole: string,
    tone: ToneType,
    language: 'en' | 'tr' = 'en',
    jobDescription?: string
): Promise<{ letterText: string; letterHtml: string }> {
    const openai = getOpenAI();

    const systemPrompt = buildPresentationPrompt(
        companyProfile, resumeJSON, targetRole, tone, language, jobDescription
    );

    let letterText = '';
    let letterHtml = '';

    try {
        const candidateName = resumeJSON?.header?.full_name || resumeJSON?.name || resumeJSON?.full_name || 'the candidate';
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `You are ${candidateName}. Write your motivation presentation applying for ${targetRole} at ${companyProfile.name} in the ${TONE_PROFILES[tone]?.label ?? tone} tone. Write entirely in the first-person perspective.` }
            ],
            temperature: 0.75,
            max_tokens: 2000,
        });
        letterText = completion.choices[0].message?.content?.trim() || '';
        letterHtml = buildPreviewHtml(letterText, companyProfile.name, targetRole, resumeJSON);

    } catch (err: any) {
        console.error('AI Generation failed:', err);
        throw new Error('Sunum üretimi sırasında hata oluştu: ' + err.message);
    }

    if (!letterText || letterText.length < 100) {
        throw new Error('Üretilen sunum çok kısa veya boş. Lütfen tekrar deneyin.');
    }

    return { letterText, letterHtml };
}

// ──────────────────────────────────────────────
// HTML Preview Builder (mirrors PDF slide design)
// ──────────────────────────────────────────────
export function buildPreviewHtml(
    text: string,
    companyName: string,
    targetRole: string,
    resumeJSON?: any
): string {
    const sections = parsePresentationSections(text);
    const candidateName = resumeJSON?.header?.full_name || resumeJSON?.name || resumeJSON?.full_name || '';
    const candidatePhoto = resumeJSON?.header?.photo_url || '';
    const NAVY = '#0f172a';
    const GOLD = '#e6a817';

    const initials = candidateName
        ? candidateName.trim().split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    const slide = (num: string, title: string, body: string, companyRef?: string) => `
    <div style="display:flex;border-radius:12px;overflow:hidden;margin-bottom:16px;box-shadow:0 2px 12px rgba(0,0,0,0.12);">
      <div style="width:200px;min-width:200px;background:${NAVY};padding:24px 16px;display:flex;flex-direction:column;align-items:center;">
        <div style="width:56px;height:56px;border-radius:50%;background:${candidatePhoto ? 'transparent' : GOLD};display:flex;align-items:center;justify-content:center;margin-bottom:12px;overflow:hidden;">
          ${candidatePhoto
            ? `<img src="${candidatePhoto}" style="width:100%;height:100%;object-fit:cover;" />`
            : `<span style="font-size:18px;font-weight:900;color:${NAVY};">${initials}</span>`
        }
        </div>
        <div style="font-size:10px;font-weight:700;color:#fff;text-align:center;margin-bottom:4px;">${candidateName}</div>
        <div style="font-size:8px;color:${GOLD};text-align:center;margin-bottom:auto;">${targetRole}</div>
        <div style="font-size:36px;font-weight:900;color:#ffffff10;margin-top:20px;">${num}</div>
      </div>
      <div style="flex:1;background:white;padding:24px 28px;">
        <div style="font-size:18px;font-weight:800;color:${NAVY};margin-bottom:8px;">${companyRef || title}</div>
        <div style="height:3px;width:44px;background:${GOLD};border-radius:2px;margin-bottom:16px;"></div>
        <p style="font-size:11.5px;line-height:1.85;color:#334155;margin:0;">${body}</p>
      </div>
    </div>`;

    return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:760px;margin:0 auto;">
  <div style="background:${NAVY};border-radius:14px;padding:36px 48px;margin-bottom:16px;position:relative;overflow:hidden;">
    <div style="position:absolute;top:-80px;right:-30px;width:60px;height:600px;background:${GOLD};border-radius:4px;transform:rotate(20deg);opacity:0.9;"></div>
    <div style="position:absolute;top:-80px;right:50px;width:8px;height:600px;background:${GOLD}60;border-radius:4px;transform:rotate(20deg);"></div>
    <div style="font-size:26px;font-weight:900;color:white;letter-spacing:-0.5px;position:relative;">${(candidateName || 'Candidate').toUpperCase()}</div>
    <div style="font-size:11px;font-weight:700;color:${GOLD};margin-top:8px;letter-spacing:2px;text-transform:uppercase;position:relative;">${targetRole}</div>
    <div style="font-size:10px;color:#ffffff80;margin-top:10px;position:relative;">Prepared for ${companyName}</div>
  </div>
  ${slide('01', 'Introduction', sections.intro)}
  ${slide('02', 'Key Strengths', sections.strengths)}
  ${slide('03', `Why ${companyName}?`, sections.whyCompany)}
  <div style="background:${NAVY};border-radius:12px;padding:32px;text-align:center;position:relative;overflow:hidden;">
    <div style="position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:60px;height:300px;background:${GOLD}20;border-radius:4px;rotate:20deg;"></div>
    <div style="font-size:24px;font-weight:900;color:white;margin-bottom:10px;position:relative;">Thank You</div>
    <div style="font-size:10px;color:#ffffff80;line-height:1.7;margin-bottom:20px;max-width:500px;margin-left:auto;margin-right:auto;position:relative;">${sections.closing}</div>
    <div style="border:1px solid #ffffff30;border-radius:10px;padding:14px 28px;display:inline-block;position:relative;">
      <div style="font-size:11px;font-weight:700;color:white;">Let's Connect</div>
      ${resumeJSON?.email ? `<div style="font-size:10px;color:${GOLD};margin-top:4px;">${resumeJSON.email}</div>` : ''}
    </div>
  </div>
</div>`.trim();
}

// ──────────────────────────────────────────────
// Backward-compat exports
// ──────────────────────────────────────────────
export function convertSlidesToHtml(text: string, companyName: string, targetRole: string, resumeJSON?: any): string {
    return buildPreviewHtml(text, companyName, targetRole, resumeJSON);
}
export function convertLetterTextToHtml(text: string): string {
    return buildPreviewHtml(text, '', '');
}
