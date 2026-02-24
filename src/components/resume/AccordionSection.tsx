import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    dragHandle?: React.ReactNode;
}

export function AccordionSection({ title, icon, children, defaultOpen = false, dragHandle }: AccordionSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-zinc-200 rounded-xl bg-white shadow-sm overflow-hidden mb-4">
            <div className="flex w-full">
                {dragHandle && (
                    <div className="flex items-center justify-center pl-4 bg-zinc-50 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 transition-colors">
                        {dragHandle}
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex-1 flex items-center justify-between p-4 bg-zinc-50 hover:bg-zinc-100 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        {icon && <div className="text-zinc-500">{icon}</div>}
                        <h3 className="text-sm font-bold text-zinc-900 tracking-tight">{title}</h3>
                    </div>
                    <div className="text-zinc-400">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </button>
            </div>

            {isOpen && (
                <div className="border-t border-zinc-100 bg-white">
                    {children}
                </div>
            )}
        </div>
    );
}
