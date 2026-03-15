"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
    ScanLine, Upload, FileText, Loader2, ChevronDown, ChevronUp,
    AlertTriangle, AlertCircle, CheckCircle2, ArrowRight, Download, Copy,
    Sparkles, Target, BookOpen, PenTool, LayoutList, BarChart3,
    CheckCheck, XCircle, Zap, ShieldCheck, Send, Clock, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/* ════════════════════════════════════════════════════════════════════════
   Types
   ════════════════════════════════════════════════════════════════════════ */
interface Issue {
    id: string; title: string; description: string; fix: string;
    priority: "high" | "medium" | "low"; category: string;
}
interface CategoryScore { score: number; max: number; summary: string; issues: Issue[]; }
interface MissingKeyword { keyword: string; importance: "critical" | "important" | "nice-to-have"; }
interface ATSResult {
    overall_score: number; optimization_ready: boolean;
    best_practices_compliant: boolean; application_ready: boolean;
    categories: {
        formatting: CategoryScore; keywords: CategoryScore;
        experience_quality: CategoryScore; content_language: CategoryScore;
        section_completeness: CategoryScore;
    };
    all_issues: Issue[]; strengths: string[]; missing_keywords: MissingKeyword[];
}
interface RecentScan {
    id: string; file_name: string; overall_score: number;
    result: ATSResult; cv_text: string; improved_cv: string | null;
    structured_cv: any | null; job_description: string | null;
    optimized_score?: number | null; created_at: string;
}

/* ════════════════════════════════════════════════════════════════════════
   Helpers
   ════════════════════════════════════════════════════════════════════════ */
