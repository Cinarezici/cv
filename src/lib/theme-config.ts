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
        isPremium: true,
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
        isPremium: true,
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

    // Additional Pro Templates
    'jake-ats': {
        id: 'jake-ats',
        name: "Jake's Resume",
        category: 'ats_safe',
        isPremium: true,
        layout: 'single_column',
        allowsPhoto: false,
        allowsIcons: false,
        defaultFontFamily: 'Charter',
        description: "Jake Gutstein's legendary single-page LaTeX-inspired ATS format — the most cloned resume template on GitHub."
    },
    'deedy-visual': {
        id: 'deedy-visual',
        name: 'Deedy',
        category: 'visual',
        isPremium: true,
        layout: 'two_column',
        allowsPhoto: false,
        allowsIcons: true,
        defaultFontFamily: 'Lato',
        description: 'Two-column powerhouse inspired by Deedy Das. Loved by FAANG engineers worldwide.'
    },
    'nordic-minimal': {
        id: 'nordic-minimal',
        name: 'Nordic Minimal',
        category: 'ats_safe',
        isPremium: true,
        layout: 'single_column',
        allowsPhoto: false,
        allowsIcons: false,
        defaultFontFamily: 'Inter',
        description: 'Scandinavian whitespace and typographic precision. Ultra-readable and highly professional.'
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
