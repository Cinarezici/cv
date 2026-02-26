import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: 'Unauthorized' });

        const { data: cvs } = await supabase.from('resumes').select('*').eq('user_id', user.id).limit(1);
        const cvId = cvs?.[0]?.id;

        if (!cvId) return NextResponse.json({ error: 'No CV found' });

        const payload = {
            companies: [{ url: 'https://apple.com', name: 'Apple', jobDescription: 'Test' }],
            cvId,
            jobConfigs: [{ targetRole: 'Data Scientist', tone: 'corporate', language: 'tr' }]
        };

        const res = await fetch('http://localhost:3000/api/motivation-letters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': request.headers.get('cookie') || '' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        return NextResponse.json({ status: res.status, ok: res.ok, data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
