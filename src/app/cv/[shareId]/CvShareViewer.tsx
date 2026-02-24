"use client";

/**
 * CvShareViewer — Read-only public CV viewer for the /cv/[shareId] route.
 *
 * Follows the SAME pattern as /r/[slug]/ResumeViewer.tsx:
 *   - Receives the full resumes row from the server component
 *   - Hydrates useResumeStore via setCvData()
 *   - Renders CVRenderer in read-only mode (no edit panels)
 *
 * Only PUBLIC CV data is passed from the server.
 * Subscription data never reaches this component.
 */

import { useEffect } from "react";
import { Printer } from "lucide-react";
import { CVRenderer } from "@/components/resume/CVRenderer";
import { useResumeStore } from "@/store/useResumeStore";

interface Props {
    data: any;           // full resumes row (sanitised — no subscription data)
    initialAvatarUrl: string | null;
    isPro?: boolean;
}

export default function CvShareViewer({ data, initialAvatarUrl, isPro = true }: Props) {
    const { cvId, setCvData } = useResumeStore();

    // Hydrate store from Supabase resume data (same as ResumeViewer)
    useEffect(() => {
        if (data && data.id !== cvId) {
            setCvData(data);
        }
    }, [data, cvId, setCvData]);

    const handlePrint = () => window.print();

    return (
        <div className="min-h-screen bg-zinc-100 py-8 px-4 flex flex-col items-center print:py-0 print:px-0">
            {/* Minimal top bar */}
            <div className="w-full max-w-[900px] mb-4 flex justify-end print:hidden">
                <button
                    onClick={handlePrint}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                    <Printer className="w-4 h-4" />
                    Download PDF
                </button>
            </div>

            {/* A4 CV canvas */}
            <CVRenderer avatarUrl={initialAvatarUrl} showPhoto={true} isPro={isPro} />

            {/* Subtle watermark */}
            <div className="mt-4 print:hidden">
                <span className="text-xs text-zinc-400 font-medium tracking-wide">
                    Powered by CV Optimizer AI
                </span>
            </div>
        </div>
    );
}
