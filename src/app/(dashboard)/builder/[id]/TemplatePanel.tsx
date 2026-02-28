"use client";

import { Check } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { COLOR_PALETTES } from "@/lib/theme-config";

// Map our themes to cvmakerly-style template cards
const TEMPLATES = [
    {
        id: "clean-ats",
        category: "ats_safe" as const,
        emoji: "✏️",
        name: "Minimalist",
        description: "Clean, distraction-free design (ATS Friendly)",
        features: ["Simple format", "High readability", "Machine friendly"],
    },
    {
        id: "startup-visual",
        category: "visual" as const,
        emoji: "🎨",
        name: "Modern",
        description: "Clean sidebar layout with photo support",
        features: ["Photo support", "Sidebar design", "Colorful accents"],
    },
    {
        id: "executive-ats",
        category: "ats_safe" as const,
        emoji: "💼",
        name: "Executive",
        description: "Sophisticated layout for corporate roles",
        features: ["Serif typography", "Elegant accents", "Traditional format"],
    },
    {
        id: "creative-visual",
        category: "visual" as const,
        emoji: "✨",
        name: "Creative",
        description: "Bold design for creative professionals",
        features: ["Unique layout", "Visual flair", "Standout style"],
    },
];

export default function TemplatePanel() {
    const { themeId, colorPaletteId, updateTheme, updateColorPalette } = useResumeStore();

    return (
        <div className="flex flex-col gap-6 p-5">

            {/* Template cards */}
            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Choose Your CV Template</h3>
                <p className="text-xs text-gray-400 dark:text-zinc-500">Select a template that best fits your industry and style</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((tpl) => {
                    const isSelected = themeId === tpl.id;
                    return (
                        <button
                            key={tpl.id}
                            onClick={() => updateTheme(tpl.id, tpl.category)}
                            className={`relative flex flex-col gap-2 p-4 rounded-2xl border-2 text-left transition-all
                ${isSelected
                                    ? "border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5"
                                }`}
                        >
                            {isSelected && (
                                <span className="absolute top-2 right-2 flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    <Check className="w-2.5 h-2.5" />
                                    Selected
                                </span>
                            )}

                            <span className="text-2xl">{tpl.emoji}</span>
                            <div>
                                <div className="font-bold text-gray-900 dark:text-white text-sm">{tpl.name}</div>
                                <div className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 leading-snug">{tpl.description}</div>
                            </div>

                            <ul className="flex flex-col gap-0.5 mt-1">
                                {tpl.features.map((f) => (
                                    <li key={f} className="flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-zinc-400">
                                        <Check className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </button>
                    );
                })}
            </div>

            {/* Accent Color */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Accent Color</h3>
                <div className="flex gap-2 flex-wrap">
                    {/* Default (no tint) */}
                    <button
                        onClick={() => updateColorPalette("default")}
                        className={`w-8 h-8 rounded-full border-2 transition-all
              ${colorPaletteId === "default" ? "border-gray-800 dark:border-white scale-110" : "border-transparent hover:scale-105"}`}
                        style={{ background: "linear-gradient(135deg, #e2e8f0 50%, #94a3b8 50%)" }}
                        title="Default"
                    />
                    {COLOR_PALETTES.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => updateColorPalette(p.id)}
                            title={p.name}
                            className={`w-8 h-8 rounded-full border-2 transition-all
                ${colorPaletteId === p.id ? "border-gray-800 dark:border-white scale-110 shadow-md" : "border-transparent hover:scale-105"}`}
                            style={{ backgroundColor: p.hex }}
                        />
                    ))}
                </div>
            </div>

            {/* Tip */}
            <div className="flex items-start gap-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl px-4 py-3">
                <span className="text-base">💡</span>
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                    You can change the template anytime. Your data will be preserved.
                </p>
            </div>
        </div>
    );
}
