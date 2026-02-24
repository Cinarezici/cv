"use client";

import React, { useState, useEffect } from 'react';
import { AccordionSection } from './AccordionSection';
import { HeaderEditor } from './editors/HeaderEditor';
import { SummaryEditor } from './editors/SummaryEditor';
import { ExperienceEditor } from './editors/ExperienceEditor';
import { EducationEditor } from './editors/EducationEditor';
import { SkillsEditor } from './editors/SkillsEditor';
import { User, AlignLeft, Briefcase, GraduationCap, Wrench, GripVertical } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { SectionKey } from '@/types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableSection({ id, title, icon, defaultOpen, children }: { id: string, title: string, icon: React.ReactNode, defaultOpen: boolean, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: isDragging ? 'relative' as const : 'static' as const,
    };

    return (
        <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50' : ''}>
            <AccordionSection
                title={title}
                icon={icon}
                defaultOpen={defaultOpen}
                dragHandle={
                    <div {...attributes} {...listeners} className="p-2 -ml-2 rounded-md hover:bg-zinc-200 outline-none" id={`drag-handle-${id}`}>
                        <GripVertical className="w-4 h-4 text-zinc-400" />
                    </div>
                }
            >
                {children}
            </AccordionSection>
        </div>
    );
}

export function ResumeEditorPanel() {
    const { sectionOrder, updateSectionOrder } = useResumeStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5 // drag only triggers after 5 px to prevent misclicks on accordion
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = sectionOrder.indexOf(active.id as SectionKey);
            const newIndex = sectionOrder.indexOf(over.id as SectionKey);
            updateSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
        }
    }

    const SECTION_COMPONENTS: Record<string, React.ReactNode> = {
        header: <HeaderEditor key="header" />,
        summary: <SummaryEditor key="summary" />,
        skills: <SkillsEditor key="skills" />,
        experience: <ExperienceEditor key="experience" />,
        education: <EducationEditor key="education" />,
    };

    const SECTION_TITLES: Record<string, string> = {
        header: "Personal Information",
        summary: "Professional Summary",
        skills: "Skills & Technologies",
        experience: "Work Experience",
        education: "Education",
    };

    const SECTION_ICONS: Record<string, React.ReactNode> = {
        header: <User className="w-4 h-4" />,
        summary: <AlignLeft className="w-4 h-4" />,
        skills: <Wrench className="w-4 h-4" />,
        experience: <Briefcase className="w-4 h-4" />,
        education: <GraduationCap className="w-4 h-4" />,
    };

    if (!isMounted) return <div className="p-8 text-center text-zinc-400">Loading editor...</div>;

    return (
        <div className="flex flex-col gap-2 w-full mt-4">
            <DndContext id="resume-editor-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                    {sectionOrder.map((sectionId: string) => {
                        const title = SECTION_TITLES[sectionId];
                        const icon = SECTION_ICONS[sectionId];
                        const Component = SECTION_COMPONENTS[sectionId];

                        if (!Component) return null; // If a section is in order but not yet implemented

                        return (
                            <SortableSection
                                key={sectionId}
                                id={sectionId}
                                title={title}
                                icon={icon}
                                defaultOpen={sectionId === 'header'} // Open first tab
                            >
                                {Component}
                            </SortableSection>
                        );
                    })}
                </SortableContext>
            </DndContext>

            <div className="mt-4 pt-4 border-t border-zinc-200">
                <button className="w-full py-3 bg-zinc-50 border border-zinc-200 text-zinc-600 font-bold rounded-xl text-sm hover:bg-zinc-100 transition-colors">
                    + Add Section (Projects, Languages...)
                </button>
            </div>
        </div>
    );
}
