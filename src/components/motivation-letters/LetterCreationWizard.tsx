'use client';

import { useState, useEffect } from 'react';
import { Job } from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Sparkles, ChevronRight, ChevronLeft, FileText, Building2, ChevronDown, Check } from 'lucide-react';
import { MotivationLetter } from '@/types/motivation-letter';

interface CompanyInput {
    url: string;
    name: string;
    jobDescription?: string;
}

interface JobConfig {
    targetRole: string;
    tone: 'corporate' | 'startup' | 'friendly_formal' | 'executive';
    language: 'en' | 'tr';
}

interface CvOption {
    id: string;
    title: string;
    type: 'profile' | 'resume';
}

function CvDropdown({
    cvs,
    selectedId,
    onSelect,
    loading,
}: {
    cvs: CvOption[];
    selectedId: string;
    onSelect: (id: string) => void;
    loading: boolean;
}) {
    const [open, setOpen] = useState(false);
    const selected = cvs.find(c => c.id === selectedId);

    // Each item is 44px tall. 4 items = 176px
    const ITEM_HEIGHT = 44;
    const VISIBLE_ITEMS = 4;

    return (
        <div className="w-full">
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                disabled={loading}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left bg-white ${open ? 'border-indigo-500 shadow-sm rounded-b-none border-b-transparent' : 'border-zinc-200 hover:border-zinc-300'
                    }`}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400 flex-shrink-0" />
                ) : (
                    <span className="text-lg flex-shrink-0">
                        {selected?.type === 'profile' ? '🔗' : '📄'}
                    </span>
                )}
                <span className="flex-1 min-w-0">
                    {loading ? (
                        <span className="text-sm text-zinc-400">Loading...</span>
                    ) : selected ? (
                        <>
                            <span className="block text-sm font-semibold text-zinc-900 truncate">{selected.title}</span>
                            <span className={`text-[11px] font-medium ${selected.type === 'profile' ? 'text-blue-600' : 'text-emerald-600'}`}>
                                {selected.type === 'profile' ? "My CV" : 'Optimized CV'}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm text-zinc-400">Select CV / Profile...</span>
                    )}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Inline scrollable panel */}
            {open && !loading && (
                <div
                    className="w-full mt-0 border-2 border-t-0 border-indigo-500 rounded-b-xl bg-white overflow-y-auto shadow-sm"
                    style={{ maxHeight: ITEM_HEIGHT * VISIBLE_ITEMS }}
                >
                    {cvs.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-zinc-400">No CV or profile yet.</p>
                    ) : (
                        <>
                            {cvs.some(c => c.type === 'profile') && (
                                <div>
                                    <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50">
                                        My CVs
                                    </div>
                                    {cvs.filter(c => c.type === 'profile').map(cv => (
                                        <DropdownItem
                                            key={cv.id}
                                            cv={cv}
                                            isSelected={selectedId === cv.id}
                                            onSelect={(id) => { onSelect(id); setOpen(false); }}
                                            itemHeight={ITEM_HEIGHT}
                                        />
                                    ))}
                                </div>
                            )}
                            {cvs.some(c => c.type === 'resume') && (
                                <div>
                                    <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 border-t border-zinc-100">
                                        Optimized CVs
                                    </div>
                                    {cvs.filter(c => c.type === 'resume').map(cv => (
                                        <DropdownItem
                                            key={cv.id}
                                            cv={cv}
                                            isSelected={selectedId === cv.id}
                                            onSelect={(id) => { onSelect(id); setOpen(false); }}
                                            itemHeight={ITEM_HEIGHT}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function DropdownItem({
    cv,
    isSelected,
    onSelect,
    itemHeight,
}: {
    cv: CvOption;
    isSelected: boolean;
    onSelect: (id: string) => void;
    itemHeight: number;
}) {
    return (
        <button
            type="button"
            onClick={() => onSelect(cv.id)}
            style={{ height: itemHeight }}
            className={`w-full flex items-center gap-3 px-4 text-left transition-colors ${isSelected ? 'bg-indigo-50' : 'hover:bg-zinc-50'
                }`}
        >
            <span className="text-base flex-shrink-0">{cv.type === 'profile' ? '🔗' : '📄'}</span>
            <span className="flex-1 min-w-0 text-sm font-medium text-zinc-900 truncate">{cv.title}</span>
            {isSelected && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
        </button>
    );
}


/* ─────────────────────────────────────────────
   Main Wizard
───────────────────────────────────────────── */
export default function LetterCreationWizard({
    isPro,
    userId,
    initialJobData,
    onClose,
    onSuccess
}: {
    isPro: boolean,
    userId: string,
    initialJobData?: Job | null,
    onClose: () => void,
    onSuccess: (newLetters: MotivationLetter[]) => void
}) {
    const [step, setStep] = useState<1 | 2>(1);
    const [cvs, setCvs] = useState<CvOption[]>([]);
    const [selectedCvId, setSelectedCvId] = useState('');
    const [companies, setCompanies] = useState<CompanyInput[]>([{
        url: initialJobData?.link || '',
        name: initialJobData?.companyName || '',
        jobDescription: initialJobData?.descriptionText || ''
    }]);
    const [configs, setConfigs] = useState<JobConfig[]>([{
        targetRole: initialJobData?.title || '',
        tone: 'startup',
        language: 'tr'
    }]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingCvs, setLoadingCvs] = useState(true);

    useEffect(() => {
        const fetchCVs = async () => {
            setLoadingCvs(true);
            try {
                const res = await fetch('/api/my-cvs');
                if (!res.ok) throw new Error('Failed to fetch CVs');
                const data = await res.json();
                const allCvs: CvOption[] = data.cvs || [];

                setCvs(allCvs);

                // Pre-select logic:
                // 1. If we have a resumeId from trigger flow, select it
                // 2. Otherwise select the first available CV
                const triggerId = (initialJobData as any)?.resumeId;
                if (triggerId && allCvs.some(c => c.id === triggerId)) {
                    setSelectedCvId(triggerId);
                    // Also if we have job context, move to step 2 automatically if fields are filled
                    // (Optional UX improvement: If we have all job info, maybe stay in step 1 to let user double check)
                } else if (allCvs.length > 0) {
                    setSelectedCvId(allCvs[0].id);
                }
            } finally {
                setLoadingCvs(false);
            }
        };
        fetchCVs();
    }, [userId]);

    const handleNextStep = () => {
        if (!selectedCvId) { toast.error('Please select a CV.'); return; }
        if (!companies[0].url) { toast.error("Please enter a company URL."); return; }
        const newComps = companies.map(c => {
            if (!c.name && c.url) {
                try {
                    const u = new URL(c.url.startsWith('http') ? c.url : `https://${c.url}`);
                    return { ...c, url: u.href, name: u.hostname.replace('www.', '').split('.')[0] };
                } catch { return c; }
            }
            return c;
        });
        setCompanies(newComps);
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!configs[0].targetRole) { toast.error('Please enter a target role.'); return; }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/motivation-letters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companies, cvId: selectedCvId, jobConfigs: configs })
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.error === 'upgrade_required') toast.error(data.message || 'Upgrade to Pro.');
                else if (data.error === 'limit_reached') toast.error(data.message || 'Limit reached. Please upgrade.');
                else throw new Error(data.error || 'Failed to create cover letter.');
            } else {
                toast.success('✨ Cover letter creation started! Redirecting...');
                const newLetters: MotivationLetter[] = Array.isArray(data.letters) ? data.letters : (data.letter ? [data.letter] : []);
                onSuccess(newLetters);
            }
        } catch (err: any) {
            toast.error(err.message || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateConfig = (field: keyof JobConfig, val: string) => {
        setConfigs(prev => [{ ...prev[0], [field]: val }]);
    };

    const toneOptions = [
        { value: 'startup', label: '🚀 Startup & Innovative', desc: 'Energetic, modern' },
        { value: 'corporate', label: '🏛️ Corporate', desc: 'Formal, reliable' },
        { value: 'friendly_formal', label: '🤝 Friendly', desc: 'Warm but professional' },
        { value: 'executive', label: '💎 Executive', desc: 'Leadership focused' },
    ];

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-white border shadow-xl overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        Create New Letter
                    </DialogTitle>
                    <p className="text-sm text-zinc-500 mt-0.5">
                        Enter the company URL, and AI will prepare a cover letter introducing you.
                    </p>
                </DialogHeader>

                {/* Step bar */}
                <div className="flex gap-2 mt-1 mb-4">
                    {[1, 2].map(s => (
                        <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${step >= s ? 'bg-indigo-600' : 'bg-zinc-200'}`} />
                    ))}
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        {/* CV Dropdown */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 mb-1.5">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                CV / Profil
                            </label>
                            <CvDropdown
                                cvs={cvs}
                                selectedId={selectedCvId}
                                onSelect={setSelectedCvId}
                                loading={loadingCvs}
                            />
                        </div>

                        {/* Company URL */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 mb-1.5">
                                <Building2 className="w-4 h-4 text-indigo-600" />
                                Company or Job URL
                            </label>
                            <Input
                                placeholder="https://example.com or linkedin.com/jobs/..."
                                value={companies[0].url}
                                onChange={e => setCompanies([{ ...companies[0], url: e.target.value }])}
                                className="h-11 text-sm rounded-xl border-zinc-200 focus-visible:ring-indigo-500"
                            />
                            <p className="text-xs text-zinc-400 mt-1">
                                Enter the company website or a LinkedIn job URL.
                            </p>
                        </div>

                        <div className="flex justify-end pt-1">
                            <Button
                                onClick={handleNextStep}
                                disabled={loadingCvs || cvs.length === 0}
                                className="bg-indigo-600 hover:bg-indigo-700 font-semibold gap-1.5 rounded-xl"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        {/* Target role */}
                        <div>
                            <label className="text-sm font-bold text-zinc-700 mb-1.5 block">Target Role</label>
                            <Input
                                placeholder="e.g. Senior Product Manager"
                                value={configs[0].targetRole}
                                onChange={e => updateConfig('targetRole', e.target.value)}
                                className="h-11 text-sm rounded-xl border-zinc-200 focus-visible:ring-indigo-500"
                            />
                        </div>

                        {/* Tone */}
                        <div>
                            <label className="text-sm font-bold text-zinc-700 mb-1.5 block">Letter Tone</label>
                            <div className="grid grid-cols-2 gap-2">
                                {toneOptions.map(t => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => updateConfig('tone', t.value)}
                                        className={`p-3 rounded-xl border-2 text-left transition-all ${configs[0].tone === t.value
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-zinc-200 hover:border-zinc-300'
                                            }`}
                                    >
                                        <p className="text-sm font-semibold text-zinc-900">{t.label}</p>
                                        <p className="text-[11px] text-zinc-400 mt-0.5">{t.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language */}
                        <div>
                            <label className="text-sm font-bold text-zinc-700 mb-1.5 block">Language</label>
                            <div className="flex gap-2">
                                {[{ val: 'tr', label: '🇹🇷 Turkish' }, { val: 'en', label: '🇬🇧 English' }].map(l => (
                                    <button
                                        key={l.val}
                                        type="button"
                                        onClick={() => updateConfig('language', l.val)}
                                        className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${configs[0].language === l.val
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                                            }`}
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Company info strip */}
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 flex items-center gap-2 text-sm">
                            <span className="text-base">🏢</span>
                            <span className="font-semibold text-zinc-700 truncate">{companies[0].name || companies[0].url}</span>
                        </div>

                        <div className="flex justify-between pt-1">
                            <Button variant="outline" onClick={() => setStep(1)} className="gap-1.5 font-semibold rounded-xl border-zinc-200">
                                <ChevronLeft className="w-4 h-4" /> Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-indigo-600 hover:bg-indigo-700 font-bold px-6 gap-2 rounded-xl"
                            >
                                {isSubmitting
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                                    : <><Sparkles className="w-4 h-4" /> Create Letter</>
                                }
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
