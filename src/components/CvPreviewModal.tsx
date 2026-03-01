'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Loader2, ExternalLink } from 'lucide-react';

interface CvPreviewModalProps {
    resumeId: string;
    title?: string;
}

export function CvPreviewModal({ resumeId, title }: CvPreviewModalProps) {
    const [open, setOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const previewUrl = `/cv-preview/${resumeId}`;

    const handleOpen = () => {
        setLoaded(false);
        setOpen(true);
    };

    return (
        <>
            {/* Preview trigger button — same style as My Letters */}
            <button
                onClick={handleOpen}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors border shadow-sm
                    text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300
                    bg-violet-50 dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/10
                    border-violet-200 dark:border-violet-500/30"
                title="Preview CV"
            >
                <Eye className="w-3.5 h-3.5" />
                Preview
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 dark:border-white/10 p-0 gap-0">
                    <DialogHeader className="px-6 py-4 border-b border-zinc-200 dark:border-white/10 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="flex items-center gap-2 text-base font-extrabold dark:text-white">
                                <Eye className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                {title ? `${title} — Preview` : 'CV Preview'}
                            </DialogTitle>
                            <a
                                href={`/builder/${resumeId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg
                                    text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10
                                    border border-indigo-200 dark:border-indigo-500/30 transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Open Builder
                            </a>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden bg-zinc-100 dark:bg-zinc-950 relative min-h-[500px]">
                        {/* Loading state */}
                        {!loaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 z-10">
                                <div className="flex flex-col items-center gap-3 text-zinc-400">
                                    <Loader2 className="w-7 h-7 animate-spin" />
                                    <p className="text-sm font-medium">Loading CV preview…</p>
                                </div>
                            </div>
                        )}
                        <iframe
                            src={open ? previewUrl : undefined}
                            onLoad={() => setLoaded(true)}
                            className="w-full h-full border-none"
                            style={{ minHeight: '560px' }}
                            title="CV Preview"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
