import React from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BillingSuccessPage({
    searchParams,
}: {
    searchParams: { checkout_id?: string };
}) {
    const checkoutId = searchParams.checkout_id;

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
            <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/10 text-center max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>

                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                    Payment Successful!
                </h1>

                <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                    Thank you for your purchase. Your account has been upgraded successfully.
                </p>

                {checkoutId && (
                    <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 p-3 rounded-lg text-sm text-zinc-600 dark:text-zinc-300 mb-8 break-all">
                        <span className="font-semibold block mb-1">Checkout ID:</span>
                        {checkoutId}
                    </div>
                )}

                <Link href="/dashboard" className="w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 text-md font-semibold">
                        Return to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}
