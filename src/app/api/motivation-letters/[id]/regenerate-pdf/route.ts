import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateLetterPDF } from '@/lib/pdf-generator';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
        const isPro = ['active'].includes(sub?.status as string);
        if (!isPro) {
            return NextResponse.json({ error: 'upgrade_required', message: 'PDF regeneration is a Pro feature' }, { status: 403 });
        }

        const { templateId } = await request.json() as { templateId?: string };

        // Get Letter
        const { data: letter } = await supabase.from('motivation_letters').select('*').eq('id', id).eq('user_id', user.id).single();
        if (!letter) {
            return NextResponse.json({ error: 'Letter not found' }, { status: 404 });
        }

        // Get Base CV Data
        let resumeJSON: any = null;
        if (letter.cv_id) {
            const { data: cv } = await supabase.from('resumes').select('optimized_json').eq('id', letter.cv_id).single();
            if (cv) resumeJSON = cv.optimized_json;
        }
        if (!resumeJSON) {
            const { data: profiles } = await supabase.from('profiles').select('raw_json').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
            if (profiles && profiles[0]) {
                const { mapToResumeJSON } = await import('@/lib/resume-mapper');
                resumeJSON = mapToResumeJSON(profiles[0].raw_json);
            }
        }

        if (!resumeJSON) {
            return NextResponse.json({ error: 'Base CV / Profile is missing' }, { status: 400 });
        }

        // Remove old PDF if exists
        if (letter.pdf_storage_path) {
            await supabase.storage.from('user-files').remove([letter.pdf_storage_path]);
        }

        // Generate new PDF
        const activeTemplate = templateId || letter.pdf_template_id || 'modern';

        const { pdfUrl, pdfStoragePath } = await generateLetterPDF(
            letter.letter_html,
            resumeJSON,
            letter.company_name,
            letter.target_role,
            activeTemplate,
            user.id,
            letter.id,
            true // isPro is true if they reached here due to the check on line 16
        );

        // Update DB
        const { data: updated, error } = await supabase.from('motivation_letters').update({
            pdf_url: pdfUrl,
            pdf_storage_path: pdfStoragePath,
            pdf_template_id: activeTemplate,
            pdf_generated_at: new Date().toISOString()
        }).eq('id', id).select().single();

        if (error) throw error;

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error('PDF Regenerate Error:', error);
        return NextResponse.json({ error: 'Failed to regenerate PDF' }, { status: 500 });
    }
}
