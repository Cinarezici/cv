"use client";

import React, { useState, useCallback } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function SummaryEditor() {
    const { resumeJson, updateResumeJson } = useResumeStore();
    const summary = resumeJson.summary || '';
    const [improving, setImproving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateResumeJson({ summary: e.target.value });
    };

    const handleImproveWithAI = useCallback(async () => {
        if (!summary.trim()) {
            toast.error('Write a summary first, then click Improve.');
            return;
        }
        setImproving(true);
        try {
            const res = await fetch('/api/ai/improve-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: summary, section: 'summary' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            updateResumeJson({ summary: data.improved });
            toast.success('Summary improved by AI!');
        } catch (err: any) {
            toast.error(err.message || 'AI improve failed');
        } finally {
            setImproving(false);
        }
    }, [summary, updateResumeJson]);

    const charCount = summary.length;
    const isOverLimit = charCount > 600;

    return (
        <div className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                        Professional Summary
                    </label>
                    <span className={`text-[11px] font-bold ${isOverLimit ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
                        {charCount} / 600
                    </span>
                </div>

                <textarea
                    value={summary}
                    onChange={handleChange}
                    rows={7}
                    className={`border rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[120px] ${isOverLimit ? 'border-red-400 focus:ring-red-500 dark:border-red-600' : 'border-zinc-200 dark:border-white/10'
                        }`}
                    placeholder="Briefly describe your background, key strengths, and what you are looking for..."
                />

                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                    Tip: 3–5 sentences. Who you are, what you do, your key achievement.
                </p>
            </div>

            {/* AI Improve button */}
            <button
                onClick={handleImproveWithAI}
                disabled={improving}
                className="flex items-center justify-center gap-2 w-full py-2.5 mt-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold text-sm rounded-xl border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {improving
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Improving...</>
                    : <><Sparkles className="w-4 h-4" /> Improve with AI</>
                }
            </button>
        </div>
    );
}
