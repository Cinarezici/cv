import { NextRequest, NextResponse } from "next/server";
import { validateEvent } from "@polar-sh/sdk/webhooks";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers);
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    let payload;
    try {
        payload = validateEvent(body, headers, webhookSecret);
    } catch (err: any) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        switch (payload.type) {
            case "checkout.created":
            case "checkout.updated":
                // We can log these or ignore them
                break;

            case "subscription.created":
            case "subscription.updated":
            case "subscription.active": {
                const sub = payload.data;
                const metadata = sub.metadata as any;
                const userId = metadata?.userId;
                const planId = metadata?.planId;

                if (userId) {
                    await supabase
                        .from('subscriptions')
                        .upsert({
                            user_id: userId,
                            status: sub.status === 'active' || sub.status === 'trialing' ? 'active' : sub.status,
                            plan: planId || 'starter_monthly',
                            is_pro: true,
                            polar_subscription_id: sub.id,
                            polar_customer_id: sub.customerId,
                            trial_active: sub.status === 'trialing',
                            trial_start: sub.trialStart || null,
                            trial_expiry: sub.trialEnd || null,
                        }, { onConflict: 'user_id' });
                }
                break;
            }

            case "subscription.revoked":
            case "subscription.canceled": {
                const sub = payload.data;
                const { data: existingSub } = await supabase
                    .from('subscriptions')
                    .select('user_email, user_id')
                    .eq('polar_subscription_id', sub.id)
                    .single();

                await supabase
                    .from('subscriptions')
                    .update({ status: 'expired', is_pro: false, plan: 'free' })
                    .eq('polar_subscription_id', sub.id);

                // Send Downgrade Email
                const userEmail = existingSub?.user_email;
                if (userEmail && process.env.RESEND_API_KEY) {
                    await resend.emails.send({
                        from: 'Support <onboarding@resend.dev>',
                        to: userEmail,
                        subject: 'Your Interview Ready CV subscription has ended',
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.5;">
                                <h2>Subscription Canceled</h2>
                                <p>Your Interview Ready CV subscription has expired and your account has reverted to the Free plan.</p>
                                <p>You can upgrade again at any time to regain full access.</p>
                            </div>
                        `
                    }).catch(console.error);
                }
                break;
            }

            case "order.created": {
                const order = payload.data;
                const metadata = (order as any).metadata; // Order metadata if exists
                const userId = metadata?.userId;
                const planId = metadata?.planId;

                // Handle Lifetime one-time payment
                if (userId && planId === 'lifetime_onetime') {
                    await supabase
                        .from('subscriptions')
                        .upsert({
                            user_id: userId,
                            status: 'active',
                            plan: 'lifetime_onetime',
                            is_pro: true,
                            polar_customer_id: order.customerId,
                            trial_active: false,
                        }, { onConflict: 'user_id' });
                }
                break;
            }
        }
    } catch (err: any) {
        console.error("Webhook processing error:", err);
        return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
