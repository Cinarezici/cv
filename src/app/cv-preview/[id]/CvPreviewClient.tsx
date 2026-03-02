'use client';

import { useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { CVRenderer } from '@/components/resume/CVRenderer';

interface Props {
    resume: any;
}

export default function CvPreviewClient({ resume }: Props) {
    const { setCvData } = useResumeStore();

    useEffect(() => {
        // setCvData handles all hydration: themeId, colorPaletteId, sectionOrder, resumeJson
        setCvData(resume);
    }, [resume, setCvData]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('print') === 'true') {
                // Wait for styles & fonts to finalize before triggering print dialog
                setTimeout(() => window.print(), 1000);
            }
        }
    }, [resume]);

    return (
        <div className="flex items-start justify-center min-h-screen bg-zinc-100 py-8 px-4 overflow-auto">
            <div className="w-full max-w-[794px]">
                <CVRenderer avatarUrl={null} showPhoto={false} isPro={true} />
            </div>
        </div>
    );
}
