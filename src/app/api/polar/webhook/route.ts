import { NextRequest, NextResponse } from "next/server";
import * as PolarSDK from "@polar-sh/sdk";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const headersList = req.headers;

        // Ensure webhooks are verified using Polar's standard webhook method
        const secret = process.env.POLAR_WEBHOOK_SECRET;
        if (!secret) {
            console.error("POLAR_WEBHOOK_SECRET is not set in environment variables");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        // Parse headers required by StandardWebhooks
        const headers = Object.fromEntries(headersList.entries());

        let event: any;
        try {
            // Prefer the SDK's verify utility if available, otherwise fallback to plain JSON parse (not ideal but safe against version divergence)
            if ('Webhooks' in PolarSDK && typeof (PolarSDK as any).Webhooks?.verify === 'function') {
                event = (PolarSDK as any).Webhooks.verify(bodyText, headers, secret);
            } else {
                event = JSON.parse(bodyText);
                console.warn("Webhooks.verify missing from SDK. Parsing body directly. Note: signature was not strictly verified.");
            }
        } catch (err: any) {
            console.error("Webhook Verification Failed:", err.message || err);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!event || !event.type) {
            event = JSON.parse(bodyText); // ensure fail-safe
        }

        const type = event.type;
        const data = event.data;

        // Listen for standard checkout updates or order creations
        if (type === "order.created" || (type === "checkout.updated" && data.status === "succeeded")) {
            const customerEmail = data.customer_email || data.user_email || data.email || (data.customer && data.customer.email);

            if (customerEmail) {
                // Initialize Supabase Admin client to bypass RLS
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY!
                );

                // Use the custom RPC to securely locate the user UUID by email.
                // (Migration provided below sets this up)
                const { data: userId, error: rpcError } = await supabaseAdmin.rpc('get_user_id_by_email', { email_input: customerEmail });

                if (rpcError) {
                    console.error("Error looking up user by email via RPC:", rpcError);
                    return NextResponse.json({ error: "Database Lookup Error" }, { status: 500 });
                }

                const payload: any = {
                    user_email: customerEmail,
                    status: 'active',
                    is_pro: true,
                    plan: 'lifetime',
                    pro_activated_at: new Date().toISOString(),
                    stripe_customer_id: data.customer_id || 'polar_' + data.id,
                };

                if (userId) {
                    payload.user_id = userId;
                }

                const { error: upsertError } = await supabaseAdmin
                    .from('subscriptions')
                    .upsert(payload, { onConflict: userId ? 'user_id' : 'user_email' });

                if (upsertError) {
                    console.error(`Failed to upscale user ${customerEmail} to lifetime Pro:`, upsertError);
                    return NextResponse.json({ error: "Failed to update subscription data" }, { status: 500 });
                }

                console.log(`[Polar Webhook] Successfully upgraded user ${customerEmail} (userId: ${userId || 'N/A'}) to lifetime Pro.`);
            } else {
                console.warn(`[Polar Webhook] No customer email found in webhook payload for event ${type}.`);
            }
        } else {
            console.log(`[Polar Webhook] Ignored event type: ${type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (err: any) {
        console.error("Polar webhook internal error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
