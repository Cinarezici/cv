import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ShareResumeDialog } from '@/components/ShareResumeDialog';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) redirect('/login');

    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Link href="/import">
                    <Button>Import LinkedIn Profile</Button>
                </Link>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Your Profiles</h2>
                {!profiles || profiles.length === 0 ? (
                    <div className="p-8 text-center border rounded-lg bg-zinc-900/50 border-zinc-800">
                        <p className="text-gray-500">No profiles imported yet. Click the button above to start.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profiles.map((profile: any) => (
                            <Card key={profile.id}>
                                <CardHeader>
                                    <CardTitle>{profile.full_name}</CardTitle>
                                    <CardDescription className="truncate">{profile.headline}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Link href={`/resumes/new?profileId=${profile.id}`}>
                                        <Button variant="outline" className="w-full">Create Tailored Resume</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Generated Tailored Resumes</h2>
                {!resumes || resumes.length === 0 ? (
                    <div className="p-8 text-center border rounded-lg bg-zinc-900/50 border-zinc-800">
                        <p className="text-gray-500">No resumes generated yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resumes.map((resume: any) => (
                            <Card key={resume.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="line-clamp-2">{resume.job_title || 'Untitled Resume'}</CardTitle>
                                        {resume.is_active ?
                                            <Badge variant="default">Active</Badge> :
                                            <Badge variant="destructive">Inactive</Badge>}
                                    </div>
                                    <CardDescription>Slug: {resume.public_link_slug}</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto space-y-3">
                                    <div className="flex gap-2">
                                        <Link href={`/r/${resume.public_link_slug}`} target="_blank" className="flex-1">
                                            <Button variant="secondary" className="w-full">View Public Page</Button>
                                        </Link>
                                        <ShareResumeDialog slug={resume.public_link_slug} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
