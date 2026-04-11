'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { MotivationLetter } from '@/types/motivation-letter';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, Save, Check, Loader2, X, Sparkles, RefreshCw, Pencil,
    User, Building2, MessageSquare, HandshakeIcon,
} from 'lucide-react';
import { toast } from 'sonner';

/* ─── Types ──────────────────────────────────────────────── */
interface LetterEditorModalProps {
    letter: MotivationLetter;
    onClose: () => void;
    onSaved: (updated: MotivationLetter) => void;
}

interface LetterSections {
    intro: string;
    strengths: string;
    whyCompany: string;
    closing: string;
}

type SectionKey = keyof LetterSections;

/* ─── Section tabs (mirrors the CV Builder pattern) ────── */
const SECTION_TABS: { id: SectionKey; Icon: React.FC<any>; label: string; title: string; subtitle: string }[] = [
    { id: 'intro', Icon: User, label: 'Intro', title: 'Introduction', subtitle: 'Your opening statement and who you are.' },
    { id: 'strengths', Icon: Sparkles, label: 'Strengths', title: 'Key Strengths', subtitle: 'Highlight your key achievements and skills.' },
    { id: 'whyCompany', Icon: Building2, label: 'Why Co.', title: 'Why This Company?', subtitle: 'Why you want to work at this company.' },
    { id: 'closing', Icon: HandshakeIcon, label: 'Closing', title: 'Closing Statement', subtitle: 'Your final words and call to action.' },
];