function scoreColor(score: number) {
    if (score >= 90) return { ring: "#06b6d4", bg: "bg-cyan-50 dark:bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", label: "Excellent" };
    if (score >= 75) return { ring: "#22c55e", bg: "bg-green-50 dark:bg-green-500/10", text: "text-green-600 dark:text-green-400", label: "Strong" };
    if (score >= 50) return { ring: "#eab308", bg: "bg-yellow-50 dark:bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400", label: "Good" };
    return { ring: "#ef4444", bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400", label: "Needs Work" };
}
const CATEGORY_META: Record<string, { Icon: React.ElementType; label: string }> = {
    formatting: { Icon: LayoutList, label: "Formatting & Structure" },
    keywords: { Icon: Target, label: "Keyword Optimization" },
    experience_quality: { Icon: BarChart3, label: "Experience Quality" },
    content_language: { Icon: PenTool, label: "Content & Language" },
    section_completeness: { Icon: BookOpen, label: "Section Completeness" },
};
const PRIORITY_BADGE: Record<string, { cls: string; label: string }> = {
    high: { cls: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30", label: "HIGH IMPACT" },
    medium: { cls: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30", label: "MEDIUM IMPACT" },
    low: { cls: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30", label: "LOW IMPACT" },
};
const KEYWORD_BADGE: Record<string, string> = {
    "critical": "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30",
    "important": "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30",
    "nice-to-have": "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-600",
};

/* ════════════════════════════════════════════════════════════════════════
   Sub-components
   ════════════════════════════════════════════════════════════════════════ */
function ScoreGauge({ score }: { score: number }) {
    const sc = scoreColor(score);
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth="10" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke={sc.ring} strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-zinc-900 dark:text-white leading-none">{score}</span>
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">/ 100</span>
                </div>
            </div>
            <span className={`text-sm font-bold px-4 py-1 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>{sc.label}</span>
        </div>
    );
}

function MetaBadge({ icon: Icon, label, active }: { icon: React.ElementType; label: string; active: boolean }) {
    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm transition-colors
            ${active ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400"
                : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400"}`}>
            {active ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
            {label}
        </div>
    );
}

function CategoryCard({ catKey, cat }: { catKey: string; cat: CategoryScore }) {
    const meta = CATEGORY_META[catKey] || { Icon: FileText, label: catKey };
    const pct = (cat.score / cat.max) * 100;
    const sc = scoreColor(pct);
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${sc.bg}`}>
                    <meta.Icon className={`w-4 h-4 ${sc.text}`} />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex-1 truncate">{meta.label}</h3>
                <span className={`text-sm font-black ${sc.text}`}>{cat.score}/{cat.max}</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: sc.ring, transition: "width 0.8s ease-out" }} />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{cat.summary}</p>
        </div>
    );
}

function IssueItem({ issue }: { issue: Issue }) {
    const [open, setOpen] = useState(false);
    const badge = PRIORITY_BADGE[issue.priority] || PRIORITY_BADGE.low;
    const PrioIcon = issue.priority === "high" ? AlertTriangle : issue.priority === "medium" ? AlertCircle : CheckCircle2;
    const iconClass = issue.priority === "high" ? "text-red-500" : issue.priority === "medium" ? "text-yellow-500" : "text-green-500";
    return (
        <div className="border border-zinc-200 dark:border-white/10 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                <PrioIcon className={`w-4 h-4 shrink-0 ${iconClass}`} />
                <div className="flex-1 min-w-0"><h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">{issue.title}</h4></div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 hidden sm:inline ${badge.cls}`}>{badge.label}</span>
                {open ? <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />}
            </button>
            {open && (
                <div className="px-4 pb-4 pt-1 border-t border-zinc-100 dark:border-white/5 space-y-2">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{issue.description}</p>
                    <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-lg px-3 py-2">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Suggested Fix</span>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-0.5">{issue.fix}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

/* Full score report rendered from atsResult */
function ScoreReport({
    atsResult, fileName, jobDescription, cvText, scanId,
    improvedCV, structuredCV, optimizedScore,
    onImprove, improving, error, onReset, onOpenBuilder,
}: {
    atsResult: ATSResult; fileName?: string; jobDescription?: string; cvText: string; scanId?: string;
    improvedCV?: string; structuredCV?: any; optimizedScore?: number | null;
    onImprove: () => void; improving: boolean; error?: string;
    onReset: () => void; onOpenBuilder: () => void;
}) {
    const highIssues = atsResult.all_issues?.filter(i => i.priority === "high") || [];
    const mediumIssues = atsResult.all_issues?.filter(i => i.priority === "medium") || [];
    const lowIssues = atsResult.all_issues?.filter(i => i.priority === "low") || [];
    const hasMissingKeywords = (atsResult.missing_keywords?.length ?? 0) > 0;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-10">
            {/* Gauge + Meta */}
            <div className="flex flex-col items-center gap-6">
                {/* Before/After score comparison when optimized */}
                {optimizedScore != null ? (
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Original</span>
                            <ScoreGauge score={atsResult.overall_score} />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <ArrowRight className="w-8 h-8 text-indigo-400" />
                            {optimizedScore > atsResult.overall_score && (
                                <span className="text-xs font-bold text-green-500">+{optimizedScore - atsResult.overall_score} pts</span>
                            )}
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Optimized</span>
                            <ScoreGauge score={optimizedScore} />
                        </div>
                    </div>
                ) : (
                    <ScoreGauge score={atsResult.overall_score} />
                )}
                <div className="flex flex-wrap justify-center gap-3">
                    <MetaBadge icon={Zap} label="Optimization Ready" active={!!atsResult.optimization_ready} />
                    <MetaBadge icon={ShieldCheck} label="Best Practices Compliant" active={!!atsResult.best_practices_compliant} />
                    <MetaBadge icon={Send} label="Application Ready" active={!!atsResult.application_ready} />
                </div>
            </div>
            {/* Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(atsResult.categories).map(([key, cat]) => (
                    <CategoryCard key={key} catKey={key} cat={cat} />
                ))}
            </div>
            {/* Strengths */}
            {(atsResult.strengths?.length ?? 0) > 0 && (
                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-2">
                        <CheckCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h2 className="text-base font-bold text-green-800 dark:text-green-300">What You're Doing Right</h2>
                    </div>
                    <ul className="space-y-2">
                        {atsResult.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-green-700 dark:text-green-400">
                                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-500" /><span>{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Keyword Gap */}
            {hasMissingKeywords && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-base font-bold text-zinc-900 dark:text-white">Keyword Gap Analysis</h2>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-2 py-0.5 rounded-full">JD-specific</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {atsResult.missing_keywords.map((kw, i) => (
                            <span key={i} className={`text-xs font-bold px-3 py-1.5 rounded-full ${KEYWORD_BADGE[kw.importance]}`}>
                                {kw.keyword}<span className="ml-1.5 opacity-70 text-[10px] uppercase">{kw.importance === "nice-to-have" ? "nice" : kw.importance}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}
            {/* Issues */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Detailed Issues</h2>
                {highIssues.length > 0 && (<div className="space-y-2">
                    <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> High Impact ({highIssues.length})</h3>
                    {highIssues.map(i => <IssueItem key={i.id} issue={i} />)}
                </div>)}
                {mediumIssues.length > 0 && (<div className="space-y-2">
                    <h3 className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5" /> Medium Impact ({mediumIssues.length})</h3>
                    {mediumIssues.map(i => <IssueItem key={i.id} issue={i} />)}
                </div>)}
                {lowIssues.length > 0 && (<div className="space-y-2">
                    <h3 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Low Impact ({lowIssues.length})</h3>
                    {lowIssues.map(i => <IssueItem key={i.id} issue={i} />)}
                </div>)}
                {atsResult.all_issues?.length === 0 && (<div className="text-center py-8 text-zinc-400 dark:text-zinc-500 text-sm">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" /><p className="font-bold">No issues found — your CV looks great!</p>
                </div>)}
            </div>
            {error && (<div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm font-medium">{error}</div>)}

            {/* Improved CV section (shown if already improved) */}
            {improvedCV && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">ATS-Optimized CV</h2>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed">{improvedCV}</pre>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button onClick={() => { const b = new Blob([improvedCV], { type: "text/plain" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "ATS-Optimized-CV.txt"; a.click(); URL.revokeObjectURL(u); }}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                            <Download className="w-4 h-4" /> Download as TXT
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(improvedCV); toast.success("Copied!"); }}
                            className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                            <Copy className="w-4 h-4" /> Copy to Clipboard
                        </button>
                        {structuredCV && (
                            <button onClick={onOpenBuilder}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all">
                                <ExternalLink className="w-4 h-4" /> Open in CV Builder
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Improve CTA (shown if not yet improved) */}
            {!improvedCV && (
                <div className="space-y-3">
                    <button onClick={onImprove} disabled={improving}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all active:scale-[0.98]">
                        {improving ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating optimized CV...</> : <><Sparkles className="w-5 h-5" /> Improve My CV with AI <ArrowRight className="w-4 h-4" /></>}
                    </button>
                    <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">Pro feature — rewrites your CV fixing all issues above</p>
                </div>
            )}
            <div className="text-center">
                <button onClick={onReset} className="text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">← Scan Another CV</button>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════════════════
   Main Page
   ════════════════════════════════════════════════════════════════════════ */
export default function ATSScannerPage() {
    const router = useRouter();
    const [step, setStep] = useState<"upload" | "scanning" | "report" | "improving">("upload");
    const [cvText, setCvText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
    const [improvedCV, setImprovedCV] = useState("");
    const [structuredCV, setStructuredCV] = useState<any>(null);
    const [optimizedScore, setOptimizedScore] = useState<number | null>(null);
    const [scanId, setScanId] = useState<string | undefined>();
    const [error, setError] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
    const [loadingRecent, setLoadingRecent] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch recent scans on mount
    useEffect(() => {
        fetch("/api/ai/ats-scans").then(r => r.json()).then(d => {
            setRecentScans(d.scans || []);
        }).catch(() => { }).finally(() => setLoadingRecent(false));
    }, []);

    const handleFileSelect = (f: File) => { setFileName(f.name); setFile(f); setCvText(""); setError(""); };
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setDragActive(false);
        const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f);
    }, []);
    const resetAll = () => {
        setStep("upload"); setAtsResult(null); setCvText(""); setFileName(""); setFile(null);
        setJobDescription(""); setError(""); setImprovedCV(""); setStructuredCV(null); setScanId(undefined); setOptimizedScore(null);
        // Refresh recent scans
        fetch("/api/ai/ats-scans").then(r => r.json()).then(d => setRecentScans(d.scans || [])).catch(() => { });
    };

    /* ── Scan ─────────────────────────────────────────────────────── */
    const handleScan = async () => {
        if (!cvText.trim() && !file) { setError("Please upload a file or paste your CV text first."); return; }
        setStep("scanning"); setError("");
        try {
            const formData = new FormData();
            if (file) formData.append("file", file);
            if (cvText.trim()) formData.append("cvText", cvText);
            if (jobDescription.trim()) formData.append("jobDescription", jobDescription);

            const res = await fetch("/api/ai/ats-scan", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) {
                if (data.code === 'ATS_BLOCKED') {
                    setError("ATS Scanner is not available on your plan. Please upgrade to Pro.");
                } else if (data.code === 'ATS_TRIAL_LIMIT') {
                    setError("You've used all trial ATS scans. Upgrade to Pro for 10 scans/week.");
                } else if (data.code === 'ATS_WEEKLY_LIMIT') {
                    setError("You've used all 10 weekly scans. Resets every Sunday.");
                } else {
                    throw new Error(data.error || "Scan failed");
                }
                setStep("upload"); return;
            }
            setAtsResult(data.result);
            if (data.cvText) setCvText(data.cvText);
            if (data.scanId) setScanId(data.scanId);
            setStep("report");
        } catch (err: any) { setError(err.message); setStep("upload"); }
    };

    /* ── Improve ──────────────────────────────────────────────────── */
    const handleImprove = async () => {
        setStep("improving"); setError("");
        try {
            const res = await fetch("/api/ai/ats-improve", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvText, atsResult, jobDescription, scanId }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.code === "PRO_REQUIRED") { toast.error("AI improvement is a Pro feature. Please upgrade."); }
                else { toast.error(data.error || "Improvement failed"); }
                setStep("report"); return;
            }
            setImprovedCV(data.improvedCV || "");
            setStructuredCV(data.structuredCV || null);
            setOptimizedScore(data.optimizedScore ?? null);
            setStep("report");
        } catch (err: any) { setError(err.message); setStep("report"); }
    };

    /* ── Open in CV Builder ───────────────────────────────────────── */
    const handleOpenBuilder = async () => {
        if (!structuredCV) return;
        try {
            // Normalize the structuredCV so the builder store populates correctly
            // Claude may return institution/title/school with different field names
            const normalized = {
                ...structuredCV,
                // Education: ensure `school` field (mapper uses school)
                education: (structuredCV.education || []).map((e: any) => ({
                    ...e,
                    school: e.school || e.institution || '',
                    degree: e.degree || e.title || '',
                    field: e.field || e.major || '',
                    start_date: e.start_date || e.startDate || '',
                    end_date: e.end_date || e.endDate || '',
                    id: e.id || Math.random().toString(36).slice(2),
                })),
                // Experience: ensure bullets array
                experience: (structuredCV.experience || []).map((e: any) => ({
                    ...e,
                    role: e.role || e.title || e.position || '',
                    bullets: Array.isArray(e.bullets) ? e.bullets : (e.description ? [e.description] : []),
                    id: e.id || Math.random().toString(36).slice(2),
                })),
                // Skills: normalize flat array to { core, tools }
                skills: structuredCV.skills && !Array.isArray(structuredCV.skills)
                    ? structuredCV.skills
                    : { core: Array.isArray(structuredCV.skills) ? structuredCV.skills : [], tools: [] },
                // Header: normalize common field variants
                header: {
                    ...structuredCV.header,
                    linkedin_url: structuredCV.header?.linkedin_url || structuredCV.header?.linkedin || '',
                    phone: structuredCV.header?.phone || structuredCV.header?.phone_number || '',
                },
            };

            const res = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    job_title: `ATS-Optimized — ${fileName || "CV"}`,
                    optimized_json: normalized,  // correct field name for /api/resumes
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Could not create CV");
            router.push(`/builder/${data.id}`);
        } catch (err: any) {
            toast.error(err.message || "Failed to open in CV Builder");
        }
    };

    /* ── Load from recent scan ────────────────────────────────────── */
    const handleLoadRecent = (scan: RecentScan) => {
        setAtsResult(scan.result);
        setCvText(scan.cv_text || "");
        setFileName(scan.file_name || "");
        setJobDescription(scan.job_description || "");
        setScanId(scan.id);
        setImprovedCV(scan.improved_cv || "");
        setStructuredCV(scan.structured_cv || null);
        setOptimizedScore(scan.optimized_score ?? null);
        setStep("report");
    };

    /* ════════════════════════════════════════════════════════════════
       RENDER: Upload Screen
       ════════════════════════════════════════════════════════════════ */
    if (step === "upload" || step === "scanning") {
        return (
            <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950">
                {/* Header */}
                <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/10 py-12 px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                            <ScanLine className="w-3.5 h-3.5" /> ATS Scanner
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                            Check your <span className="text-indigo-600 dark:text-indigo-400">ATS score</span>.
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto font-medium">
                            Upload your CV to instantly reveal how recruiting software sees it. Discover hidden flaws, analyze keyword gaps, and get AI-driven fixes to land more interviews.
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-6">
                    {/* Drop Zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
                            ${dragActive ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                                : fileName ? "border-green-400 bg-green-50 dark:bg-green-500/10"
                                    : "border-zinc-300 dark:border-white/20 bg-white dark:bg-zinc-900 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-white/5"}`}
                    >
                        <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} className="hidden" />
                        <div className="flex flex-col items-center gap-3">
                            {fileName ? (
                                <><div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center"><FileText className="w-7 h-7 text-green-600 dark:text-green-400" /></div>
                                    <p className="text-base font-bold text-zinc-900 dark:text-white">{fileName}</p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Click or drag to replace</p></>
                            ) : (
                                <><div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"><Upload className="w-7 h-7 text-indigo-500 dark:text-indigo-400" /></div>
                                    <p className="text-base font-bold text-zinc-900 dark:text-white">Drop your CV here, or click to browse</p>
                                    <p className="text-sm text-zinc-400 dark:text-zinc-500">PDF, DOCX, or TXT</p></>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Or paste your CV text</label>
                        <textarea value={cvText} onChange={e => { setCvText(e.target.value); setFile(null); setFileName(""); }} rows={6}
                            placeholder="Paste your full CV text here..."
                            className="w-full border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                            Job Description <span className="text-zinc-400 dark:text-zinc-600 normal-case font-medium">(optional — enables keyword gap analysis)</span>
                        </label>
                        <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={4}
                            placeholder="Paste the target job description to unlock keyword gap analysis..."
                            className="w-full border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y" />
                    </div>

                    {error && (<div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm font-medium">
                        {error}
                        {(error.includes("Upgrade") || error.includes("upgrade")) && (
                            <button onClick={() => router.push("/upgrade")} className="ml-2 underline font-bold">Upgrade to Pro →</button>
                        )}
                    </div>)}

                    <button onClick={handleScan} disabled={step === "scanning" || (!cvText.trim() && !file)}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]">
                        {step === "scanning" ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing your CV...</> : <><ScanLine className="w-5 h-5" /> Scan My CV</>}
                    </button>

                    {step === "scanning" && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center animate-pulse">
                                <ScanLine className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">AI is analyzing your CV for hidden flaws and keyword gaps...</p>
                            <div className="flex gap-1.5 mt-1">
                                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                            </div>
                        </div>
                    )}

                    {/* Recent Scans */}
                    {!loadingRecent && recentScans.length > 0 && (
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-zinc-400" />
                                <h2 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Recent Scans</h2>
                            </div>
                            <div className="space-y-2">
                                {recentScans.map(scan => {
                                    const sc = scoreColor(scan.overall_score);
                                    const scOpt = scan.optimized_score != null ? scoreColor(scan.optimized_score) : null;
                                    const date = new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                    const displaySc = scOpt || sc; // badge label uses optimized score if available
                                    return (
                                        <button key={scan.id} onClick={() => handleLoadRecent(scan)}
                                            className="w-full flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-sm transition-all text-left group">
                                            {/* Score(s) */}
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sc.bg}`}>
                                                    <span className={`text-lg font-black ${sc.text}`}>{scan.overall_score}</span>
                                                </div>
                                                {scan.optimized_score != null && scOpt && (
                                                    <>
                                                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scOpt.bg}`} style={{ outline: `2px solid ${scOpt.ring}`, outlineOffset: '2px' }}>
                                                            <span className={`text-lg font-black ${scOpt.text}`}>{scan.optimized_score}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{scan.file_name || 'Pasted Text'}</p>
                                                <p className="text-xs text-zinc-400 dark:text-zinc-500">{date}{scan.improved_cv ? ' · Optimized' : ''}</p>
                                            </div>
                                            <div className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${displaySc.bg} ${displaySc.text}`}>{displaySc.label}</div>
                                            <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-indigo-500 transition-colors shrink-0" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* ════════════════════════════════════════════════════════════════
       RENDER: Score Report
       ════════════════════════════════════════════════════════════════ */
    if ((step === "report" || step === "improving") && atsResult) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950">
                <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/10 py-10 px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                            <ScanLine className="w-3.5 h-3.5" /> ATS Analysis
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                            {fileName ? `Report: ${fileName}` : "Your ATS Score Report"}
                        </h1>
                    </div>
                </div>
                <ScoreReport
                    atsResult={atsResult}
                    fileName={fileName}
                    jobDescription={jobDescription}
                    cvText={cvText}
                    scanId={scanId}
                    improvedCV={improvedCV}
                    structuredCV={structuredCV}
                    optimizedScore={optimizedScore}
                    onImprove={handleImprove}
                    improving={step === "improving"}
                    error={error}
                    onReset={resetAll}
                    onOpenBuilder={handleOpenBuilder}
                />
            </div>
        );
    }

    return null;
}
