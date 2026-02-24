import { useState, useEffect } from 'react';
import { useResumeStore } from '../store/useResumeStore';

type SaveStatus = 'saved' | 'saving' | 'error';

export function useAutosave() {
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

    // Extract all relevant data from the store
    const {
        cvId,
        title,
        themeId,
        themeCategory,
        colorPaletteId,
        sectionOrder,
        hiddenSections,
        resumeJson,
        isLocked
    } = useResumeStore();

    useEffect(() => {
        if (!cvId || isLocked) return;

        setSaveStatus('saving');

        const saveData = async () => {
            try {
                const payload = {
                    title,
                    theme_id: themeId,
                    theme_category: themeCategory,
                    color_palette_id: colorPaletteId,
                    section_order: sectionOrder,
                    hidden_sections: hiddenSections,
                    resume_json: resumeJson,
                };

                const res = await fetch(`/api/cvs/${cvId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    throw new Error('Failed to update CV');
                }

                setSaveStatus('saved');
            } catch (err) {
                console.error('Autosave error:', err);
                setSaveStatus('error');
            }
        };

        const timer = setTimeout(saveData, 1000);

        return () => clearTimeout(timer);
    }, [cvId, title, themeId, themeCategory, colorPaletteId, sectionOrder, hiddenSections, resumeJson, isLocked]);

    return saveStatus;
}
