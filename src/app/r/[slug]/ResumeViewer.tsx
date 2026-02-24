"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Printer,
  Save,
  Check,
  Loader2 as SpinnerIcon,
  User,
  Palette,
} from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { ResumeEditorPanel } from '@/components/resume/ResumeEditorPanel';
import { ThemeEditorPanel } from '@/components/resume/ThemeEditorPanel';
import { CVRenderer } from '@/components/resume/CVRenderer';
import { UpgradeModal } from '@/components/ui/UpgradeModal';
import { usePro } from '@/hooks/usePro';
import { toast } from 'sonner';

const COUNTRY_CODES = [
  { code: "+90", name: "Türkiye" },
  { code: "+1", name: "ABD / Kanada" },
  { code: "+49", name: "Almanya" },
  { code: "+54", name: "Arjantin" },
  { code: "+61", name: "Avustralya" },
  { code: "+43", name: "Avusturya" },
  { code: "+971", name: "BAE" },
  { code: "+32", name: "Belçika" },
  { code: "+55", name: "Brezilya" },
  { code: "+86", name: "Çin" },
  { code: "+45", name: "Danimarka" },
  { code: "+358", name: "Finlandiya" },
  { code: "+33", name: "Fransa" },
  { code: "+27", name: "Güney Afrika" },
  { code: "+82", name: "Güney Kore" },
  { code: "+91", name: "Hindistan" },
  { code: "+31", name: "Hollanda" },
  { code: "+34", name: "İspanya" },
  { code: "+46", name: "İsveç" },
  { code: "+41", name: "İsviçre" },
  { code: "+39", name: "İtalya" },
  { code: "+81", name: "Japonya" },
  { code: "+57", name: "Kolombiya" },
  { code: "+52", name: "Meksika" },
  { code: "+20", name: "Mısır" },
  { code: "+47", name: "Norveç" },
  { code: "+48", name: "Polonya" },
  { code: "+7", name: "Rusya" },
  { code: "+56", name: "Şili" },
  { code: "+44", name: "İngiltere" },
  { code: "+64", name: "Yeni Zelanda" },
  { code: "+30", name: "Yunanistan" },
];

export default function ResumeViewer({
  data,
  initialAvatarUrl,
  isPro = true,
}: {
  data: any;
  initialAvatarUrl: string | null;
  isPro?: boolean;
}) {
  const {
    cvId, setCvData,
    resumeJson, title,
    themeId, themeCategory, colorPaletteId,
    sectionOrder, hiddenSections,
  } = useResumeStore();

  // Track initial load vs. user edits
  const initialised = useRef(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  useEffect(() => {
    if (data && data.id !== cvId) {
      setCvData(data);
      initialised.current = false; // reset on new data
    }
  }, [data, cvId, setCvData]);

  // Detect any changes AFTER initial data load
  useEffect(() => {
    if (!initialised.current) {
      // Skip the very first render (store hydration)
      initialised.current = true;
      return;
    }
    setHasUnsaved(true);
    setSavedOk(false);
  }, [resumeJson, themeId, themeCategory, colorPaletteId, sectionOrder, hiddenSections]);

  const [activeTab, setActiveTab] = useState<"content" | "design">("content");

  const handlePrint = () => window.print();

  const handleSave = useCallback(async () => {
    if (!cvId || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/resumes/${cvId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optimized_json: resumeJson, // save CV content back to Supabase
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }
      setHasUnsaved(false);
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
      toast.success('CV kaydedildi!');
    } catch (err: any) {
      toast.error(err.message || 'Kaydetme başarısız.');
    } finally {
      setSaving(false);
    }
  }, [cvId, saving, resumeJson]);

  return (
    <div className="min-h-screen bg-zinc-100 py-6 lg:py-12 px-2 sm:px-4 print:py-0 print:px-0 flex justify-center">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-10 w-full max-w-7xl mx-auto">
        {/* Responsive Control Panel (Hidden on Print) */}
        <div className="w-full max-w-[380px] shrink-0 bg-white rounded-xl shadow-lg border border-zinc-200 p-6 lg:p-8 flex flex-col gap-6 print:hidden lg:sticky top-8">
          <div className="flex flex-col gap-3 border-b border-zinc-100 pb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                CV Dashboard
              </h2>
              {/* Unsaved indicator dot */}
              {hasUnsaved && !saving && (
                <span className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Kaydedilmemiş değişiklikler
                </span>
              )}
              {savedOk && (
                <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" /> Kaydedildi
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {/* Save CV button */}
              <button
                onClick={handleSave}
                disabled={saving || !hasUnsaved}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm
                  ${hasUnsaved && !saving
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-md active:scale-95'
                    : 'bg-zinc-100 text-zinc-400 cursor-default'
                  }`}
              >
                {saving
                  ? <><SpinnerIcon className="w-4 h-4 animate-spin" /> Kaydediliyor...</>
                  : savedOk
                    ? <><Check className="w-4 h-4" /> Kaydedildi!</>
                    : <><Save className="w-4 h-4" /> CV'yi Kaydet</>
                }
              </button>

              {/* Print button */}
              <button
                onClick={handlePrint}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                title="PDF İndir"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex border border-zinc-200 rounded-lg p-1 bg-zinc-50 mb-2">
            <button
              className={`flex-1 text-sm font-bold py-2 rounded-md transition-all ${activeTab === "content" ? "bg-white shadow-sm text-zinc-900 border border-zinc-200" : "text-zinc-500 hover:text-zinc-700"}`}
              onClick={() => setActiveTab("content")}
            >
              <User className="w-4 h-4 inline-block mr-2 mb-0.5" /> Content
            </button>
            <button
              className={`flex-1 text-sm font-bold py-2 rounded-md transition-all ${activeTab === "design" ? "bg-white shadow-sm text-zinc-900 border border-zinc-200" : "text-zinc-500 hover:text-zinc-700"}`}
              onClick={() => setActiveTab("design")}
            >
              <Palette className="w-4 h-4 inline-block mr-2 mb-0.5" /> Design
            </button>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {activeTab === "content" ? (
              <ResumeEditorPanel />
            ) : activeTab === "design" ? (
              <ThemeEditorPanel />
            ) : null}
          </div>
        </div>

        {/* Resume Canvas (A4 Size) */}
        <div className="relative flex-1 flex justify-center">
          <UpgradeModal />
          <CVRenderer avatarUrl={initialAvatarUrl} showPhoto={true} isPro={isPro} />
        </div>
      </div>
    </div>
  );
}
