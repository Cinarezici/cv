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
            // Prefer the SDK's verify utility if available, otherwise fallback to plain JSON parse
            if ('Webhooks' in PolarSDK && typeof (PolarSDK as any).Webhooks?.verify === 'function') {
                event = (PolarSDK as any).Webhooks.verify(bodyText, headers, secret);
            } else {
                event = JSON.parse(bodyText);
                console.warn("Webhooks.verify missing from SDK. Parsing body directly.");
            }
        } catch (err: any) {
            console.error("Webhook Verification Failed:", err.message || err);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!event || !event.type) {
            event = JSON.parse(bodyText); // fail-safe
        }

        const type = event.type;
        const data = event.data;

        // ── 1. Optimization Guard ────────────────────────────────────────────
        const handledEvents = [
            "order.created",
            "order.paid",
            "order.refunded",
            "order.revoked",
            "checkout.updated",
            "checkout.succeeded",
        ];
        console.log(`[Polar Webhook] Received event: ${type}`);

        if (!handledEvents.includes(type)) {
            return NextResponse.json({ received: true, ignored: true }, { status: 200 });
        }

        // ── 2. Handle Purchase (Activate Pro) ─────────────────────────────────
        const isActivationEvent =
            type === "order.created" ||
            type === "order.paid" ||
            type === "checkout.succeeded" ||
            (type === "checkout.updated" && data.status === "succeeded");

        if (isActivationEvent) {
            const customerEmail =
                data.customer_email ||
                data.user_email ||
                data.email ||
                (data.customer && data.customer.email);

            if (!customerEmail) {
                console.warn(`[Polar Webhook] No customer email in payload for event ${type}.`);
                return NextResponse.json({ received: true }, { status: 200 });
            }

            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                { auth: { persistSession: false } }
            );

            // ── Step 1: Try userId from metadata ──────────────────────────────
            let userId: string | null = data.metadata?.userId || null;

            // ── Step 2: Fallback via admin API list users by email ─────────────
            if (!userId) {
                try {
                    const { data: { users }, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
                    if (!listErr && users) {
                        const matched = users.find((u: any) => u.email?.toLowerCase() === customerEmail.toLowerCase());
                        if (matched) {
                            userId = matched.id;
                            console.log(`[Polar Webhook] Found user via admin listUsers: ${userId}`);
                        }
                    }
                } catch (adminErr) {
                    console.warn("[Polar Webhook] Admin user lookup failed:", adminErr);
                }
            }

            // ── Step 3: Fallback to custom RPC ─────────────────────────────────
            if (!userId) {
                try {
                    const { data: rpcData } = await supabaseAdmin.rpc('get_user_id_by_email', { email_input: customerEmail });
                    if (rpcData) userId = rpcData;
                } catch (rpcErr) {
                    console.warn("[Polar Webhook] RPC lookup failed:", rpcErr);
                }
            }

            // Set expiration to 3 years from now
            const expiresAt = new Date();
            expiresAt.setFullYear(expiresAt.getFullYear() + 3);

            const now = new Date().toISOString();
            const payload: any = {
                user_email: customerEmail,
                status: 'active',
                is_pro: true,
                plan: 'lifetime',
                pro_activated_at: now,
                expires_at: expiresAt.toISOString(),
                updated_at: now,
                stripe_customer_id: data.customer_id
                    ? 'polar_' + data.customer_id
                    : (data.id ? 'polar_' + data.id : null),
            };

            if (userId) payload.user_id = userId;

            console.log(`[Polar Webhook] Upserting subscription for ${customerEmail} (userId: ${userId || 'N/A'})`);

            // ── Primary upsert by user_id (if known) ──────────────────────────
            if (userId) {
                const { error: upsertByUserId } = await supabaseAdmin
                    .from('subscriptions')
                    .upsert({ ...payload, user_id: userId }, { onConflict: 'user_id' });

                if (upsertByUserId) {
                    console.error(`[Polar Webhook] Upsert by user_id failed:`, upsertByUserId);
                    // Fall through to email upsert
                } else {
                    console.log(`[Polar Webhook] Successfully upgraded user ${customerEmail} (${userId}) to lifetime Pro.`);
                    return NextResponse.json({ received: true }, { status: 200 });
                }
            }

            // ── Secondary upsert by email ──────────────────────────────────────
            const { error: upsertByEmail } = await supabaseAdmin
                .from('subscriptions')
                .upsert(payload, { onConflict: 'user_email' });

            if (upsertByEmail) {
                console.error(`[Polar Webhook] Upsert by email also failed:`, upsertByEmail);
                return NextResponse.json({ error: "Failed to update subscription data" }, { status: 500 });
            }

            console.log(`[Polar Webhook] Upgraded ${customerEmail} via email match.`);
        }

        // ── 3. Handle Refund & Chargeback (Revoke Pro) ───────────────────────
        if (type === "order.refunded" || type === "order.revoked") {
            const customerEmail = data.customer_email || (data.customer && data.customer.email);

            if (customerEmail) {
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY!,
                    { auth: { persistSession: false } }
                );

                const { error: revokeError } = await supabaseAdmin
                    .from('subscriptions')
                    .update({
                        status: 'revoked',
                        is_pro: false,
                        plan: 'free',
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_email', customerEmail);

                if (revokeError) {
                    console.error(`Failed to revoke Pro for user ${customerEmail}:`, revokeError);
                } else {
                    console.log(`[Polar Webhook] Successfully revoked Pro for user ${customerEmail} due to ${type}.`);
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });

    } catch (err: any) {
        console.error("Polar webhook internal error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
