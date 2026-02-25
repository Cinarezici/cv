import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({
        hasPolarWebhookSecret: Boolean(process.env.POLAR_WEBHOOK_SECRET),
        vercelEnv: process.env.VERCEL_ENV
    });
}
