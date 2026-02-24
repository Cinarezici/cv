import React from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { EducationEntry } from '@/types';
import { Trash2, GripVertical, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';

export function EducationEditor() {
    const { resumeJson, updateSection } = useResumeStore();
    const educations = resumeJson.education || [];

    const handleAdd = () => {
        const newEntry: EducationEntry = {
            id: nanoid(),
            school: '',
            degree: '',
            start_date: '',
            is_current: false,
        };
        updateSection('education', [...educations, newEntry]);
    };

    const handleChange = (index: number, field: keyof EducationEntry, value: string | boolean) => {
        const updated = [...educations];
        updated[index] = { ...updated[index], [field]: value };
        updateSection('education', updated);
    };

    const handleRemove = (index: number) => {
        const updated = educations.filter((_, i) => i !== index);
        updateSection('education', updated);
    };

    return (
        <div className="flex flex-col gap-6 p-4">
            {educations.map((edu, eduIndex) => (
                <div key={edu.id} className="relative border border-zinc-200 bg-white rounded-xl p-4 shadow-sm group">

                    <div className="absolute left-[-12px] top-4 text-zinc-300 hover:text-indigo-500 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-bold text-zinc-800">Education {eduIndex + 1}</h4>
                        <button
                            onClick={() => handleRemove(eduIndex)}
                            className="text-rose-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">School / University</label>
                            <input
                                value={edu.school}
                                onChange={(e) => handleChange(eduIndex, 'school', e.target.value)}
                                className="border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. Stanford University"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Degree</label>
                                <input
                                    value={edu.degree}
                                    onChange={(e) => handleChange(eduIndex, 'degree', e.target.value)}
                                    className="border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Bachelor of Science"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Field of Study</label>
                                <input
                                    value={edu.field || ''}
                                    onChange={(e) => handleChange(eduIndex, 'field', e.target.value)}
                                    className="border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Computer Science"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Start Date</label>
                                <input
                                    type="month"
                                    value={edu.start_date}
                                    onChange={(e) => handleChange(eduIndex, 'start_date', e.target.value)}
                                    className="border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex justify-between">
                                    <span>End Date</span>
                                    <label className="flex items-center gap-1 cursor-pointer normal-case">
                                        <input
                                            type="checkbox"
                                            checked={edu.is_current}
                                            onChange={(e) => handleChange(eduIndex, 'is_current', e.target.checked)}
                                            className="rounded text-indigo-500 focus:ring-indigo-500"
                                        />
                                        <span className="text-[10px] text-zinc-600">Present</span>
                                    </label>
                                </label>
                                <input
                                    type="month"
                                    value={edu.end_date || ''}
                                    disabled={edu.is_current}
                                    onChange={(e) => handleChange(eduIndex, 'end_date', e.target.value)}
                                    className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${edu.is_current ? 'bg-zinc-100 border-zinc-200 text-zinc-400' : 'bg-white border-zinc-300'}`}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Location</label>
                            <input
                                value={edu.location || ''}
                                onChange={(e) => handleChange(eduIndex, 'location', e.target.value)}
                                className="border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. California, USA"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">GPA (Optional)</label>
                            <input
                                value={edu.gpa || ''}
                                onChange={(e) => handleChange(eduIndex, 'gpa', e.target.value)}
                                className="border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[200px]"
                                placeholder="e.g. 3.8/4.0"
                            />
                        </div>

                        <div className="mt-2 flex flex-col gap-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Honors / Activities</label>
                            <textarea
                                value={edu.honors || ''}
                                onChange={(e) => handleChange(eduIndex, 'honors', e.target.value)}
                                className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y min-h-[42px]"
                                placeholder="e.g. Dean's List, Computer Science Society..."
                                rows={2}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={handleAdd}
                className="w-full py-3.5 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-bold text-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add Education
            </button>
        </div>
    );
}
