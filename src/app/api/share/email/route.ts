import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email, subject, cvLink, message } = await request.json();

        if (!email || !cvLink) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Interview Ready CV <onboarding@resend.dev>',
            to: [email],
            subject: subject || 'Check out my optimized Resume!',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Hello!</h2>
                    <p>${message || 'I wanted to share my newly optimized resume with you.'}</p>
                    <div style="margin: 30px 0;">
                        <a href="${cvLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            View My Resume
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Or copy this link: <a href="${cvLink}">${cvLink}</a></p>
                </div>
            `,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Email error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
