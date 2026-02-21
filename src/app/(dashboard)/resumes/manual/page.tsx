"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function ManualResumePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [summary, setSummary] = useState('');
    const [experience, setExperience] = useState('');
    const [education, setEducation] = useState('');
    const [skills, setSkills] = useState('');

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
                raw_json: rawJson
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
                <h1 className="text-3xl font-bold text-zinc-900">Create Manual CV</h1>
                <p className="text-zinc-500 mt-2">Enter your details directly below to build your resume.</p>
            </div>

            <div className="space-y-6">

                {/* Professional Summary */}
                <Card className="border border-zinc-200 shadow-sm rounded-xl">
                    <CardContent className="pt-6 space-y-2">
                        <label className="text-sm font-bold text-zinc-900">
                            Professional Summary <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-zinc-500">A brief overview of your experience and skills</p>
                        <Textarea
                            className="bg-zinc-50 border-zinc-200 min-h-[120px] resize-y mt-2 focus-visible:ring-indigo-500"
                            placeholder="Experienced software engineer with 5+ years..."
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Experience */}
                <Card className="border border-zinc-200 shadow-sm rounded-xl">
                    <CardContent className="pt-6 space-y-2">
                        <label className="text-sm font-bold text-zinc-900">
                            Experience
                        </label>
                        <p className="text-xs text-zinc-500">Separate each role with a blank line</p>
                        <Textarea
                            className="bg-zinc-50 border-zinc-200 min-h-[160px] font-mono text-sm resize-y mt-2 focus-visible:ring-indigo-500"
                            placeholder="Senior Developer at Company A (2020-Present) - Led team of 5 engineers - Built scalable microservices&#10;&#10;Developer at Company B (2018-2020) - Developed frontend applications"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Education */}
                <Card className="border border-zinc-200 shadow-sm rounded-xl">
                    <CardContent className="pt-6 space-y-2">
                        <label className="text-sm font-bold text-zinc-900">
                            Education
                        </label>
                        <p className="text-xs text-zinc-500">Separate each degree with a blank line</p>
                        <Textarea
                            className="bg-zinc-50 border-zinc-200 min-h-[100px] font-mono text-sm resize-y mt-2 focus-visible:ring-indigo-500"
                            placeholder="Bachelor of Science in Computer Science University Name, 2018"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Skills */}
                <Card className="border border-zinc-200 shadow-sm rounded-xl mb-8">
                    <CardContent className="pt-6 space-y-2">
                        <label className="text-sm font-bold text-zinc-900">
                            Skills
                        </label>
                        <p className="text-xs text-zinc-500">Comma-separated list</p>
                        <Textarea
                            className="bg-zinc-50 border-zinc-200 min-h-[80px] resize-y mt-2 focus-visible:ring-indigo-500"
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
                        className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 h-12 rounded-lg font-semibold text-base"
                    >
                        {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</> : "Save CV Data"}
                    </Button>
                </div>

            </div>
        </div>
    );
}
