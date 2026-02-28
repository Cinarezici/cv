'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MotivationLetter } from '@/types/motivation-letter';
import { useLetterProgress } from '@/hooks/useLetterProgress';
import { Search, Plus, Eye, Download, Trash2, Share2, Sparkles, Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import LetterCreationWizard from './LetterCreationWizard';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Props {
    initialLetters: MotivationLetter[];
    isPro: boolean;
    userId: string;
}

function StatusBadge({ status, error, onClick }: { status: string; error?: string | null; onClick?: () => void }) {
    const configs: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        pending: { label: 'Pending', color: 'bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/10', icon: '⏸' },
        researching: { label: 'Researching', color: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20', icon: <Loader2 className="w-3 h-3 animate-spin inline" /> },
        generating: { label: 'Generating', color: 'bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20', icon: <Loader2 className="w-3 h-3 animate-spin inline" /> },
        creating_pdf: { label: 'PDF', color: 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20', icon: <Loader2 className="w-3 h-3 animate-spin inline" /> },
        completed: { label: 'Ready ✓', color: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20', icon: null },
        failed: { label: 'Error', color: 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20', icon: '⚠️' },
    };
    const c = configs[status] || configs.pending;
    return (
        <Badge
            className={`${c.color} border text-xs font-semibold flex items-center gap-1.5 cursor-${status === 'failed' && error ? 'pointer' : 'default'} select-none`}
            onClick={status === 'failed' && error ? onClick : undefined}
            title={status === 'failed' && error ? 'Click to view error details' : undefined}
        >
            {c.icon} {c.label}
        </Badge>
    );
}

function PresentationPreviewModal({ letter, onClose }: { letter: MotivationLetter; onClose: () => void }) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 dark:border-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-extrabold dark:text-white">
                        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        {letter.company_name} — Cover Letter
                    </DialogTitle>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{letter.job_title}</p>
                </DialogHeader>

                {letter.letter_html ? (
                    <div
                        className="mt-4 prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: letter.letter_html }}
                    />
                ) : (
                    <div className="text-center py-12 text-zinc-400 dark:text-zinc-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                        <p className="text-sm">Letter is still being generated...</p>
                    </div>
                )}

                {letter.pdf_url && (
                    <div className="pt-4 border-t border-zinc-200 dark:border-white/10 flex justify-end">
                        <Button
                            onClick={() => window.open(letter.pdf_url, '_blank')}
                            className="bg-indigo-600 hover:bg-indigo-700 font-semibold gap-2"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default function LetterDashboardClient({ initialLetters, isPro, userId }: Props) {
    const { letters, setLetters } = useLetterProgress(initialLetters);
    const [search, setSearch] = useState('');
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [previewLetter, setPreviewLetter] = useState<MotivationLetter | null>(null);
    const searchParams = useSearchParams();
    const [autoTriggered, setAutoTriggered] = useState(false);

    const [triggerJobData, setTriggerJobData] = useState<any>(null);

    useEffect(() => {
        const trigger = searchParams.get('trigger');
        if (trigger === 'true' && !autoTriggered) {
            const resumeId = searchParams.get('resumeId');
            const jobTitle = searchParams.get('jobTitle');
            const company = searchParams.get('company');
            const jd = searchParams.get('jd');

            if (resumeId) {
                setTriggerJobData({
                    id: 'temp-' + Date.now(),
                    title: jobTitle || 'Optimized Role',
                    companyName: company || 'Company',
                    descriptionText: jd || '',
                    resumeId: resumeId // This will need to be handled by the wizard to pre-select the CV
                });
                setIsWizardOpen(true);
                setAutoTriggered(true);
            }
        }
    }, [searchParams, autoTriggered]);

    // Group letters by batch_id
    const groupedLetters: MotivationLetter[][] = [];
    const batchMap = new Map<string, MotivationLetter[]>();

    letters.forEach(letter => {
        if (letter.batch_id) {
            if (!batchMap.has(letter.batch_id)) {
                batchMap.set(letter.batch_id, []);
                groupedLetters.push(batchMap.get(letter.batch_id)!);
            }
            batchMap.get(letter.batch_id)!.push(letter);
        } else {
            groupedLetters.push([letter]);
        }
    });

    const filteredGroups = groupedLetters.filter(group => {
        if (!search) return true;
        const s = search.toLowerCase();
        return group.some(l => l.company_name.toLowerCase().includes(s));
    });

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this cover letter?')) return;
        try {
            const res = await fetch(`/api/motivation-letters/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setLetters(prev => prev.filter(l => l.id !== id));
            toast.success('Cover letter deleted.');
        } catch {
            toast.error('Failed to delete cover letter.');
        }
    };

    const handleRetry = async (id: string) => {
        try {
            toast.info('Regenerating...');
            const res = await fetch(`/api/motivation-letters/${id}/retry`, { method: 'POST' });
            if (!res.ok) throw new Error('Retry failed');
            // optimistically reset status in local state — hook will poll
            setLetters(prev => prev.map(l => l.id === id ? { ...l, generation_status: 'pending', generation_error: undefined } : l));
        } catch {
            toast.error('Failed to retry.');
        }
    };

    const handleShare = async (letter: MotivationLetter) => {
        // Priority: Short share_url > fallback token > generate
        let shareUrl: string | null = null;

        if (letter.share_url) {
            shareUrl = letter.share_url;
        } else if (letter.share_token) {
            shareUrl = `${window.location.origin}/ml/share/${letter.share_token}`;
        } else {
            // No link yet — generate one via API
            try {
                toast.loading('Generating link...', { id: 'share-gen' });
                const res = await fetch(`/api/motivation-letters/${letter.id}/share`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_public: true }),
                });
                const data = await res.json();
                toast.dismiss('share-gen');
                if (!res.ok || !data.share_url) {
                    toast.error('Failed to generate link.');
                    return;
                }
                shareUrl = data.share_url;
                // Update local state so it shows correctly next time
                setLetters(prev => prev.map(l => l.id === letter.id
                    ? { ...l, share_token: data.share_url.split('/').pop()!, is_public: true }
                    : l
                ));
            } catch {
                toast.dismiss('share-gen');
                toast.error('Failed to generate link.');
                return;
            }
        }

        if (shareUrl) {
            try {
                await navigator.clipboard.writeText(shareUrl);
                toast.success('Link Copied', { description: 'The share link is now on your clipboard.' });
            } catch {
                toast.error('Failed to copy — browser permission may be required.');
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 py-8 pb-16 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                        My Letters
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
                        Personalized cover letters generated by GPT-4o.
                    </p>
                </div>
                <Button
                    onClick={() => setIsWizardOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 font-semibold gap-2 shrink-0 h-11"
                >
                    <Plus className="w-4 h-4" /> Create New Letter
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                <Input
                    placeholder="Search by company name..."
                    className="pl-9 bg-white dark:bg-transparent dark:text-white dark:border-white/20 dark:placeholder:text-zinc-500"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Letter List */}
            <div className="grid gap-3">
                {filteredGroups.length === 0 ? (
                    <div className="text-center p-16 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-white/20">
                        <div className="text-4xl mb-3">🎯</div>
                        <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-200">No letters yet</h3>
                        <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1 mb-4">
                            Click the "Create New Letter" button to create your first cover letter.
                        </p>
                        <Button onClick={() => setIsWizardOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                            <Plus className="w-4 h-4" /> Get Started
                        </Button>
                    </div>
                ) : (
                    filteredGroups.map(group => (
                        <BatchLetterCard
                            key={group[0].batch_id || group[0].id}
                            letters={group}
                            handleRetry={handleRetry}
                            setPreviewLetter={setPreviewLetter}
                            handleShare={handleShare}
                            handleDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            {/* Wizard */}
            {isWizardOpen && (
                <LetterCreationWizard
                    isPro={isPro}
                    userId={userId}
                    initialJobData={triggerJobData}
                    onClose={() => {
                        setIsWizardOpen(false);
                        setTriggerJobData(null);
                    }}
                    onSuccess={(newLetters) => {
                        setIsWizardOpen(false);
                        setTriggerJobData(null);
                        if (newLetters && newLetters.length > 0) {
                            setLetters(prev => [...newLetters, ...prev]);
                        }
                    }}
                />
            )}

            {/* Preview Modal */}
            {previewLetter && (
                <PresentationPreviewModal
                    letter={previewLetter}
                    onClose={() => setPreviewLetter(null)}
                />
            )}
        </div>
    );
}

// Sub-component to render either a single letter or a batch carousel
function BatchLetterCard({
    letters,
    handleRetry,
    setPreviewLetter,
    handleShare,
    handleDelete
}: {
    letters: MotivationLetter[];
    handleRetry: (id: string) => void;
    setPreviewLetter: (v: MotivationLetter) => void;
    handleShare: (v: MotivationLetter) => void;
    handleDelete: (id: string) => void;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fallback if index somehow diverges
    const letter = letters[currentIndex] || letters[0];

    const handlePrev = () => {
        setCurrentIndex(prev => (prev === 0 ? letters.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev === letters.length - 1 ? 0 : prev + 1));
    };

    if (!letter) return null;

    return (
        <Card className="overflow-hidden border border-zinc-200 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-white/5 transition-shadow bg-white dark:bg-zinc-900 animate-in fade-in duration-300 relative">
            <CardContent className="p-0 flex flex-col sm:flex-row items-stretch">
                {/* Left: colored accent bar */}
                <div className={`w-1.5 shrink-0 ${letter.generation_status === 'completed' ? 'bg-emerald-500' : letter.generation_status === 'failed' ? 'bg-rose-400' : 'bg-indigo-400 animate-pulse'}`} />

                {/* Main content */}
                <div className="flex-1 p-4 flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-3 min-w-[240px]">
                        {letters.length > 1 && (
                            <div className="flex gap-0.5 mr-1 bg-zinc-100/80 dark:bg-white/5 rounded-full p-0.5 border border-zinc-200 dark:border-white/10 shadow-sm">
                                <Button variant="ghost" size="icon" className="w-7 h-7 rounded-full hover:bg-white dark:hover:bg-white/10 shrink-0" onClick={handlePrev}>
                                    <ChevronLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                                </Button>
                                <Button variant="ghost" size="icon" className="w-7 h-7 rounded-full hover:bg-white dark:hover:bg-white/10 shrink-0" onClick={handleNext}>
                                    <ChevronRight className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                                </Button>
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-zinc-900 dark:text-white text-base leading-tight truncate max-w-[180px]" title={letter.company_name}>🏢 {letter.company_name}</p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 truncate max-w-[200px]" title={letter.job_title || ''}>{letter.job_title || '—'}</p>
                            {letters.length > 1 && (
                                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                                    {letters.length} Selected Jobs ({currentIndex + 1}/{letters.length})
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                        {format(new Date(letter.created_at), 'd MMM yyyy')}
                    </div>
                    <div className="ml-auto">
                        <StatusBadge
                            status={letter.generation_status}
                            error={letter.generation_error}
                            onClick={() => letter.generation_error && toast.error(letter.generation_error, { duration: 6000 })}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-t sm:border-t-0 sm:border-l border-zinc-100 dark:border-white/10 flex items-center gap-1.5 justify-end">
                    {letter.generation_status === 'failed' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRetry(letter.id)}
                            title="Retry"
                            className="gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 bg-white dark:bg-transparent"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Retry
                        </Button>
                    )}
                    {letter.generation_status === 'completed' && (
                        <>
                            {letter.letter_html && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPreviewLetter(letter)}
                                    title="Preview"
                                    className="gap-1.5 text-xs font-semibold bg-white dark:bg-transparent dark:text-zinc-300 dark:border-white/20 dark:hover:bg-white/5"
                                >
                                    <Eye className="w-3.5 h-3.5" /> View
                                </Button>
                            )}
                            {letter.pdf_url && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(letter.pdf_url, '_blank')}
                                    title="Download"
                                    className="gap-1.5 text-xs font-semibold bg-white dark:bg-transparent dark:text-zinc-300 dark:border-white/20 dark:hover:bg-white/5"
                                >
                                    <Download className="w-3.5 h-3.5" /> PDF
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleShare(letter)}
                                title="Copy sharing link"
                                className="gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20 hover:bg-violet-50 dark:hover:bg-violet-500/10 bg-white dark:bg-transparent"
                            >
                                <Share2 className="w-3.5 h-3.5" /> Copy Link
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        onClick={() => handleDelete(letter.id)}
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

