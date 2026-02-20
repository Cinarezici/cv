import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { PrintButton } from '@/components/PrintButton';

export default async function PublicResumePage({ params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createClient();
    const { slug } = await params;

    // 1. Resume'yu bul
    const { data: resume } = await supabase
        .from('resumes')
        .select('*')
        .eq('public_link_slug', slug)
        .eq('is_active', true)
        .single();

    if (!resume) notFound();

    // 2. Abonelik kontrolü
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', resume.user_id)
        .single();

    // 2.1 Hesabın ne zaman açıldığını tahmini olarak profile ya da resume üzerinden bulalım
    const { data: profile } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('user_id', resume.user_id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

    const accountCreationDate = profile ? new Date(profile.created_at) : new Date(resume.created_at);
    const trialEndDate = new Date(accountCreationDate.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 Days
    const now = new Date();

    const hasActiveSub = subscription?.status === 'active';
    const trialTimeRemaining = now < trialEndDate;

    // Eğer aktif aboneliği yoksa ve 14 günü geçmişse linki kapat ve ana sayfaya yönlendir
    if (!hasActiveSub && !trialTimeRemaining) {
        redirect('/');
    }

    // 3. Resume'yu göster
    const data = resume.optimized_json;

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 font-sans bg-white min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">{data.name}</h1>
                {data.headline && <p className="text-xl text-gray-600 mt-2">{data.headline}</p>}
                <div className="flex gap-4 text-sm text-gray-500 mt-4 flex-wrap">
                    {data.email && <span>{data.email}</span>}
                    {data.phone && <span>{data.phone}</span>}
                    {data.location && <span>{data.location}</span>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-100 pb-2 mb-4">Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{data.summary}</p>
                </section>
            )}

            {/* Experience */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-100 pb-2 mb-6">Experience</h2>
                {data.experience?.map((exp: any, i: number) => (
                    <div key={i} className="mb-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{exp.title}</h3>
                                <p className="text-gray-600 font-medium">{exp.company} {exp.location && `· ${exp.location}`}</p>
                            </div>
                            <span className="text-sm text-gray-500 font-medium mt-1 sm:mt-0">
                                {exp.start_date} – {exp.end_date}
                            </span>
                        </div>
                        <ul className="mt-4 space-y-2">
                            {exp.bullets?.map((bullet: string, j: number) => (
                                <li key={j} className="text-gray-700 pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                                    {bullet}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-100 pb-2 mb-6">Education</h2>
                {data.education?.map((edu: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between mb-4">
                        <div>
                            <p className="font-semibold text-gray-900">{edu.degree}</p>
                            <p className="text-gray-600">{edu.school}</p>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">{edu.year}</span>
                    </div>
                ))}
            </section>

            {/* Skills */}
            <section>
                <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-100 pb-2 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {data.skills?.map((skill: string, i: number) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-sm px-4 py-1.5 rounded-full font-medium">
                            {skill}
                        </span>
                    ))}
                </div>
            </section>

            <PrintButton data={data} />
        </div>
    );
}
