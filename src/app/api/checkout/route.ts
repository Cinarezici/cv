import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {} as any);
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { planId } = body;

        let priceId = '';
        
        // Map abstract plan IDs to Stripe Price IDs from env
        if (planId === 'starter_monthly') {
            priceId = process.env.STRIPE_PRICE_STARTER!;
        } else if (planId === 'professional_yearly') {
            priceId = process.env.STRIPE_PRICE_PROFESSIONAL!;
        } else if (planId === 'lifetime_onetime') {
            priceId = process.env.STRIPE_PRICE_LIFETIME!;
        }

        if (!priceId) {
            return NextResponse.json(
                { error: "Invalid planId or missing Stripe Price ID in env" },
                { status: 400 }
            );
        }

        const isRecurring = planId !== 'lifetime_onetime';

        // Custom checkout flow
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: isRecurring ? 'subscription' : 'payment',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?checkout_success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
            customer_email: user.email,
            client_reference_id: user.id,
            metadata: {
                userId: user.id,
                planId: planId
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
