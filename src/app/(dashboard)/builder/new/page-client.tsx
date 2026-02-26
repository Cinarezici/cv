"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, ArrowLeft, Plus, LayoutGrid, FileText, X } from 'lucide-react';
import { usePro } from '@/hooks/usePro';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewBuilderPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
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
    return <BuilderCreator profileId={searchParams.get('profileId')} />;
}

function BuilderCreator({ profileId }: { profileId: string | null }) {
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const createCV = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/resumes/create-blank', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create CV');
            }

            if (data.id) {
                router.push(`/builder/${data.id}`);
            } else {
                throw new Error('No ID returned from server');
            }
        } catch (err: any) {
            console.error('[BuilderCreator]', err);
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        createCV();
    }, []);

    if (error) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-[#fafafa]">
                <div className="text-center space-y-4 max-w-sm px-4">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <X className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">Creation Failed</h3>
                    <p className="text-zinc-500 text-sm">{error}</p>
                    <div className="flex flex-col gap-2">
                        <Button onClick={createCV} className="w-full bg-orange-500 hover:bg-orange-600">
                            Try Again
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/dashboard')} className="w-full">
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-100px)] items-center justify-center bg-[#fafafa]">
            <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-zinc-400 mx-auto" />
                <p className="text-zinc-500 font-medium font-sans">Initializing your new CV...</p>
            </div>
        </div>
    );
}
