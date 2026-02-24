"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ArrowLeft, Plus, LayoutGrid, FileText } from 'lucide-react';
import { usePro } from '@/hooks/usePro';
import Link from 'next/link';

export default function NewBuilderPageClient() {
    const router = useRouter();
    const { isPro, isLoading: proLoading } = usePro();

    if (proLoading) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-[#fafafa]">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    // We want to unlock it for trial users too.
    // The Import page handles the primary entry point logic, so we can just let it through here,
    // as it will call the API and if the API had limits we'd handle it.
    // However, to match the UI, let's just let it through.

    // If Pro, we need to handle the creation. 
    // Since this is a client component now, we can do it in useEffect.
    return <BuilderCreator />;
}

function BuilderCreator() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const createCV = async () => {
            try {
                const res = await fetch('/api/resumes/create-blank', { method: 'POST' });
                const data = await res.json();
                if (data.id) {
                    router.push(`/builder/${data.id}`);
                } else {
                    router.push('/dashboard');
                }
            } catch (err) {
                console.error(err);
                router.push('/dashboard');
            }
        };
        createCV();
    }, []);

    return (
        <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-[#fafafa]">
            <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-zinc-400 mx-auto" />
                <p className="text-zinc-500 font-medium font-sans">Initializing your new CV...</p>
            </div>
        </div>
    );
}