/* ─── Section Parser (mirrors server-side logic) ─────── */
function parseSections(raw: string): LetterSections {
    const closed = (tag: string): string => {
        const m = raw.match(new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[\\/${tag}\\]`, 'i'));
        return m ? clean(m[1]) : '';
    };
    const open = (tag: string): string => {
        const m = raw.match(new RegExp(`\\[${tag}\\]([\\s\\S]*?)(?=\\[[A-Z_]+\\]|$)`, 'i'));
        return m ? clean(m[1]) : '';
    };
    const clean = (s: string): string =>
        s.replace(/\[\/?[A-Z_]+\]/g, '').trim();
    const extract = (tag: string): string => closed(tag) || open(tag);

    return {
        intro: extract('INTRO'),
        strengths: extract('STRENGTHS'),
        whyCompany: extract('WHY_COMPANY'),
        closing: extract('CLOSING'),
    };
}

/* ─── Reconstruct content from sections ──────────────── */
function sectionsToContent(s: LetterSections): string {
    return `[INTRO]\n${s.intro}\n[STRENGTHS]\n${s.strengths}\n[WHY_COMPANY]\n${s.whyCompany}\n[CLOSING]\n${s.closing}`;
}

/* ─── Preview HTML builder (client-side mirror) ──────── */
function buildPreviewHtml(
    sections: LetterSections,
    companyName: string,
    targetRole: string,
    candidateName: string,
): string {
    const NAVY = '#0f172a';
    const GOLD = '#e6a817';

    const initials = candidateName
        ? candidateName.trim().split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    const slide = (num: string, title: string, body: string) => `
    <div style="display:flex;border-radius:12px;overflow:hidden;margin-bottom:16px;box-shadow:0 2px 12px rgba(0,0,0,0.12);">
      <div style="width:200px;min-width:200px;background:${NAVY};padding:24px 16px;display:flex;flex-direction:column;align-items:center;">
        <div style="width:56px;height:56px;border-radius:50%;background:${GOLD};display:flex;align-items:center;justify-content:center;margin-bottom:12px;overflow:hidden;">
          <span style="font-size:18px;font-weight:900;color:${NAVY};">${initials}</span>
        </div>
        <div style="font-size:10px;font-weight:700;color:#fff;text-align:center;margin-bottom:4px;">${candidateName}</div>
        <div style="font-size:8px;color:${GOLD};text-align:center;margin-bottom:auto;">${targetRole}</div>
        <div style="font-size:36px;font-weight:900;color:#ffffff10;margin-top:20px;">${num}</div>
      </div>
      <div style="flex:1;background:white;padding:24px 28px;">
        <div style="font-size:18px;font-weight:800;color:${NAVY};margin-bottom:8px;">${title}</div>
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
    <div style="font-size:24px;font-weight:900;color:white;margin-bottom:10px;position:relative;">Thank You</div>
    <div style="font-size:10px;color:#ffffff80;line-height:1.7;margin-bottom:20px;max-width:500px;margin-left:auto;margin-right:auto;position:relative;">${sections.closing}</div>
    <div style="border:1px solid #ffffff30;border-radius:10px;padding:14px 28px;display:inline-block;position:relative;">
      <div style="font-size:11px;font-weight:700;color:white;">Let's Connect</div>
    </div>
  </div>
</div>`.trim();
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function LetterEditorModal({ letter, onClose, onSaved }: LetterEditorModalProps) {
    const [sections, setSections] = useState<LetterSections>(() => parseSections(letter.content || ''));
    const [activeTab, setActiveTab] = useState<SectionKey>('intro');
    const [saving, setSaving] = useState(false);
    const [savedOk, setSavedOk] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [hasUnsaved, setHasUnsaved] = useState(false);
    const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

    // Extract candidate info from letter for preview
    const candidateName = letter.company_name; // Will be extracted from the HTML if available
    const companyName = letter.company_name;
    const targetRole = letter.job_title || 'Cover Letter';

    // Try extracting candidate name from existing letter_html
    const extractedName = useMemo(() => {
        if (!letter.letter_html) return '';
        const match = letter.letter_html.match(/font-weight:900;color:white;[^"]*">(.*?)<\/div>/);
        return match ? match[1] : '';
    }, [letter.letter_html]);

    // Track unsaved changes
    const originalContent = useMemo(() => letter.content || '', [letter.content]);
    useEffect(() => {
        const current = sectionsToContent(sections);
        setHasUnsaved(current !== originalContent);
    }, [sections, originalContent]);

    // Prevent accidental close
    const handleClose = useCallback(() => {
        if (hasUnsaved && !confirm('You have unsaved changes. Are you sure you want to close?')) return;
        onClose();
    }, [hasUnsaved, onClose]);

    // Keyboard shortcut: Ctrl/Cmd + S
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                if (hasUnsaved && !saving) handleSave();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    });

    const updateSection = (key: SectionKey, value: string) => {
        setSections(prev => ({ ...prev, [key]: value }));
    };

    // Build the preview HTML
    const previewHtml = useMemo(
        () => buildPreviewHtml(sections, companyName, targetRole, extractedName),
        [sections, companyName, targetRole, extractedName]
    );

    // Build the server-compatible letter_html (same format as the original)
    const buildServerHtml = (): string => {
        // We use the same buildPreviewHtml approach server uses
        return previewHtml;
    };

    const handleSave = async () => {
        if (saving) return;
        setSaving(true);
        try {
            const content = sectionsToContent(sections);
            const html = buildServerHtml();
            const res = await fetch(`/api/motivation-letters/${letter.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, letter_html: html }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Save failed');
            }
            const updated = await res.json();
            setSavedOk(true);
            setHasUnsaved(false);
            setTimeout(() => setSavedOk(false), 3000);
            toast.success('Letter saved!');
            onSaved(updated);
        } catch (err: any) {
            toast.error(err.message || 'Failed to save letter.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAndRegeneratePdf = async () => {
        setSaving(true);
        try {
            const content = sectionsToContent(sections);
            const html = buildServerHtml();
            const res = await fetch(`/api/motivation-letters/${letter.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, letter_html: html }),
            });
            if (!res.ok) throw new Error('Save failed');
            const updated = await res.json();
            setHasUnsaved(false);
            onSaved(updated);
        } catch (err: any) {
            toast.error(err.message || 'Failed to save.');
            setSaving(false);
            return;
        }
        setSaving(false);

        setRegenerating(true);
        try {
            const res = await fetch(`/api/motivation-letters/${letter.id}/regenerate-pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            if (!res.ok) {
                const data = await res.json();
                if (data.error === 'upgrade_required') {
                    toast.error('PDF regeneration requires a Pro subscription.');
                } else {
                    throw new Error(data.error || 'PDF regeneration failed');
                }
            } else {
                const updated = await res.json();
                toast.success('PDF regenerated successfully!');
                onSaved(updated);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to regenerate PDF.');
        } finally {
            setRegenerating(false);
        }
    };

    const activeMeta = SECTION_TABS.find(t => t.id === activeTab)!;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-zinc-950" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── Top Header (mirrors CV Builder) ──────────────────── */}
            <header className="h-auto min-h-[48px] py-2 shrink-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-white/10 flex flex-wrap items-center px-3 gap-2 z-10">
                <button
                    onClick={handleClose}
                    className="flex items-center gap-1.5 text-sm font-semibold text-foreground/60 dark:text-zinc-400 hover:text-foreground dark:hover:text-white transition-colors shrink-0"
                >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Back to Letters</span>
                </button>

                <div className="flex-1 flex flex-wrap items-center justify-center sm:justify-start lg:justify-center gap-2 min-w-[120px]">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground dark:text-white text-sm truncate max-w-[200px]">
                            🏢 {companyName}
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-[150px]">
                            {targetRole}
                        </span>
                    </div>
                </div>

                {/* Mobile: Edit/Preview toggle */}
                <div className="md:hidden flex items-center gap-1 bg-zinc-100 dark:bg-white/5 rounded-lg p-0.5">
                    <button
                        onClick={() => setMobileView('edit')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${mobileView === 'edit' ? 'bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setMobileView('preview')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${mobileView === 'preview' ? 'bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}
                    >
                        Preview
                    </button>
                </div>

                {/* Save button */}
                <button
                    onClick={handleSave}
                    disabled={saving || !hasUnsaved}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm transition-all shrink-0
                    ${hasUnsaved && !saving
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95'
                            : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-zinc-500 cursor-default'
                        }`}
                >
                    {saving
                        ? <><Loader2 className="w-4 h-4 animate-spin" /><span className="hidden sm:inline"> Saving...</span></>
                        : savedOk
                            ? <><Check className="w-4 h-4" /><span className="hidden sm:inline"> Saved!</span></>
                            : <><Save className="w-4 h-4" /><span className="hidden sm:inline"> Save</span></>
                    }
                </button>

                <button
                    onClick={handleClose}
                    className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </header>

            {/* ── Body ───────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── Desktop: Narrow icon sidebar (mirrors CV Builder) */}
                <aside className="hidden md:flex w-[88px] shrink-0 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-white/10 flex-col items-center py-4 gap-2">
                    {SECTION_TABS.map(({ id, Icon, label }) => {
                        const active = activeTab === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                title={label}
                                className={`w-[72px] h-[72px] flex flex-col items-center justify-center rounded-2xl gap-1 transition-all text-[11px] font-bold leading-tight
                                ${active
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
                                {label}
                            </button>
                        );
                    })}
                </aside>

                {/* ── Section editor panel ──────────────────────────── */}
                <aside className={`${mobileView === 'edit' ? 'flex' : 'hidden'} md:flex w-full md:w-[420px] shrink-0 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-white/10 flex-col overflow-hidden`}>
                    {/* Panel header */}
                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 dark:border-white/5 shrink-0">
                        <h2 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                            <Pencil className="w-4 h-4 text-blue-500" />
                            {activeMeta.title}
                        </h2>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{activeMeta.subtitle}</p>
                    </div>

                    {/* Textarea for the active section */}
                    <div className="flex-1 overflow-hidden p-4">
                        <textarea
                            key={activeTab}
                            value={sections[activeTab]}
                            onChange={e => updateSection(activeTab, e.target.value)}
                            className="w-full h-full resize-none rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-4 text-sm leading-relaxed font-[inherit] focus:outline-none focus:ring-2 focus:ring-blue-400/40 dark:focus:ring-blue-500/40 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                            placeholder={`Write your ${activeMeta.title.toLowerCase()} section here...`}
                            spellCheck
                        />
                    </div>

                    {/* Bottom actions */}
                    <div className="p-4 border-t border-gray-100 dark:border-white/5 shrink-0 space-y-2">
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasUnsaved}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
                            ${hasUnsaved && !saving
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-zinc-500 cursor-default'
                                }`}
                        >
                            {saving
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                : savedOk
                                    ? <><Check className="w-4 h-4" /> Saved!</>
                                    : <><Save className="w-4 h-4" /> Save Changes</>
                            }
                        </button>
                        <button
                            onClick={handleSaveAndRegeneratePdf}
                            disabled={saving || regenerating}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
                        >
                            {regenerating
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Regenerating...</>
                                : <><RefreshCw className="w-4 h-4" /> Save & Regenerate PDF</>
                            }
                        </button>
                    </div>
                </aside>

                {/* ── Live Preview (presentation format) ────────────── */}
                <main className={`${mobileView === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 flex-col overflow-hidden bg-zinc-950/5 dark:bg-zinc-950 relative`}>
                    {/* BG texture */}
                    <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_80%_at_50%_10%,rgba(0,0,0,0.02),transparent)] dark:[background:radial-gradient(80%_80%_at_50%_10%,rgba(255,255,255,0.02),transparent)]" />

                    {/* Preview header bar */}
                    <div className="flex items-center justify-between px-4 md:px-6 py-2.5 border-b border-border/20 dark:border-white/5 shrink-0 relative z-10 shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                        <span className="text-foreground/80 text-xs font-semibold tracking-wide flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Preview
                        </span>
                        {hasUnsaved && (
                            <span className="flex items-center gap-1.5 text-amber-500 text-[11px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                Unsaved
                            </span>
                        )}
                    </div>

                    {/* Presentation preview */}
                    <div className="flex-1 overflow-auto flex items-start justify-center py-6 px-4">
                        <div
                            className="w-full max-w-[760px] shrink-0"
                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                    </div>
                </main>
            </div>

            {/* ── Mobile: Bottom Tab Bar ─────────────────────────── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-white/10 flex items-center justify-around px-1 py-1 safe-area-bottom shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
                {SECTION_TABS.map(({ id, Icon, label }) => {
                    const active = activeTab === id && mobileView === 'edit';
                    return (
                        <button
                            key={id}
                            onClick={() => { setActiveTab(id); setMobileView('edit'); }}
                            className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-xl transition-all min-w-0 flex-1 ${active
                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'text-gray-400 dark:text-zinc-500'
                                }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" strokeWidth={active ? 2.5 : 1.75} />
                            <span className="text-[9px] font-semibold leading-none truncate">{label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Padding for bottom tab bar on mobile */}
            <div className="md:hidden h-[60px] shrink-0" />
        </div>
    );
}
