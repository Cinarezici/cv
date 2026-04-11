'use client';

import { useState, useCallback, useEffect } from 'react';
import { MotivationLetter } from '@/types/motivation-letter';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, Save, Check, Loader2, X, Sparkles, Download, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

interface LetterEditorModalProps {
    letter: MotivationLetter;
    onClose: () => void;
    onSaved: (updated: MotivationLetter) => void;
}

/**
 * Convert plain-text letter content into presentable HTML.
 * Preserves paragraph structure and basic formatting.
 */
function textToHtml(text: string): string {
    if (!text) return '';
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    const paragraphs = escaped.split(/\n\s*\n/);
    return paragraphs
        .map(p => {
            const lines = p.split('\n').join('<br/>');
            return `<p>${lines}</p>`;
        })
        .join('\n');
}

export default function LetterEditorModal({ letter, onClose, onSaved }: LetterEditorModalProps) {
    const [content, setContent] = useState(letter.content || '');
    const [saving, setSaving] = useState(false);
    const [savedOk, setSavedOk] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [hasUnsaved, setHasUnsaved] = useState(false);
    const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

    // Track unsaved changes
    useEffect(() => {
        setHasUnsaved(content !== (letter.content || ''));
    }, [content, letter.content]);

    // Prevent accidental close with unsaved changes
    const handleClose = useCallback(() => {
        if (hasUnsaved) {
            if (!confirm('You have unsaved changes. Are you sure you want to close?')) return;
        }
        onClose();
    }, [hasUnsaved, onClose]);

    // Keyboard shortcut: Ctrl/Cmd + S to save
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                if (hasUnsaved && !saving) handleSave();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [hasUnsaved, saving, content]);

    const handleSave = async () => {
        if (saving) return;
        setSaving(true);
        try {
            const html = textToHtml(content);
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
        // Save first
        setSaving(true);
        try {
            const html = textToHtml(content);
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
            setHasUnsaved(false);
            onSaved(updated);
        } catch (err: any) {
            toast.error(err.message || 'Failed to save before PDF regeneration.');
            setSaving(false);
            return;
        }
        setSaving(false);

        // Then regenerate PDF
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

    const previewHtml = textToHtml(content);

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── Header ───────────────────────────────────────────── */}
            <header className="h-auto min-h-[56px] py-2 shrink-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/10 flex flex-wrap items-center px-4 gap-3 z-10 shadow-sm">
                <button
                    onClick={handleClose}
                    className="flex items-center gap-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors shrink-0"
                >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Back to Letters</span>
                </button>

                <div className="flex-1 flex flex-wrap items-center justify-center gap-2 min-w-[120px]">
                    <div className="text-center max-w-[300px]">
                        <p className="font-bold text-zinc-900 dark:text-white text-sm truncate">
                            🏢 {letter.company_name}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                            {letter.job_title || 'Cover Letter'}
                        </p>
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
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm active:scale-95'
                            : 'bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 cursor-default'
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
                    className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </header>

            {/* ── Body ─────────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── Editor Panel ──────────────────────────────────── */}
                <aside className={`${mobileView === 'edit' ? 'flex' : 'hidden'} md:flex w-full md:w-1/2 flex-col overflow-hidden bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-white/10`}>
                    {/* Panel header */}
                    <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5 shrink-0">
                        <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            Edit Letter Content
                        </h2>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                            Modify your cover letter text below. Use Ctrl+S / ⌘+S to save.
                        </p>
                    </div>

                    {/* Textarea */}
                    <div className="flex-1 overflow-hidden p-4">
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="w-full h-full resize-none rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-4 text-sm leading-relaxed font-[inherit] focus:outline-none focus:ring-2 focus:ring-indigo-400/40 dark:focus:ring-indigo-500/40 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                            placeholder="Start writing your cover letter..."
                            spellCheck
                        />
                    </div>

                    {/* Bottom actions */}
                    <div className="p-4 border-t border-zinc-100 dark:border-white/5 shrink-0 flex flex-wrap gap-2">
                        <Button
                            onClick={handleSave}
                            disabled={saving || !hasUnsaved}
                            className={`flex-1 gap-2 font-bold text-sm rounded-xl transition-all ${hasUnsaved && !saving
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 cursor-default'
                                }`}
                        >
                            {saving
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                : savedOk
                                    ? <><Check className="w-4 h-4" /> Saved!</>
                                    : <><Save className="w-4 h-4" /> Save Changes</>
                            }
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleSaveAndRegeneratePdf}
                            disabled={saving || regenerating}
                            className="gap-2 font-semibold text-sm rounded-xl border-zinc-200 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
                        >
                            {regenerating
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Regenerating...</>
                                : <><RefreshCw className="w-4 h-4" /> Save & Regenerate PDF</>
                            }
                        </Button>
                    </div>
                </aside>

                {/* ── Preview Panel ─────────────────────────────────── */}
                <main className={`${mobileView === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950 relative`}>
                    {/* Subtle BG gradient */}
                    <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_80%_at_50%_10%,rgba(0,0,0,0.02),transparent)] dark:[background:radial-gradient(80%_80%_at_50%_10%,rgba(255,255,255,0.02),transparent)]" />

                    {/* Preview header */}
                    <div className="flex items-center justify-between px-6 py-2.5 border-b border-zinc-200/40 dark:border-white/5 shrink-0 relative z-10 shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                        <span className="text-zinc-600 dark:text-zinc-400 text-xs font-semibold tracking-wide flex items-center gap-2">
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

                    {/* Preview content — A4-like page */}
                    <div className="flex-1 overflow-auto flex items-start justify-center py-8 px-4">
                        <div className="w-full max-w-[700px] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-white/10 p-8 md:p-12">
                            {/* Letter header info */}
                            <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-white/5">
                                <p className="font-bold text-zinc-900 dark:text-white text-lg">
                                    {letter.company_name}
                                </p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {letter.job_title || 'Cover Letter'}
                                </p>
                            </div>

                            {/* Rendered HTML */}
                            {previewHtml ? (
                                <div
                                    className="prose prose-sm max-w-none dark:prose-invert
                                        prose-p:text-zinc-700 dark:prose-p:text-zinc-300
                                        prose-p:leading-relaxed prose-p:mb-3
                                        prose-headings:text-zinc-900 dark:prose-headings:text-white"
                                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                                />
                            ) : (
                                <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
                                    <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">Start typing to see a preview...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
