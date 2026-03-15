"use client";

import React, { useState, useRef, useCallback } from "react";
import {
    ScanLine, Upload, FileText, Loader2, ChevronDown, ChevronUp,
    AlertTriangle, AlertCircle, CheckCircle2, ArrowRight, Download, Copy,
    Sparkles, Target, BookOpen, PenTool, LayoutList, BarChart3,
} from "lucide-react";
import { toast } from "sonner";

/* ═══════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════ */
interface Issue {
    id: string;
    title: string;
    description: string;
    fix: string;
    priority: "high" | "medium" | "low";
    category: string;
}

interface CategoryScore {
    score: number;
    max: number;
    summary: string;
    issues: Issue[];
}

interface ATSResult {
    overall_score: number;
    categories: {
        formatting: CategoryScore;
        keywords: CategoryScore;
        experience_quality: CategoryScore;
        content_language: CategoryScore;
        section_completeness: CategoryScore;
    };
    all_issues: Issue[];
}

/* ═══════════════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════════════
   Score Gauge (animated SVG arc)
   ═══════════════════════════════════════════════════════════════════════ */
function ScoreGauge({ score }: { score: number }) {
    const sc = scoreColor(score);
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor"
                        className="text-zinc-200 dark:text-zinc-800" strokeWidth="10" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke={sc.ring}
                        strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-zinc-900 dark:text-white">{score}</span>
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">/ 100</span>
                </div>
            </div>
            <span className={`text-sm font-bold px-4 py-1 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
                {sc.label}
            </span>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════
   Category Card
   ═══════════════════════════════════════════════════════════════════════ */
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
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white truncate">{meta.label}</h3>
                </div>
                <span className={`text-sm font-black ${sc.text}`}>{cat.score}/{cat.max}</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: sc.ring }} />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{cat.summary}</p>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════
   Issue Item (expandable)
   ═══════════════════════════════════════════════════════════════════════ */
function IssueItem({ issue }: { issue: Issue }) {
    const [open, setOpen] = useState(false);
    const badge = PRIORITY_BADGE[issue.priority] || PRIORITY_BADGE.low;
    const PrioIcon = issue.priority === "high" ? AlertTriangle : issue.priority === "medium" ? AlertCircle : CheckCircle2;

    return (
        <div className="border border-zinc-200 dark:border-white/10 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden transition-all">
            <button onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                <PrioIcon className={`w-4 h-4 shrink-0 ${issue.priority === 'high' ? 'text-red-500' : issue.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">{issue.title}</h4>
                </div>
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

/* ═══════════════════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════════════════ */
export default function ATSScannerPage() {
    const [step, setStep] = useState<"upload" | "scanning" | "report" | "improving" | "improved">("upload");
    const [cvText, setCvText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
    const [improvedCV, setImprovedCV] = useState("");
    const [error, setError] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── File handling ──────────────────────────────────────────── */
    const handleFileSelect = (f: File) => {
        setFileName(f.name);
        setFile(f);
        setCvText(""); // clear pasted text when file is selected
        setError("");
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFileSelect(f);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFileSelect(f);
    };

    /* ── Scan ───────────────────────────────────────────────────── */
    const handleScan = async () => {
        if (!cvText.trim() && !file) {
            setError("Please upload a file or paste your CV text first.");
            return;
        }
        setStep("scanning");
        setError("");
        try {
            const formData = new FormData();
            if (file) {
                formData.append("file", file);
            }
            if (cvText.trim()) {
                formData.append("cvText", cvText);
            }
            if (jobDescription.trim()) {
                formData.append("jobDescription", jobDescription);
            }

            const res = await fetch("/api/ai/ats-scan", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Scan failed");
            setAtsResult(data.result);
            // Save extracted text for the improve step
            if (data.cvText) setCvText(data.cvText);
            setStep("report");
        } catch (err: any) {
            setError(err.message);
            setStep("upload");
        }
    };

    /* ── Improve ────────────────────────────────────────────────── */
    const handleImprove = async () => {
        setStep("improving");
        setError("");
        try {
            const res = await fetch("/api/ai/ats-improve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvText, atsResult, jobDescription }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.code === "PRO_REQUIRED") {
                    toast.error("ATS CV Improvement is a Pro feature. Please upgrade.");
                    setStep("report");
                    return;
                }
                throw new Error(data.error || "Improvement failed");
            }
            setImprovedCV(data.improvedCV);
            setStep("improved");
        } catch (err: any) {
            setError(err.message);
            setStep("report");
        }
    };

    /* ── Download improved CV ──────────────────────────────────── */
    const handleDownload = () => {
        const blob = new Blob([improvedCV], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ATS-Optimized-CV.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(improvedCV);
        toast.success("Copied to clipboard!");
    };

    const resetAll = () => {
        setStep("upload"); setAtsResult(null); setCvText(""); setFileName(""); setFile(null); setJobDescription(""); setError(""); setImprovedCV("");
    };

    /* ═══════════════════════════════════════════════════════════════
       STEP 1: Upload & Scan
       ═══════════════════════════════════════════════════════════════ */
    if (step === "upload" || step === "scanning") {
        return (
            <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950">
                {/* Header */}
                <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/10 py-12 px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                            <ScanLine className="w-3.5 h-3.5" />
                            ATS Scanner
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                            Check your <span className="text-indigo-600 dark:text-indigo-400">ATS score</span>.
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto font-medium">
                            Upload your CV and let AI analyze it against 23 ATS checkpoints. Get a detailed score and actionable fixes.
                        </p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-6">
                    {/* Drag & Drop Zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
                            ${dragActive
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                                : fileName
                                    ? "border-green-400 bg-green-50 dark:bg-green-500/10"
                                    : "border-zinc-300 dark:border-white/20 bg-white dark:bg-zinc-900 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-white/5"
                            }`}
                    >
                        <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileChange} className="hidden" />
                        <div className="flex flex-col items-center gap-3">
                            {fileName ? (
                                <>
                                    <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                                        <FileText className="w-7 h-7 text-green-600 dark:text-green-400" />
                                    </div>
                                    <p className="text-base font-bold text-zinc-900 dark:text-white">{fileName}</p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Click or drag to replace</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                        <Upload className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                                    </div>
                                    <p className="text-base font-bold text-zinc-900 dark:text-white">Drop your CV here, or click to browse</p>
                                    <p className="text-sm text-zinc-400 dark:text-zinc-500">PDF, DOCX, or TXT — max 5MB</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Or paste text */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                            Or paste your CV text
                        </label>
                        <textarea
                            value={cvText}
                            onChange={(e) => { setCvText(e.target.value); setFile(null); setFileName(""); }}
                            rows={6}
                            placeholder="Paste your full CV text here..."
                            className="w-full border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                        />
                    </div>

                    {/* Job Description (optional) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                            Job Description <span className="text-zinc-400 dark:text-zinc-600 normal-case font-medium">(optional — for keyword matching)</span>
                        </label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={4}
                            placeholder="Paste the target job description for better keyword analysis..."
                            className="w-full border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Scan Button */}
                    <button
                        onClick={handleScan}
                        disabled={step === "scanning" || (!cvText.trim() && !file)}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                    >
                        {step === "scanning" ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing your CV...
                            </>
                        ) : (
                            <>
                                <ScanLine className="w-5 h-5" />
                                Scan My CV
                            </>
                        )}
                    </button>

                    {step === "scanning" && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center animate-pulse">
                                <ScanLine className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">AI is evaluating 23 ATS checkpoints...</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* ═══════════════════════════════════════════════════════════════
       STEP 2: Score Report
       ═══════════════════════════════════════════════════════════════ */
    if ((step === "report" || step === "improving") && atsResult) {
        const highIssues = atsResult.all_issues.filter(i => i.priority === "high");
        const mediumIssues = atsResult.all_issues.filter(i => i.priority === "medium");
        const lowIssues = atsResult.all_issues.filter(i => i.priority === "low");

        return (
            <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950">
                {/* Header */}
                <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/10 py-10 px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                            <ScanLine className="w-3.5 h-3.5" />
                            ATS Analysis Complete
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                            Your ATS Score Report
                        </h1>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-10">
                    {/* Score Gauge */}
                    <div className="flex justify-center">
                        <ScoreGauge score={atsResult.overall_score} />
                    </div>

                    {/* Category Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(atsResult.categories).map(([key, cat]) => (
                            <CategoryCard key={key} catKey={key} cat={cat} />
                        ))}
                    </div>

                    {/* Issues List */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Detailed Issues</h2>

                        {highIssues.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle className="w-3.5 h-3.5" /> High Impact ({highIssues.length})
                                </h3>
                                {highIssues.map(i => <IssueItem key={i.id} issue={i} />)}
                            </div>
                        )}

                        {mediumIssues.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5" /> Medium Impact ({mediumIssues.length})
                                </h3>
                                {mediumIssues.map(i => <IssueItem key={i.id} issue={i} />)}
                            </div>
                        )}

                        {lowIssues.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Low Impact ({lowIssues.length})
                                </h3>
                                {lowIssues.map(i => <IssueItem key={i.id} issue={i} />)}
                            </div>
                        )}

                        {atsResult.all_issues.length === 0 && (
                            <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 text-sm">
                                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                                <p className="font-bold">No issues found — your CV looks great!</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Improve CTA */}
                    <button
                        onClick={handleImprove}
                        disabled={step === "improving"}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all active:scale-[0.98]"
                    >
                        {step === "improving" ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating your ATS-optimized CV...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Improve My CV with AI
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    {/* Scan Again */}
                    <div className="text-center">
                        <button onClick={resetAll}
                            className="text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            ← Scan Another CV
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ═══════════════════════════════════════════════════════════════
       STEP 3: Improved CV View
       ═══════════════════════════════════════════════════════════════ */
    if (step === "improved") {
        return (
            <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950">
                <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-white/10 py-10 px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest border border-green-100 dark:border-green-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Optimization Complete
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                            Your ATS-Optimized CV
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                            All issues have been addressed. Review your improved CV below.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-6">
                    {/* Improved CV Display */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm">
                        <pre className="whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed">
                            {improvedCV}
                        </pre>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download as TXT
                        </button>
                        <button
                            onClick={handleCopy}
                            className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                            Copy to Clipboard
                        </button>
                    </div>

                    {/* Back */}
                    <div className="text-center pt-4">
                        <button onClick={resetAll}
                            className="text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            ← Scan Another CV
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
