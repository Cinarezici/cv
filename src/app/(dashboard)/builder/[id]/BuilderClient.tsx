"use client";

/**
 * BuilderClient — Full-page CV Builder (cvmakerly-style)
 *
 * Layout:
 *   [Header: ← Dashboard | CV Builder FREE | unsaved/save status]
 *   [Narrow icon sidebar] | [Section panel] | [Dark bg → fixed A4 preview]
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, Save, Check, Loader2, X,
    User, AlignLeft, Briefcase, GraduationCap, Wrench, LayoutTemplate, List, Pencil,
} from "lucide-react";
import { toast } from "sonner";

import { useResumeStore } from "@/store/useResumeStore";
import { CVRenderer } from "@/components/resume/CVRenderer";
import { HeaderEditor } from "@/components/resume/editors/HeaderEditor";
import { SummaryEditor } from "@/components/resume/editors/SummaryEditor";
import { ExperienceEditor } from "@/components/resume/editors/ExperienceEditor";
import { EducationEditor } from "@/components/resume/editors/EducationEditor";
import { SkillsEditor } from "@/components/resume/editors/SkillsEditor";
import TemplatePanel from "./TemplatePanel";

// Drag-to-reorder
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { SectionKey } from "@/types";

type TabId = "template" | "header" | "summary" | "experience" | "education" | "skills" | "order";

const TABS: { id: TabId; Icon: React.FC<any>; label: string }[] = [
    { id: "template", Icon: LayoutTemplate, label: "Template" },
    { id: "header", Icon: User, label: "Personal" },
    { id: "summary", Icon: AlignLeft, label: "Summary" },
    { id: "experience", Icon: Briefcase, label: "Experience" },
    { id: "education", Icon: GraduationCap, label: "Education" },
    { id: "skills", Icon: Wrench, label: "Skills" },
    { id: "order", Icon: List, label: "Order" },
];

const SECTION_LABELS: Record<string, string> = {
    header: "Personal Information",
    summary: "Professional Summary",
    experience: "Work Experience",
    education: "Education History",
    skills: "Skills & Tools",
};

const PANEL_META: Record<TabId, { title: string; subtitle: string }> = {
    template: { title: "Template", subtitle: "Choose the best CV template for your style." },
    header: { title: "Personal Information", subtitle: "Enter your contact details and title." },
    summary: { title: "Summary", subtitle: "Write a brief and effective professional summary." },
    experience: { title: "Experience", subtitle: "Add your work history and achievements." },
    education: { title: "Education", subtitle: "List your education details." },
    skills: { title: "Skills", subtitle: "Add the languages, tools, and technologies you use." },
    order: { title: "Section Ordering", subtitle: "Drag and drop to reorder sections in your CV." },
};

// Sortable row for "Order" panel
function SortableRow({ id, label }: { id: string; label: string }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={`flex items-center gap-3 py-3 px-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10 select-none
        ${isDragging ? "opacity-50 shadow-lg" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
        >
            <div {...attributes} {...listeners} className="cursor-grab text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 touch-none">
                <GripVertical className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">{label}</span>
        </div>
    );
}

export default function BuilderClient({ data, avatarUrl, isPro }: { data: any; avatarUrl: string | null; isPro?: boolean }) {
    const router = useRouter();
    const {
        cvId, setCvData, title, setTitle,
        resumeJson, themeId, themeCategory, colorPaletteId,
        sectionOrder, hiddenSections,
        updateSectionOrder,
    } = useResumeStore();

    // Hydrate store
    useEffect(() => {
        if (data && data.id !== cvId) setCvData(data);
    }, [data, cvId, setCvData]);

    const [activeTab, setActiveTab] = useState<TabId>("template");
    const initialised = useRef(false);
    const [hasUnsaved, setHasUnsaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedOk, setSavedOk] = useState(false);

    // ── Inline title editing ─────────────────────────────────────────
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleDraft, setTitleDraft] = useState('');
    const titleInputRef = useRef<HTMLInputElement>(null);

    const startEditTitle = () => {
        setTitleDraft(title || 'Untitled CV');
        setEditingTitle(true);
        setTimeout(() => titleInputRef.current?.select(), 20);
    };
    const commitTitle = async () => {
        const newTitle = titleDraft.trim() || 'Untitled CV';
        setTitle(newTitle);
        setEditingTitle(false);
        if (cvId) {
            try {
                await fetch(`/api/resumes/${cvId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ job_title: newTitle }),
                });
            } catch {/* silent */ }
        }
    };
    const cancelTitle = () => {
        setEditingTitle(false);
    };

    // Zoom state (scale applied to the A4 preview, default fits in panel)
    const [zoom, setZoom] = useState(0.75); // 75% default — fits a 794px wide A4 in ~600px panel
    const A4_WIDTH = 794;
    const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
    const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.3));
    const handleZoomReset = () => setZoom(0.75);

    useEffect(() => {
        if (!initialised.current) { initialised.current = true; return; }
        setHasUnsaved(true);
        setSavedOk(false);
    }, [resumeJson, themeId, themeCategory, colorPaletteId, sectionOrder, hiddenSections]);

    const handleSave = useCallback(async () => {
        if (!cvId || saving) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/resumes/${cvId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    optimized_json: resumeJson,
                    theme_id: themeId,
                    theme_category: themeCategory,
                    color_palette_id: colorPaletteId,
                    section_order: sectionOrder,
                    hidden_sections: hiddenSections,
                }),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Save failed");
            setHasUnsaved(false);
            setSavedOk(true);
            setTimeout(() => setSavedOk(false), 3000);
            toast.success("CV Saved!");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    }, [cvId, saving, resumeJson, themeId, themeCategory, colorPaletteId, sectionOrder, hiddenSections]);

    // DnD for order panel
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );
    function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e;
        if (over && active.id !== over.id) {
            const oi = sectionOrder.indexOf(active.id as SectionKey);
            const ni = sectionOrder.indexOf(over.id as SectionKey);
            updateSectionOrder(arrayMove(sectionOrder, oi, ni));
        }
    }

    const renderPanel = () => {
        switch (activeTab) {
            case "template": return <TemplatePanel />;
            case "header": return <HeaderEditor />;
            case "summary": return <SummaryEditor />;
            case "experience": return <ExperienceEditor />;
            case "education": return <EducationEditor />;
            case "skills": return <SkillsEditor />;
            case "order":
                return (
                    <div className="space-y-3 p-4">
                        <p className="text-xs text-gray-400 dark:text-zinc-500">Drag and drop to reorder sections in your CV.</p>
                        <DndContext id="builder-order-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={sectionOrder.filter((k: string) => k in SECTION_LABELS)} strategy={verticalListSortingStrategy}>
                                <div className="flex flex-col gap-2">
                                    {sectionOrder
                                        .filter((k: string) => k in SECTION_LABELS)
                                        .map((k: string) => (
                                            <SortableRow key={k} id={k} label={SECTION_LABELS[k]} />
                                        ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                );
        }
    };

    const meta = PANEL_META[activeTab];

    const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");


    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-zinc-950" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── Top Header ─────────────────────────────────────────────────── */}
            <header className="h-auto min-h-[48px] py-2 shrink-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-white/10 flex flex-wrap items-center px-3 gap-2 z-10">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-1.5 text-sm font-semibold text-foreground/60 dark:text-zinc-400 hover:text-foreground dark:hover:text-white transition-colors shrink-0"
                >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Back to Dashboard</span>
                </button>

                <div className="flex-1 flex flex-wrap items-center justify-center sm:justify-start lg:justify-center gap-2 min-w-[120px]">
                    {editingTitle ? (
                        <input
                            ref={titleInputRef}
                            value={titleDraft}
                            onChange={e => setTitleDraft(e.target.value)}
                            onBlur={commitTitle}
                            onKeyDown={e => { if (e.key === 'Enter') commitTitle(); if (e.key === 'Escape') cancelTitle(); }}
                            className="max-w-[150px] sm:max-w-[200px] md:max-w-[300px] px-2 py-0.5 rounded-lg border border-indigo-300 dark:border-indigo-500/60 bg-white dark:bg-zinc-800 text-sm font-bold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400/40 dark:focus:ring-indigo-500/40 text-center truncate"
                            maxLength={80}
                            autoFocus
                        />
                    ) : (
                        <button
                            onClick={startEditTitle}
                            title="Click to rename CV"
                            className="group flex items-center gap-1.5 max-w-[150px] sm:max-w-[260px] px-1 sm:px-2 py-0.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <span className="font-bold text-foreground dark:text-white text-sm truncate">
                                {title || 'Untitled CV'}
                            </span>
                            <Pencil className="w-3 h-3 text-zinc-400 dark:text-zinc-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                        </button>
                    )}
                    <span className={`shrink-0 text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border ${isPro
                        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                        : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20'
                        }`}>
                        {isPro ? 'PRO' : 'FREE'}
                    </span>
                </div>

                {/* Mobile: Edit/Preview toggle */}
                <div className="md:hidden flex items-center gap-1 bg-zinc-100 dark:bg-white/5 rounded-lg p-0.5">
                    <button
                        onClick={() => setMobileView("edit")}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${mobileView === "edit" ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400"}`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setMobileView("preview")}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${mobileView === "preview" ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 dark:text-zinc-400"}`}
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
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95"
                            : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-zinc-500 cursor-default"
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
                    onClick={() => router.push("/dashboard")}
                    className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </header>

            {/* ── Body ───────────────────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── Desktop: Narrow icon sidebar ──────────────────────────── */}
                <aside className="hidden md:flex w-[88px] shrink-0 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-white/10 flex-col items-center py-4 gap-2">
                    {TABS.map(({ id, Icon, label }) => {
                        const active = activeTab === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                title={label}
                                className={`w-[72px] h-[72px] flex flex-col items-center justify-center rounded-2xl gap-1 transition-all text-[11px] font-bold leading-tight
                  ${active
                                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
                                        : "text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 hover:bg-gray-50 dark:hover:bg-white/5"
                                    }`}
                            >
                                <Icon className="w-6 h-6" strokeWidth={active ? 2.5 : 2} />
                                {label}
                            </button>
                        );
                    })}
                </aside>

                {/* ── Desktop Section panel  +  Mobile Edit panel ───────────── */}
                <aside className={`${mobileView === "edit" ? "flex" : "hidden"} md:flex w-full md:w-[420px] shrink-0 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-white/10 flex-col overflow-hidden`}>
                    {/* Panel header */}
                    <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 dark:border-white/5 shrink-0">
                        <h2 className="font-bold text-gray-900 dark:text-white text-base">{meta.title}</h2>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{meta.subtitle}</p>
                    </div>
                    {/* Panel content */}
                    <div className="flex-1 overflow-y-auto">
                        {renderPanel()}
                    </div>
                    {/* Bottom Save button */}
                    <div className="p-4 border-t border-gray-100 dark:border-white/5 shrink-0">
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasUnsaved}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
                ${hasUnsaved && !saving
                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95"
                                    : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-zinc-500 cursor-default"
                                }`}
                        >
                            {saving
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                : savedOk
                                    ? <><Check className="w-4 h-4" /> Saved!</>
                                    : <><Save className="w-4 h-4" /> Save Changes</>
                            }
                        </button>
                    </div>
                </aside>

                {/* ── Live Preview — desktop always visible, mobile toggle ─── */}
                <main className={`${mobileView === "preview" ? "flex" : "hidden"} md:flex flex-1 flex-col overflow-hidden bg-zinc-950/5 dark:bg-zinc-950 relative`}>
                    <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_80%_at_50%_10%,rgba(0,0,0,0.02),transparent)] dark:[background:radial-gradient(80%_80%_at_50%_10%,rgba(255,255,255,0.02),transparent)]"></div>
                    <div className="flex items-center justify-between px-4 md:px-6 py-2.5 border-b border-border/20 dark:border-white/5 shrink-0 relative z-10 shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                        <span className="text-foreground/80 text-xs font-semibold tracking-wide flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Preview
                        </span>
                        <div className="flex items-center gap-2">
                            {hasUnsaved && (
                                <span className="flex items-center gap-1.5 text-amber-500 text-[11px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    Unsaved
                                </span>
                            )}
                            {/* Zoom Controls — desktop only */}
                            <div className="hidden md:flex items-center gap-1 ml-4">
                                <button onClick={handleZoomOut} title="Zoom Out" className="w-7 h-7 flex items-center justify-center rounded-md text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors text-base font-bold">−</button>
                                <button onClick={handleZoomReset} title="Reset" className="px-2 h-7 rounded-md text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-colors text-[11px] font-bold tabular-nums">{Math.round(zoom * 100)}%</button>
                                <button onClick={handleZoomIn} title="Zoom In" className="w-7 h-7 flex items-center justify-center rounded-md text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors text-base font-bold">+</button>
                            </div>
                        </div>
                    </div>

                    {/* A4 canvas */}
                    <div className="flex-1 overflow-auto flex items-start justify-center py-6 px-4">
                        {/* Mobile: full-width scaled preview */}
                        <div className="md:hidden w-full flex justify-center">
                            <div
                                className="shadow-lg bg-white shrink-0"
                                style={{
                                    width: `${A4_WIDTH}px`,
                                    minHeight: "1123px",
                                    transform: 'scale(0.42)',
                                    transformOrigin: 'top center',
                                    marginBottom: `${(0.42 - 1) * 1123}px`
                                }}
                            >
                                <CVRenderer avatarUrl={avatarUrl} showPhoto={true} />
                            </div>
                        </div>
                        {/* Desktop: standard scaled preview */}
                        <div
                            className="hidden md:block shadow-2xl bg-white transition-all duration-300 shrink-0"
                            style={{
                                width: `${A4_WIDTH}px`,
                                minHeight: "1123px",
                                transform: `scale(${zoom})`,
                                transformOrigin: "top center",
                                marginBottom: `${(zoom - 1) * 1123}px`,
                            }}
                        >
                            <CVRenderer avatarUrl={avatarUrl} showPhoto={true} />
                        </div>
                    </div>
                </main>
            </div>

            {/* ── Mobile: Bottom Tab Bar ─────────────────────────────────────── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-white/10 flex items-center justify-around px-1 py-1 safe-area-bottom shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
                {TABS.map(({ id, Icon, label }) => {
                    const active = activeTab === id && mobileView === "edit";
                    return (
                        <button
                            key={id}
                            onClick={() => { setActiveTab(id); setMobileView("edit"); }}
                            className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 rounded-xl transition-all min-w-0 flex-1 ${active
                                ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                : "text-gray-400 dark:text-zinc-500"
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
