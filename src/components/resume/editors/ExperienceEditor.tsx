import React, { useState, useCallback } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { ExperienceEntry } from '@/types';
import { Trash2, GripVertical, Plus, Sparkles, Loader2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

export function ExperienceEditor() {
    const { resumeJson, updateSection } = useResumeStore();
    const experiences = resumeJson.experience || [];
    const [improvingKey, setImprovingKey] = useState<string | null>(null);

    const handleImprove = useCallback(async (expIndex: number, bulletIndex: number, text: string, exp: ExperienceEntry) => {
        if (!text.trim()) { toast.error('Write some text first'); return; }
        const key = `${expIndex}-${bulletIndex}`;
        setImprovingKey(key);
        try {
            const res = await fetch('/api/ai/improve-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    section: 'experience',
                    context: `${exp.role} at ${exp.company}`,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            const updated = [...experiences];
            updated[expIndex].bullets[bulletIndex] = data.improved;
            updateSection('experience', updated);
            toast.success('Improved!');
        } catch (err: any) {
            toast.error(err.message || 'AI improve failed');
        } finally {
            setImprovingKey(null);
        }
    }, [experiences, updateSection]);

    const handleAdd = () => {
        const newEntry: ExperienceEntry = {
            id: nanoid(),
            company: '',
            role: '',
            start_date: '',
            end_date: '',
            is_current: false,
            bullets: [],
        };
        updateSection('experience', [...experiences, newEntry]);
    };

    const handleChange = (index: number, field: keyof ExperienceEntry, value: string | boolean) => {
        const updated = [...experiences];
        updated[index] = { ...updated[index], [field]: value };
        updateSection('experience', updated);
    };

    const handleRemove = (index: number) => {
        const updated = experiences.filter((_, i) => i !== index);
        updateSection('experience', updated);
    };

    const handleBulletChange = (expIndex: number, bulletIndex: number, value: string) => {
        const updated = [...experiences];
        updated[expIndex].bullets[bulletIndex] = value;
        updateSection('experience', updated);
    };

    const addBullet = (expIndex: number) => {
        const updated = [...experiences];
        if (updated[expIndex].bullets.length >= 6) return;
        updated[expIndex].bullets.push('');
        updateSection('experience', updated);
    };

    const removeBullet = (expIndex: number, bulletIndex: number) => {
        const updated = [...experiences];
        updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
        updateSection('experience', updated);
    };

    return (
        <div className="flex flex-col gap-6 p-4">
            {experiences.map((exp, expIndex) => (
                <div key={exp.id} className="relative border border-zinc-200 bg-white rounded-xl p-4 shadow-sm group">

                    <div className="absolute left-[-12px] top-4 text-zinc-300 hover:text-indigo-500 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-bold text-zinc-800">Experience {expIndex + 1}</h4>
                        <button
                            onClick={() => handleRemove(expIndex)}
                            className="text-rose-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Company</label>
                                <input
                                    value={exp.company}
                                    onChange={(e) => handleChange(expIndex, 'company', e.target.value)}
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</label>
                                <input
                                    value={exp.role}
                                    onChange={(e) => handleChange(expIndex, 'role', e.target.value)}
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Location</label>
                            <input
                                value={exp.location || ''}
                                onChange={(e) => handleChange(expIndex, 'location', e.target.value)}
                                className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. San Francisco, CA"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Start Date</label>
                                <input
                                    type="month"
                                    value={exp.start_date}
                                    onChange={(e) => handleChange(expIndex, 'start_date', e.target.value)}
                                    className="border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex justify-between">
                                    <span>End Date</span>
                                    <label className="flex items-center gap-1 cursor-pointer normal-case">
                                        <input
                                            type="checkbox"
                                            checked={exp.is_current}
                                            onChange={(e) => handleChange(expIndex, 'is_current', e.target.checked)}
                                            className="rounded text-indigo-500 focus:ring-indigo-500"
                                        />
                                        <span className="text-[10px] text-zinc-600">Present</span>
                                    </label>
                                </label>
                                <input
                                    type="month"
                                    value={exp.end_date || ''}
                                    disabled={exp.is_current}
                                    onChange={(e) => handleChange(expIndex, 'end_date', e.target.value)}
                                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${exp.is_current ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600' : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white'}`}
                                />
                            </div>
                        </div>

                        {/* Bullets */}
                        <div className="mt-2 flex flex-col gap-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Responsibilities & Achievements</label>

                            {exp.bullets.map((bullet, bulletIndex) => {
                                const bKey = `${expIndex}-${bulletIndex}`;
                                const isImproving = improvingKey === bKey;
                                return (
                                    <div key={bulletIndex} className="flex items-start gap-2">
                                        <div className="mt-2 text-zinc-300 cursor-grab hover:text-indigo-500 shrink-0">
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                        <div className="relative flex-1">
                                            <textarea
                                                value={bullet}
                                                onChange={(e) => handleBulletChange(expIndex, bulletIndex, e.target.value)}
                                                className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 pr-16 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[42px]"
                                                placeholder="Describe what you did and the impact..."
                                                rows={2}
                                            />
                                            {/* AI Improve button */}
                                            <button
                                                onClick={() => handleImprove(expIndex, bulletIndex, bullet, exp)}
                                                disabled={isImproving}
                                                title="Improve with AI"
                                                className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-bold text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-md transition-all disabled:opacity-50"
                                            >
                                                {isImproving
                                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                                    : <Sparkles className="w-3 h-3" />
                                                }
                                                Improve
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeBullet(expIndex, bulletIndex)}
                                            className="mt-1 p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}

                            {exp.bullets.length < 6 && (
                                <button
                                    onClick={() => addBullet(expIndex)}
                                    className="mt-1 self-start flex items-center gap-1 text-[13px] font-bold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Bullet Point
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            ))}

            <button
                onClick={handleAdd}
                className="w-full py-3.5 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-bold text-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add Experience
            </button>
        </div>
    );
}
