"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Sparkles } from 'lucide-react';

interface SharedLetterViewerProps {
    letter: any;
    isPro: boolean;
}

export default function LetterViewer({ letter, isPro }: SharedLetterViewerProps) {
    const NAVY = '#0f172a';
    const GOLD = '#e6a817';

    // Helper to render the HTML content (which is a set of slides)
    // The letter.letter_html already contains the styled slides

    return (
        <div className="min-h-screen bg-zinc-50 py-12 px-4 flex flex-col items-center">
            <div className="w-full max-w-4xl space-y-8">
                {/* Header / Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900">{letter.company_name}</h1>
                        <p className="text-zinc-500 font-medium">{letter.job_title}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {letter.pdf_url && (
                            <Button
                                onClick={() => window.open(letter.pdf_url, '_blank')}
                                className="bg-zinc-900 hover:bg-zinc-800 text-white gap-2"
                            >
                                <FileDown className="w-4 h-4" />
                                Download PDF
                            </Button>
                        )}
                        {!isPro && (
                            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold border border-indigo-100">
                                <Sparkles className="w-4 h-4" />
                                Created with CV Optimizer AI
                            </div>
                        )}
                    </div>
                </div>

                {/* Letter Content (Slides) */}
                <div
                    className="w-full"
                    dangerouslySetInnerHTML={{ __html: letter.letter_html }}
                />

                {/* Footer / Branding */}
                <div className="pt-12 pb-8 text-center">
                    <p className="text-zinc-400 text-sm font-medium">
                        Powered by <a href="https://cvoptimizerai.com" className="text-indigo-600 hover:underline">CV Optimizer AI</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
