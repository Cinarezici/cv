import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { X } from 'lucide-react';

export function SkillsEditor() {
    const { resumeJson, updateSection } = useResumeStore();
    const skills = resumeJson.skills || { core: [], tools: [] };
    const core = skills.core || [];
    const tools = skills.tools || [];

    const handleAddSkill = (type: 'core' | 'tools', value: string) => {
        if (!value.trim()) return;
        const targetArray = type === 'core' ? core : tools;
        if (targetArray.includes(value.trim())) return; // Prevent duplicates

        updateSection('skills', {
            ...skills,
            [type]: [...targetArray, value.trim()]
        });
    };

    const handleRemoveSkill = (type: 'core' | 'tools', index: number) => {
        const targetArray = type === 'core' ? core : tools;
        const updated = targetArray.filter((_, i) => i !== index);

        updateSection('skills', {
            ...skills,
            [type]: updated
        });
    };

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Core Skills */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Core Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {core.map((skill, index) => (
                        <span key={index} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 font-medium px-2.5 py-1 rounded-md text-sm border border-indigo-100">
                            {skill}
                            <button
                                onClick={() => handleRemoveSkill('core', index)}
                                className="hover:text-rose-500 focus:outline-none transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Type a skill and press Enter (e.g. Product Strategy)"
                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill('core', e.currentTarget.value);
                            e.currentTarget.value = '';
                        }
                    }}
                />
            </div>

            <hr className="border-t border-zinc-200" />

            {/* Tools */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tools & Technologies</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {tools.map((tool, index) => (
                        <span key={index} className="flex items-center gap-1 bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-md text-sm border border-emerald-100">
                            {tool}
                            <button
                                onClick={() => handleRemoveSkill('tools', index)}
                                className="hover:text-rose-500 focus:outline-none transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Type a tool and press Enter (e.g. Figma, Python)"
                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill('tools', e.currentTarget.value);
                            e.currentTarget.value = '';
                        }
                    }}
                />
            </div>
        </div>
    );
}
