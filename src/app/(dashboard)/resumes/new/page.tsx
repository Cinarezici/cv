"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function NewResumeForm() {
    const searchParams = useSearchParams();
    const profileId = searchParams.get('profileId');
    const [jd, setJd] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    if (!profileId) {
        return <div className="p-8">Error: No Profile selected. Please go back to Dashboard.</div>;
    }

    const handleOptimize = async () => {
        if (!jd.trim()) {
            setError("Provide a Job Description.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/ai/optimize-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId, jobDescription: jd }),
            });

            if (!res.ok) {
                throw new Error('Failed to optimize resume');
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Tailor your Resume</CardTitle>
                <CardDescription>
                    Paste the Job Description for the role you're applying for.
                    Our AI will optimize your experience bullets to match the employer's needs.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="Paste Job Description here..."
                    className="min-h-[400px] resize-y"
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button onClick={handleOptimize} disabled={loading} className="w-full sm:w-auto">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            AI is tailoring your resume...
                        </>
                    ) : "Optimize Resume"}
                </Button>
            </CardContent>
        </Card>
    );
}

export default function NewResumePage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <Suspense fallback={<div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>}>
                <NewResumeForm />
            </Suspense>
        </div>
    );
}
