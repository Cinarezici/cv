"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

import { toast } from "sonner";

export default function UpgradePage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCheckout = () => {
        setLoading(true);
        // Placeholder for future Iyzico / Payment Gateway integration
        setTimeout(() => {
            toast.info("Connecting to secure payment gateway...", {
                description: "Payment integration is currently being set up. Please try again later."
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Upgrade to Pro
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Your trial has expired. Subscribe to keep active resumes and continue optimizing your applications.
                    </p>
                </div>

                <Card className="border-primary/20 shadow-xl shadow-primary/5">
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Pro Plan <span className="text-primary">$99/yr</span>
                        </CardTitle>
                        <CardDescription>Everything you need to nail the interview.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3">
                            {[
                                "Unlimited Resume Generation",
                                "Advanced AI Customization",
                                "Active Public Link Sharing",
                                "PDF Export Feature"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-1 rounded-full">
                                        <Check className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        <Button className="w-full text-lg h-12 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCheckout} disabled={loading}>
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Proceed to Secure Checkout"}
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard')}>
                            Back to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
