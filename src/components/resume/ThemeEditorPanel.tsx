import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { THEMES, COLOR_PALETTES, ThemeCategory } from '@/lib/theme-config';
import { Palette, LayoutTemplate, Lock } from 'lucide-react';

export function ThemeEditorPanel() {
    const { themeId, themeCategory, colorPaletteId, updateTheme, updateColorPalette } = useResumeStore();

    const handleCategorySwitch = (category: ThemeCategory) => {
        // Switch to the first theme in that category
        const categoryThemes = Object.values(THEMES).filter(t => t.category === category);
        if (categoryThemes.length > 0) {
            updateTheme(categoryThemes[0].id, category);
        }
    };

    const currentThemes = Object.values(THEMES).filter(t => t.category === themeCategory);

    return (
        <div className="flex flex-col gap-6 w-full mt-4">
            {/* Category Toggle */}
            <div className="flex bg-zinc-100 p-1 rounded-lg">
                <button
                    onClick={() => handleCategorySwitch('ats_safe')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${themeCategory === 'ats_safe'
                            ? 'bg-white shadow-sm text-indigo-600'
                            : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                >
                    ATS Safe
                </button>
                <button
                    onClick={() => handleCategorySwitch('visual')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${themeCategory === 'visual'
                            ? 'bg-white shadow-sm text-indigo-600'
                            : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                >
                    Visual
                </button>
            </div>

            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <div className="flex items-center gap-2 mb-4">
                    <LayoutTemplate className="w-4 h-4 text-zinc-600" />
                    <h3 className="text-sm font-bold text-zinc-800">Select Template</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {currentThemes.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => updateTheme(theme.id, themeCategory)}
                            className={`relative flex flex-col items-start p-3 rounded-lg border text-left transition-all ${themeId === theme.id
                                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                                    : 'border-zinc-200 bg-white hover:border-indigo-300'
                                }`}
                        >
                            <div className="flex justify-between w-full items-center mb-1">
                                <span className="font-bold text-sm text-zinc-900">{theme.name}</span>
                                {theme.isPremium && <Lock className="w-3 h-3 text-amber-500" />}
                            </div>
                            <span className="text-[10px] text-zinc-500 leading-tight">
                                {theme.description}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-4 h-4 text-zinc-600" />
                    <h3 className="text-sm font-bold text-zinc-800">Accent Color</h3>
                </div>

                <div className="flex flex-wrap gap-3">
                    {COLOR_PALETTES.map((color) => (
                        <button
                            key={color.id}
                            onClick={() => updateColorPalette(color.id)}
                            title={color.name}
                            className={`w-10 h-10 rounded-full transition-transform ${colorPaletteId === color.id
                                    ? 'ring-2 ring-offset-2 ring-zinc-800 scale-110 shadow-md'
                                    : 'border border-zinc-200 hover:scale-110'
                                }`}
                            style={{ backgroundColor: color.hex }}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}
