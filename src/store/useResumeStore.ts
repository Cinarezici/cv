import { create } from 'zustand';
import { ResumeJSON, SectionKey, CV } from '@/types';
import { mapToResumeJSON, DEFAULT_SECTION_ORDER } from '@/lib/resume-mapper';

interface ResumeState {
    // Database Entity State
    cvId: string | null;
    title: string;
    themeId: string;
    themeCategory: 'ats_safe' | 'visual';
    colorPaletteId: string;
    sectionOrder: SectionKey[];
    hiddenSections: SectionKey[];
    isLocked: boolean;

    // Content State
    resumeJson: ResumeJSON;

    // Actions
    setCvData: (cv: any) => void;
    updateResumeJson: (partialResume: Partial<ResumeJSON>) => void;
    updateSection: <K extends keyof ResumeJSON>(section: K, data: ResumeJSON[K]) => void;
    updateTheme: (themeId: string, category: 'ats_safe' | 'visual') => void;
    updateColorPalette: (paletteId: string) => void;
    updateSectionOrder: (order: SectionKey[]) => void;
    toggleSectionVisibility: (sectionKey: SectionKey) => void;
    setTitle: (title: string) => void;
}

const defaultResumeJson: ResumeJSON = {
    header: {
        full_name: 'Your Full Name',
        headline: 'e.g., Senior Software Engineer',
        email: '(your.email@example.com)',
        phone: '(+1 123 456 7890)',
        location: '(City, Country)',
        show_photo: true,
    },
    summary: 'Briefly describe your professional background, top achievements, and what you are looking for in your next role (e.g., "5+ years experience in Software Engineering with a focus on React...").',
    skills: { core: [], tools: [] },
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
};

export const useResumeStore = create<ResumeState>((set) => ({
    cvId: null,
    title: 'My Resume',
    themeId: 'clean-ats',
    themeCategory: 'ats_safe',
    colorPaletteId: 'default',
    sectionOrder: DEFAULT_SECTION_ORDER,
    hiddenSections: [],
    isLocked: false,
    resumeJson: defaultResumeJson,

    setCvData: (cv) => {
        // Handle potentially missing nested data or old formats
        const rawJson = cv.resume_json || cv.optimized_json || defaultResumeJson;
        const mappedJson = mapToResumeJSON(rawJson);

        set({
            cvId: cv.id,
            title: cv.title || 'Untitled Resume',
            // Hydrate theme from DB columns (setup_phase16.sql); fallback to defaults
            themeId: cv.theme_id || 'clean-ats',
            themeCategory: (cv.theme_category || 'ats_safe') as 'ats_safe' | 'visual',
            colorPaletteId: cv.color_palette_id || 'default',
            sectionOrder: cv.section_order || DEFAULT_SECTION_ORDER,
            hiddenSections: cv.hidden_sections || [],
            isLocked: cv.is_locked || false,
            resumeJson: mappedJson,
        });
    },

    updateResumeJson: (partialResume) => set((state) => ({
        resumeJson: { ...state.resumeJson, ...partialResume }
    })),

    updateSection: (section, data) => set((state) => ({
        resumeJson: { ...state.resumeJson, [section]: data }
    })),

    updateTheme: (themeId, category) => set({ themeId, themeCategory: category }),

    updateColorPalette: (paletteId) => set({ colorPaletteId: paletteId }),

    updateSectionOrder: (order) => set({ sectionOrder: order }),

    toggleSectionVisibility: (sectionKey) => set((state) => {
        const isHidden = state.hiddenSections.includes(sectionKey);
        return {
            hiddenSections: isHidden
                ? state.hiddenSections.filter(k => k !== sectionKey)
                : [...state.hiddenSections, sectionKey]
        };
    }),

    setTitle: (title) => set({ title }),
}));
