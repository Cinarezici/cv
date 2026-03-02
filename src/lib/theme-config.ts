export type ThemeCategory = 'ats_safe' | 'visual';

export interface ThemeConfig {
    id: string;
    name: string;
    category: ThemeCategory;
    isPremium: boolean;
    layout: 'single_column' | 'two_column';
    allowsPhoto: boolean;
    allowsIcons: boolean;
    defaultFontFamily: string;
    description: string;
}

export const THEMES: Record<string, ThemeConfig> = {
    // Free ATS
    'clean-ats': {
        id: 'clean-ats',
        name: 'Clean ATS',
        category: 'ats_safe',
        isPremium: false,
        layout: 'single_column',
        allowsPhoto: false,
        allowsIcons: false,
        defaultFontFamily: 'Arial',
        description: 'Standard, highly readable ATS format.'
    },
    'classic-ats': {
        id: 'classic-ats',
        name: 'Classic ATS',
        category: 'ats_safe',
        isPremium: false,
        layout: 'single_column',
        allowsPhoto: false,
        allowsIcons: false,
        defaultFontFamily: 'Times New Roman',
        description: 'Traditional academic style layout.'
    },
    // Pro ATS
    'modern-ats': {
        id: 'modern-ats',
        name: 'Modern ATS',
        category: 'ats_safe',
        isPremium: true,
        layout: 'single_column',
        allowsPhoto: false,
        allowsIcons: false,
        defaultFontFamily: 'Inter',
        description: 'A modern take on ATS formats with superior spacing.'
    },
    'executive-ats': {
        id: 'executive-ats',
        name: 'Executive ATS',
        category: 'ats_safe',
        isPremium: false,
        layout: 'single_column',
        allowsPhoto: false,
        allowsIcons: false,
        defaultFontFamily: 'Georgia',
        description: 'Premium spacing and serif typography for senior roles.'
    },
    'tech-ats': {
        id: 'tech-ats',
        name: 'Tech ATS',
        category: 'ats_safe',
        isPremium: true,
        layout: 'single_column',
        allowsPhoto: false,
        allowsIcons: false,
        defaultFontFamily: 'Roboto',
        description: 'Dense layout optimized for software engineers.'
    },

    // Free Visual
    'startup-visual': {
        id: 'startup-visual',
        name: 'Startup Visual',
        category: 'visual',
        isPremium: false,
        layout: 'two_column',
        allowsPhoto: true,
        allowsIcons: true,
        defaultFontFamily: 'Inter',
        description: 'A striking modern look perfect for startups.'
    },

    // Pro Visual
    'creative-visual': {
        id: 'creative-visual',
        name: 'Creative Visual',
        category: 'visual',
        isPremium: false,
        layout: 'two_column',
        allowsPhoto: true,
        allowsIcons: true,
        defaultFontFamily: 'Playfair Display',
        description: 'Expressive layout for design roles.'
    },
    'corporate-visual': {
        id: 'corporate-visual',
        name: 'Corporate Visual',
        category: 'visual',
        isPremium: true,
        layout: 'two_column',
        allowsPhoto: true,
        allowsIcons: true,
        defaultFontFamily: 'Helvetica',
        description: 'Serious, structured multi-column design.'
    },
    'minimal-visual': {
        id: 'minimal-visual',
        name: 'Minimal Visual',
        category: 'visual',
        isPremium: true,
        layout: 'single_column',
        allowsPhoto: true,
        allowsIcons: false,
        defaultFontFamily: 'Inter',
        description: 'High whitespace, no clutter, modern and refined.'
    },
    'compact-visual': {
        id: 'compact-visual',
        name: 'Compact Visual',
        category: 'visual',
        isPremium: true,
        layout: 'two_column',
        allowsPhoto: true,
        allowsIcons: true,
        defaultFontFamily: 'Roboto',
        description: 'Optimized for fitting multiple pages into one.'
    },

    // ── 6 New Pro Templates (from open-source references) ──────────────────
    'awesome-cv': {
        id: 'awesome-cv',
        name: 'Awesome CV',
        category: 'visual',
        isPremium: true,
        layout: 'two_column',
        allowsPhoto: true,
        allowsIcons: true,
        defaultFontFamily: 'Roboto',
        description: 'Inspired by posquit0/Awesome-CV — the most starred LaTeX CV template on GitHub with 22k+ stars.'
    },
    'jake-resume': {
        id: 'jake-resume',
        name: "Jake's Resume",
        category: 'ats_safe',
        isPremium: true,
        layout: 'single_column',
        allowsPhoto: false,
        allowsIcons: false,
        defaultFontFamily: 'Charter',
        description: "Jake Gutstein's legendary single-page format. Most cloned resume on GitHub, beloved by FAANG engineers."
    },
    'altacv': {
        id: 'altacv',
        name: 'AltaCV',
        category: 'visual',
        isPremium: true,
        layout: 'two_column',
        allowsPhoto: true,
        allowsIcons: true,
        defaultFontFamily: 'Lato',
        description: 'Inspired by liantze/AltaCV — a premium two-pane layout with signature colored section dots.'
    },
    'nextjs-resume': {
        id: 'nextjs-resume',
        name: 'NextJS Resume',
        category: 'ats_safe',
        isPremium: true,
        layout: 'single_column',
        allowsPhoto: false,
        allowsIcons: false,
        defaultFontFamily: 'Inter',
        description: 'Inspired by ibelick/nextjs-resume — ultra-clean, modern web-native resume aesthetic.'
    },
    'rendercv-tech': {
        id: 'rendercv-tech',
        name: 'Tech Dense',
        category: 'ats_safe',
        isPremium: true,
        layout: 'single_column',
        allowsPhoto: false,
        allowsIcons: false,
        defaultFontFamily: 'Roboto Mono',
        description: 'Inspired by RenderCV engineering theme — maximum information density for SWE/ML roles.'
    },
    'reactive-resume': {
        id: 'reactive-resume',
        name: 'Reactive',
        category: 'visual',
        isPremium: true,
        layout: 'two_column',
        allowsPhoto: true,
        allowsIcons: true,
        defaultFontFamily: 'Inter',
        description: 'Inspired by amruthpillai/reactive-resume — card-based modern layout with top accent strip.'
    },
};

export const COLOR_PALETTES = [
    { id: 'emerald', name: 'Emerald', hex: '#10b981' },
    { id: 'indigo', name: 'Indigo', hex: '#4f46e5' },
    { id: 'slate', name: 'Slate', hex: '#475569' },
    { id: 'rose', name: 'Rose', hex: '#e11d48' },
    { id: 'cerulean', name: 'Cerulean', hex: '#0284c7' },
    { id: 'amber', name: 'Amber', hex: '#d97706' },
];
