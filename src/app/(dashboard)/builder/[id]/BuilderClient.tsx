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
    User, AlignLeft, Briefcase, GraduationCap, Wrench, LayoutTemplate, List,
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
    education: "Education",
    skills: "Skills",
};

const PANEL_META: Record<TabId, { title: string; subtitle: string }> = {
    template: { title: "Template", subtitle: "Choose a template that fits your style." },
    header: { title: "Personal", subtitle: "Fill in your contact information." },
    summary: { title: "Summary", subtitle: "Write a short professional summary." },
    experience: { title: "Experience", subtitle: "Add your work history." },
    education: { title: "Education", subtitle: "Add your education background." },
    skills: { title: "Skills", subtitle: "List your key skills and tools." },
    order: { title: "Section Order", subtitle: "Drag sections to reorder your CV." },
};

// Sortable row for "Order" panel
function SortableRow({ id, label }: { id: string; label: string }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition }}
            className={`flex items-center gap-3 py-3 px-4 bg-white rounded-xl border border-gray-200 select-none
        ${isDragging ? "opacity-50 shadow-lg" : "hover:bg-gray-50"}`}
        >
            <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 touch-none">
                <GripVertical className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
    );
}

export default function BuilderClient({ data, avatarUrl, isPro }: { data: any; avatarUrl: string | null; isPro?: boolean }) {
    const router = useRouter();
    const {
        cvId, setCvData,
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
            toast.success("CV saved!");
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
                        <p className="text-xs text-gray-400">Drag to reorder sections in your CV.</p>
                        <DndContext id="builder-order-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={sectionOrder.filter(k => k in SECTION_LABELS)} strategy={verticalListSortingStrategy}>
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

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── Top Header ─────────────────────────────────────────────────── */}
            <header className="h-12 shrink-0 bg-white border-b border-gray-200 flex items-center px-4 gap-3 z-10">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="flex-1 flex items-center justify-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">CV Builder</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${isPro
                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {isPro ? 'PRO' : 'FREE'}
                    </span>
                </div>

                {/* Save */}
                <button
                    onClick={handleSave}
                    disabled={saving || !hasUnsaved}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-sm transition-all
            ${hasUnsaved && !saving
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95"
                            : "bg-gray-100 text-gray-400 cursor-default"
                        }`}
                >
                    {saving
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                        : savedOk
                            ? <><Check className="w-4 h-4" /> Saved!</>
                            : <><Save className="w-4 h-4" /> Save CV</>
                    }
                </button>

                <button
                    onClick={() => router.push("/dashboard")}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </header>

            {/* ── Body ───────────────────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── Narrow icon sidebar ───────────────────────────────── */}
                <aside className="w-[60px] shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-3 gap-1">
                    {TABS.map(({ id, Icon, label }) => {
                        const active = activeTab === id;
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                title={label}
                                className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl gap-0.5 transition-all text-[9px] font-semibold leading-tight
                  ${active
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.5 : 2} />
                                {label}
                            </button>
                        );
                    })}
                </aside>

                {/* ── Section panel ─────────────────────────────────────── */}
                <aside className="w-[420px] shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
                    {/* Panel header */}
                    <div className="px-6 py-4 border-b border-gray-100 shrink-0">
                        <h2 className="font-bold text-gray-900 text-base">{meta.title}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{meta.subtitle}</p>
                    </div>
                    {/* Panel content */}
                    <div className="flex-1 overflow-y-auto">
                        {renderPanel()}
                    </div>
                    {/* Bottom Save CV button (per-section, like cvmakerly) */}
                    <div className="p-4 border-t border-gray-100 shrink-0">
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasUnsaved}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all
                ${hasUnsaved && !saving
                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95"
                                    : "bg-gray-100 text-gray-400 cursor-default"
                                }`}
                        >
                            {saving
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                : savedOk
                                    ? <><Check className="w-4 h-4" /> Saved!</>
                                    : <><Save className="w-4 h-4" /> Save CV</>
                            }
                        </button>
                    </div>
                </aside>

                {/* ── Live Preview — dark bg, A4 scaled to fit ─────────── */}
                <main className="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
                    <div className="flex items-center justify-between px-6 py-2.5 border-b border-white/10 shrink-0">
                        <span className="text-white/60 text-xs font-semibold tracking-wide">Live Preview</span>
                        <div className="flex items-center gap-2">
                            {hasUnsaved && (
                                <span className="flex items-center gap-1.5 text-amber-400 text-[11px] font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                    Unsaved changes
                                </span>
                            )}
                            {/* Zoom Controls */}
                            <div className="flex items-center gap-1 ml-4">
                                <button
                                    onClick={handleZoomOut}
                                    title="Zoom Out"
                                    className="w-7 h-7 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors text-base font-bold"
                                >
                                    −
                                </button>
                                <button
                                    onClick={handleZoomReset}
                                    title="Reset Zoom"
                                    className="px-2 h-7 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors text-[11px] font-bold tabular-nums"
                                >
                                    {Math.round(zoom * 100)}%
                                </button>
                                <button
                                    onClick={handleZoomIn}
                                    title="Zoom In"
                                    className="w-7 h-7 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors text-base font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* A4 canvas — scaled to fit the panel */}
                    <div className="flex-1 overflow-auto flex items-start justify-center py-8 px-6">
                        <div
                            style={{
                                width: A4_WIDTH,
                                transform: `scale(${zoom})`,
                                transformOrigin: 'top center',
                                marginBottom: `${(zoom - 1) * 1123}px`, /* compensate height loss when scaled down */
                            }}
                            className="shadow-2xl shadow-black/60 shrink-0"
                        >
                            <CVRenderer avatarUrl={avatarUrl} showPhoto={true} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
