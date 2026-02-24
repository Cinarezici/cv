import React, { useState } from 'react';
import { X, Sparkles, Loader2, Copy, Check, FileText } from 'lucide-react';
import { Job } from './JobCard';

interface AIApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job | null;
}

export function AIApplicationModal({ isOpen, onClose, job }: AIApplicationModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [letter, setLetter] = useState('');
    const [copied, setCopied] = useState(false);

    if (!isOpen || !job) return null;

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            // In a real app, we'd fetch the default profileId from a store
            // For now, using a placeholder or assuming the backend finds the top profile
            const response = await fetch('/api/jobs/generate-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job,
                    profileId: 'default' // Backend should handle finding a default if not provided
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to generate letter');
            setLetter(data.letter);
        } catch (error: any) {
            console.error(error);
            alert(`Generation failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(letter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 leading-tight">AI application Assistant</h2>
                            <p className="text-zinc-500 text-xs font-medium">Tailoring for {job.companyName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Job Summary */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white border border-indigo-100 flex items-center justify-center shrink-0">
                            {job.companyLogo ? (
                                <img src={job.companyLogo} alt="" className="w-full h-full object-contain p-2" />
                            ) : (
                                <FileText className="w-6 h-6 text-indigo-400" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900">{job.title}</h3>
                            <p className="text-zinc-500 text-sm font-medium">{job.location} • {job.companyName}</p>
                        </div>
                    </div>

                    {!letter ? (
                        <div className="text-center py-12 space-y-6">
                            <div className="max-w-xs mx-auto">
                                <h4 className="text-lg font-bold text-zinc-900">Generate your tailored letter</h4>
                                <p className="text-zinc-500 text-sm mt-2">
                                    Our AI will analyze your profile and this job description to write a perfectly matched motivation letter.
                                </p>
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-indigo-300"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Analyzing & Writing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Generate with AI</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Letter Preview</span>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            <span>Copy Text</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 font-serif text-zinc-800 leading-relaxed min-h-[300px] whitespace-pre-wrap selection:bg-indigo-100 selection:text-indigo-900">
                                {letter}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-zinc-500 hover:bg-zinc-200 transition-colors">
                        Close
                    </button>
                    {letter && (
                        <button
                            onClick={() => {
                                setLetter('');
                                handleGenerate();
                            }}
                            className="px-6 py-2.5 rounded-xl font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-all active:scale-95"
                        >
                            Regenerate
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
