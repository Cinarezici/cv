"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { usePro } from '@/hooks/usePro';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ManualResumePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [summary, setSummary] = useState('');
    const [experience, setExperience] = useState('');
    const [education, setEducation] = useState('');
    const [skills, setSkills] = useState('');

    const { isPro, isLoading: proLoading } = usePro();

    if (proLoading) {
        return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-zinc-400 w-7 h-7" /></div>;
    }

    if (!isPro) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <Link href="/import" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 transition-colors mb-8 font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Import
                </Link>

                <Card className="border-0 shadow-2xl max-w-2xl mx-auto bg-white rounded-3xl overflow-hidden">
                    <div className="bg-indigo-600 p-8 text-center text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles className="w-24 h-24" />
                        </div>
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md text-white rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-xl">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Pro Feature</h2>
                        <p className="text-indigo-100 text-lg">Detailed Manual Entry is a Premium feature.</p>
                    </div>
                    <CardContent className="p-10 text-center space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-zinc-900">Why go Pro?</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto">
                                <li className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</div>
                                    Full Manual Editor
                                </li>
                                <li className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</div>
                                    AI-powered suggestions
                                </li>
                                <li className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</div>
                                    LinkedIn Import
                                </li>
                                <li className="flex items-center gap-3 text-sm font-semibold text-zinc-700">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">✓</div>
                                    Unlimited CVs
                                </li>
                            </ul>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <Button
                                onClick={() => window.location.href = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL!}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 font-bold text-xl rounded-2xl shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Upgrade to Pro
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/import')}
                                className="text-zinc-500 font-bold h-12"
                            >
                                Use Free Import Options
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleGenerate = async () => {
        if (!summary.trim()) {
            toast.error("Professional Summary is required");
            return;
        }

        setLoading(true);
        try {
            // First, just save the raw text to our AI layout parsing endpoint
            // Or directly save it as a new profile inside Supabase, then redirect to the preview
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("You must be logged in");
                return;
            }

            // Simple parser logic (Usually this would go to an LLM to build a perfect structurally valid JSON)
            // For now we will structure it roughly into our ResumeData format
            const parsedExperience = experience.split('\n\n').filter(Boolean).map(ex => {
                const lines = ex.split('\n');
                return {
                    title: lines[0] || 'Unknown Title',
                    company: 'Unknown',
                    start_date: '',
                    end_date: '',
                    bullets: lines.slice(1).filter(Boolean)
                };
            });

            const parsedEducation = education.split('\n\n').filter(Boolean).map(ed => {
                return {
                    degree: ed,
                    school: 'Unknown',
                    year: ''
                };
            });

            const rawJson = {
                name: user.email?.split('@')[0] || "My Resume",
                summary: summary,
                experience: parsedExperience,
                education: parsedEducation,
                skills: skills.split(',').map(s => s.trim()).filter(Boolean)
            };

            const profileName = `Manual Profile - ${new Date().toLocaleDateString()}`;

            const { data: profile, error } = await supabase.from('profiles').insert({
                user_id: user.id,
                full_name: profileName,
                headline: 'Manual CV',
                raw_json: rawJson,
                updated_at: new Date().toISOString()
            }).select().single();

            if (error) throw error;

            toast.success("CV Data Saved!");
            // Redirect to dashboard or optimization screen
            router.push('/dashboard');

        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to save CV");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Create Manual CV</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">Enter your details directly below to build your resume.</p>
            </div>

            <div className="space-y-6">

                {/* Professional Summary */}
                <Card className="border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm rounded-xl">
                    <CardContent className="pt-6 space-y-2">
                        <label className="text-sm font-bold text-zinc-900 dark:text-white">
                            Professional Summary <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">A brief overview of your experience and skills</p>
                        <Textarea
                            className="bg-zinc-50 dark:bg-transparent border-zinc-200 dark:border-white/20 dark:text-white dark:placeholder:text-zinc-500 min-h-[120px] resize-y mt-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                            placeholder="Experienced software engineer with 5+ years..."
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Experience */}
                <Card className="border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm rounded-xl">
                    <CardContent className="pt-6 space-y-2">
                        <label className="text-sm font-bold text-zinc-900 dark:text-white">
                            Experience
                        </label>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Separate each role with a blank line</p>
                        <Textarea
                            className="bg-zinc-50 dark:bg-transparent border-zinc-200 dark:border-white/20 dark:text-white dark:placeholder:text-zinc-500 min-h-[160px] font-mono text-sm resize-y mt-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                            placeholder="Senior Developer at Company A (2020-Present) - Led team of 5 engineers - Built scalable microservices&#10;&#10;Developer at Company B (2018-2020) - Developed frontend applications"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Education */}
                <Card className="border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm rounded-xl">
                    <CardContent className="pt-6 space-y-2">
                        <label className="text-sm font-bold text-zinc-900 dark:text-white">
                            Education
                        </label>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Separate each degree with a blank line</p>
                        <Textarea
                            className="bg-zinc-50 dark:bg-transparent border-zinc-200 dark:border-white/20 dark:text-white dark:placeholder:text-zinc-500 min-h-[100px] font-mono text-sm resize-y mt-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                            placeholder="Bachelor of Science in Computer Science University Name, 2018"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Skills */}
                <Card className="border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm rounded-xl mb-8">
                    <CardContent className="pt-6 space-y-2">
                        <label className="text-sm font-bold text-zinc-900 dark:text-white">
                            Skills
                        </label>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Comma-separated list</p>
                        <Textarea
                            className="bg-zinc-50 dark:bg-transparent border-zinc-200 dark:border-white/20 dark:text-white dark:placeholder:text-zinc-500 min-h-[80px] resize-y mt-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                            placeholder="JavaScript, React, Node.js, Python, AWS"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end pt-4 pb-12">
                    <Button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-8 h-12 rounded-lg font-semibold text-base"
                    >
                        {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</> : "Save CV Data"}
                    </Button>
                </div>

            </div>
        </div>
    );
}
