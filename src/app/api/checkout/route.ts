import { NextRequest, NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";



export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { planId } = body;

        let productId = '';
        
        // Map abstract plan IDs to Polar Product IDs from env
        if (planId === 'starter_monthly') {
            productId = process.env.POLAR_PRODUCT_ID_STARTER!;
        } else if (planId === 'professional_yearly') {
            productId = process.env.POLAR_PRODUCT_ID_PROFESSIONAL!;
        } else if (planId === 'lifetime_onetime') {
            productId = process.env.POLAR_PRODUCT_ID_LIFETIME!;
        }

        if (!productId) {
            return NextResponse.json(
                { error: "Invalid planId or missing Polar Product ID in env" },
                { status: 400 }
            );
        }

        const polar = new Polar({
            accessToken: process.env.POLAR_ACCESS_TOKEN || "",
        });

        // Generate checkout URL using Polar SDK
        const result = await polar.checkouts.create({
            products: [productId],
            successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?checkout_success=true`,
            customerEmail: user.email!,
            metadata: {
                userId: user.id,
                planId: planId
            }
        });

        return NextResponse.json({ url: result.url });
    } catch (error: any) {
        console.error("Polar checkout error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
