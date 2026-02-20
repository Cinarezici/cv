import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Zap, Upload, FileSignature, Sparkles, FileText } from 'lucide-react';
import { ShareResumeDialog } from '@/components/ShareResumeDialog';
import { DeleteButton } from '@/components/DeleteButton';

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

    const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

    const planName = sub?.status === 'active' ? 'Pro' : 'Free';
    const profileCompleteness = profiles && profiles.length > 0 ? "100%" : "0%";

    return (
        <div className="max-w-6xl mx-auto space-y-8 bg-zinc-50 min-h-screen text-zinc-900 pb-16">
            {/* Header Section */}
            <div className="flex justify-between items-start pt-8 pb-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
                    <p className="text-zinc-500 mt-1">Welcome back, let's land your next job.</p>
                </div>
                <Link href="/upgrade">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 font-semibold shadow-sm flex items-center gap-2">
                        <Zap className="w-4 h-4 fill-current" />
                        Upgrade Pro
                    </Button>
                </Link>
            </div>

            {/* Banner Card */}
            <Card className="border-0 shadow-sm bg-zinc-100 rounded-xl overflow-hidden">
                <CardContent className="p-8">
                    <h2 className="text-xl font-bold mb-2">Welcome to CV Optimizer! 🚀</h2>
                    <p className="text-zinc-600 mb-6 font-medium">
                        To get started, we need to import your professional experience.<br />
                        Import your LinkedIn profile or PDF to automatically generate ATS-friendly CVs.
                    </p>
                    <Link href="/import">
                        <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg px-6 flex items-center gap-2 shadow-md">
                            <Upload className="w-4 h-4" />
                            Import Profile Now
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border shadow-sm rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-zinc-600">Total CV Versions</CardTitle>
                        <FileText className="h-4 w-4 text-zinc-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{resumes?.length || 0}</div>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">Optimized versions created</p>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-zinc-600">Plan Status</CardTitle>
                        <div className="h-4 w-4 bg-zinc-200 rounded-sm"></div> {/* Mock icon for card */}
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{planName}</div>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">Limited Access</p>
                    </CardContent>
                </Card>

                <Card className="border shadow-sm rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-zinc-600">Profile Score</CardTitle>
                        <span className="text-zinc-400">↗</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{profileCompleteness}</div>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">Profile completeness</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/import" className="group">
                    <Card className="border shadow-sm rounded-xl h-full transition-shadow hover:shadow-md cursor-pointer flex flex-col justify-start">
                        <CardHeader>
                            <Upload className="h-6 w-6 mb-2 text-zinc-700 group-hover:text-black transition-colors" />
                            <CardTitle className="text-lg font-bold">Import / Update Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-500 font-medium">
                                Refresh your data from LinkedIn or PDF. <br /> Keep your base information up to date to ensure generated CVs are accurate.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/resumes/base" className="group">
                    <Card className="border shadow-sm rounded-xl h-full transition-shadow hover:shadow-md cursor-pointer flex flex-col justify-start">
                        <CardHeader>
                            <FileSignature className="h-6 w-6 mb-2 text-zinc-700 group-hover:text-black transition-colors" />
                            <CardTitle className="text-lg font-bold">Create Base CV</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-500 font-medium">
                                Generate a standard ATS-friendly CV. <br /> Create a general purpose resume from your profile data without specific job optimization.
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/resumes/new" className="group">
                    <Card className="border shadow-sm rounded-xl h-full transition-shadow hover:shadow-md cursor-pointer flex flex-col justify-start">
                        <CardHeader>
                            <Sparkles className="h-6 w-6 mb-2 text-zinc-700 group-hover:text-black transition-colors" />
                            <CardTitle className="text-lg font-bold">Optimize for Job</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-500 font-medium">
                                Tailor your CV for a specific role. <br /> Paste a job description... keyword optimization.
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Recent CVs */}
            <section className="pt-8">
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Recent CVs</h2>
                {!resumes || resumes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl border-zinc-300">
                        <FileText className="h-10 w-10 text-zinc-300 mb-4" />
                        <h3 className="text-lg font-bold text-zinc-700">No CVs generated yet</h3>
                        <p className="text-zinc-500 font-medium text-sm mt-1">Check out the options above to create your first optimized resume.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* We use the mapping from the original layout but with new style */}
                        {resumes.map((resume: any) => (
                            <Card key={resume.id} className="border shadow-sm rounded-xl flex flex-col hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="line-clamp-2 text-lg">{resume.job_title || 'Untitled Resume'}</CardTitle>
                                        {resume.is_active ?
                                            <Badge variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0">Active</Badge> :
                                            <Badge variant="destructive" className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-0">Inactive</Badge>}
                                    </div>
                                    <CardDescription className="text-zinc-500">Slug: {resume.public_link_slug}</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto space-y-3 pt-4">
                                    <div className="flex gap-2">
                                        <Link href={`/r/${resume.public_link_slug}`} target="_blank" className="flex-1">
                                            <Button variant="outline" className="w-full font-semibold">View Page</Button>
                                        </Link>
                                        <ShareResumeDialog slug={resume.public_link_slug} />
                                        <DeleteButton id={resume.id} type="resumes" />
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
