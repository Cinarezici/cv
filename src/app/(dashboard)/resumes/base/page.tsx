"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function BaseResumePage() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProfiles = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
                setProfiles(data || []);
            }
            setLoading(false);
        };
        fetchProfiles();
    }, []);

    const handleCreateBaseCv = async (profileId: string) => {
        setGeneratingId(profileId);
        setError(null);

        try {
            // We use the same optimize endpoint but without job description
            // The AI will just format it nicely.
            const res = await fetch('/api/ai/optimize-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId, jobDescription: "General standard standard resume without specific targeted keywords. Make it professional." }),
            });

            if (!res.ok) {
                throw new Error('Failed to generate base resume');
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
            setGeneratingId(null);
        }
    };

    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Create Base CV</h1>
            <p className="text-zinc-500 font-medium">Select a profile to generate a standard, ATS-friendly CV from scratch.</p>

            {error && <div className="text-rose-600 bg-rose-50 p-4 rounded-lg text-sm mb-4">{error}</div>}

            {profiles.length === 0 ? (
                <Card className="border shadow-sm items-center text-center p-8 bg-zinc-50">
                    <p className="text-zinc-500 font-medium mb-4">You don't have any profiles yet.</p>
                    <Button onClick={() => router.push('/import')} className="bg-indigo-600 hover:bg-indigo-700">Import Profile</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profiles.map(p => (
                        <Card key={p.id} className="border shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">{p.full_name}</CardTitle>
                                <CardDescription className="text-zinc-500 truncate">{p.headline}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={() => handleCreateBaseCv(p.id)}
                                    disabled={generatingId !== null}
                                    className="w-full bg-zinc-900 hover:bg-zinc-800"
                                >
                                    {generatingId === p.id ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><Plus className="w-4 h-4 mr-2" /> Generate General CV</>}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
