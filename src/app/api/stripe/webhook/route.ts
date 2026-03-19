import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123');

export async function POST(request: NextRequest) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch {
        return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Helper to map a Stripe Price ID back to our internal plan strings
    const getPlanFromPriceId = (priceId: string) => {
        if (priceId === process.env.STRIPE_PRICE_STARTER) return 'starter_monthly';
        if (priceId === process.env.STRIPE_PRICE_PROFESSIONAL) return 'professional_yearly';
        if (priceId === process.env.STRIPE_PRICE_LIFETIME) return 'lifetime_onetime';
        return 'free';
    };

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const userEmail = session.customer_details?.email || '';
            const planId = session.metadata?.planId || 'free';

            if (userId) {
                // If it's a one-time lifetime payment, activate immediately
                if (session.mode === 'payment' && planId === 'lifetime_onetime') {
                    await supabase
                        .from('subscriptions')
                        .upsert({
                            user_id: userId,
                            user_email: userEmail,
                            stripe_customer_id: session.customer as string,
                            status: 'active',
                            is_pro: true,
                            plan: 'lifetime_onetime',
                            trial_active: false,
                        }, { onConflict: 'user_id' });
                } else if (session.mode === 'subscription') {
                    // For subscriptions, we can also set them active immediately or wait for customer.subscription.created
                    await supabase
                        .from('subscriptions')
                        .upsert({
                            user_id: userId,
                            user_email: userEmail,
                            stripe_customer_id: session.customer as string,
                            status: 'active',
                            is_pro: planId !== 'free',
                            plan: planId,
                            trial_active: false,
                        }, { onConflict: 'user_id' });
                }
            }
        }

        if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
            const sub = event.data.object as Stripe.Subscription;
            const stripeCustomerId = sub.customer as string;
            const priceId = sub.items.data[0]?.price.id;
            const planId = getPlanFromPriceId(priceId);

            // Update matching subscription record by customer ID
            await supabase
                .from('subscriptions')
                .update({ 
                    status: sub.status === 'active' || sub.status === 'trialing' ? 'active' : sub.status,
                    plan: planId,
                    is_pro: planId !== 'free'
                })
                .eq('stripe_customer_id', stripeCustomerId);
        }

        if (event.type === 'customer.subscription.deleted') {
            const sub = event.data.object as Stripe.Subscription;
            const stripeCustomerId = sub.customer as string;

            // Fetch user email to send downgrade notification
            const { data: existingSub } = await supabase
                .from('subscriptions')
                .select('user_email')
                .eq('stripe_customer_id', stripeCustomerId)
                .single();

            await supabase
                .from('subscriptions')
                .update({ status: 'expired', is_pro: false, plan: 'free' })
                .eq('stripe_customer_id', stripeCustomerId);

            if (existingSub?.user_email && process.env.RESEND_API_KEY) {
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: 'Support <onboarding@resend.dev>',
                    to: existingSub.user_email,
                    subject: 'Your Interview Ready CV subscription has ended',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.5;">
                            <h2>Subscription Canceled</h2>
                            <p>We're sorry to see you go. Your Interview Ready CV subscription has expired and your account has reverted to the Free plan.</p>
                            <p>You can upgrade again at any time.</p>
                        </div>
                    `
                }).catch(console.error);
            }
        }
    } catch (e: any) {
        console.error("Webhook processing error:", e);
        return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
