import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
    // Basic auth check for Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Fetch subscriptions that are trialing or recently canceled
        const { data: subs, error } = await supabase
            .from('subscriptions')
            .select('user_id, status, trial_start, trial_expiry, users:user_id(email, current_plan)');

        if (error) throw error;

        const results = [];
        const now = new Date();

        for (const sub of subs || []) {
            const userObj = Array.isArray(sub.users) ? sub.users[0] : sub.users;
            const emailAddress = userObj?.email;

            if (!sub.trial_start || !sub.trial_expiry || !emailAddress) continue;
            
            const trialStart = new Date(sub.trial_start);
            
            const daysSinceStart = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 3600 * 24));

            // Day 7 Check-in
            if (daysSinceStart === 7 && sub.status === 'trialing') {
                await sendTemplate(emailAddress, 'How is the trial going?', `
                    <h2>Hey there!</h2>
                    <p>You're halfway through your 14-day Professional trial. Have you tried our Advanced AI Optimization yet?</p>
                    <p>It's the perfect time to optimize your CV for that dream role!</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
                `);
                results.push({ email: emailAddress, template: 'Day 7' });
            }

            // Day 13 Warning
            if (daysSinceStart === 13 && sub.status === 'trialing') {
                await sendTemplate(emailAddress, 'Your trial ends tomorrow!', `
                    <h2>Heads up!</h2>
                    <p>Your free trial of Interview Ready CV Professional ends tomorrow.</p>
                    <p>Upgrade now to keep unlimited CV creation, Advanced AI, and Watermark-free exports.</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/upgrade" style="background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Upgrade to Pro</a>
                `);
                results.push({ email: emailAddress, template: 'Day 13' });
            }

            // Exactly 1 day after expiry (Day 15)
            if (daysSinceStart === 15 && (sub.status === 'canceled' || sub.status === 'trialing')) {
                await sendTemplate(emailAddress, 'Your trial has ended.', `
                    <h2>Your trial is over.</h2>
                    <p>We hope you enjoyed using Interview Ready CV. As your trial has ended, your account limits have reverted to the Free plan.</p>
                    <p>Ready to jump back in? Upgrade to Professional today.</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/upgrade" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Upgrade Now</a>
                `);
                results.push({ email: emailAddress, template: 'Expiry' });
            }
        }

        return NextResponse.json({ success: true, processed: results.length, details: results });
    } catch (err: any) {
        console.error('Cron Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

async function sendTemplate(to: string, subject: string, htmlContent: string) {
    if (!process.env.RESEND_API_KEY) return;
    
    await resend.emails.send({
        from: 'Support <onboarding@resend.dev>',
        to,
        subject,
        html: `
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.5;">
                ${htmlContent}
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 40px;" />
                <p style="font-size: 12px; color: #999;">Interview Ready CV | You can update your preferences in your account.</p>
            </div>
        `
    });
}
