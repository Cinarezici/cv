import { NextRequest, NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";
import { createClient } from "@/lib/supabase/server";

const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const productId = body.productId || process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID;

        if (!productId) {
            return NextResponse.json(
                { error: "productId is required" },
                { status: 400 }
            );
        }

        const checkout = await polar.checkouts.create({
            products: [productId],
            successUrl: process.env.POLAR_SUCCESS_URL || "http://localhost:3000/billing/success?checkout_id={CHECKOUT_ID}",
            customerId: user.id, // Optional: tracking the user ID
            customerEmail: user.email, // Optional: pre-filling the user's email
        });

        return NextResponse.json({ url: checkout.url });
    } catch (error: any) {
        console.error("Polar checkout error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
