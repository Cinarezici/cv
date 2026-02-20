import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

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

    // Service role client — bypasses RLS
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const userEmail = session.customer_details?.email || '';

        if (userId) {
            await supabase
                .from('subscriptions')
                .upsert({
                    user_id: userId,
                    stripe_customer_id: session.customer as string,
                    status: 'active',
                    trial_end: null,
                    user_email: userEmail
                }, { onConflict: 'user_id' });
        }
    }

    if (event.type === 'customer.subscription.deleted') {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
            .from('subscriptions')
            .update({ status: 'expired' })
            .eq('stripe_customer_id', sub.customer as string);
    }

    return NextResponse.json({ received: true });
}
