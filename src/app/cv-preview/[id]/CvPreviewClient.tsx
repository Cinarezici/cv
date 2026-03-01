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

    return (
        <div className="flex items-start justify-center min-h-screen bg-zinc-100 py-8 px-4 overflow-auto">
            <div className="w-full max-w-[794px]">
                <CVRenderer avatarUrl={null} showPhoto={false} isPro={true} />
            </div>
        </div>
    );
}
