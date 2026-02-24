import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single();
        if (sub?.status !== 'active') {
            return NextResponse.json({ error: 'upgrade_required', message: 'Batch downloading is a Pro feature' }, { status: 403 });
        }

        const { letterIds } = await request.json() as { letterIds: string[] };
        if (!letterIds || letterIds.length === 0) {
            return NextResponse.json({ error: 'No letters selected' }, { status: 400 });
        }

        const { data: letters } = await supabase
            .from('motivation_letters')
            .select('*')
            .in('id', letterIds)
            .eq('user_id', user.id);

        if (!letters || letters.length === 0) {
            return NextResponse.json({ error: 'Letters not found' }, { status: 404 });
        }

        const zip = new JSZip();

        for (const letter of letters) {
            if (letter.pdf_url) {
                try {
                    const res = await fetch(letter.pdf_url);
                    if (res.ok) {
                        const arrayBuffer = await res.arrayBuffer();
                        zip.file(letter.pdf_filename || `Letter_${letter.company_name}.pdf`, arrayBuffer);
                    }
                } catch (e) {
                    console.error('Failed to download PDF for zip:', letter.id);
                }
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });

        return new NextResponse(zipBlob, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="motivation-letters.zip"',
            },
        });

    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create batch zip' }, { status: 500 });
    }
}
