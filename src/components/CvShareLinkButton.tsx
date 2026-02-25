"use client";

/**
 * CvShareLinkButton — creates (or fetches) a protected share link via /api/cv-share
 * and lets the user copy it to clipboard.
 *
 * Props:
 *   resumeId  — the resume's UUID
 *   size      — "sm" | "default"
 *   label     — optional text label (default: "Paylaş")
 */

import { useState, useCallback } from "react";
import { Share2, Link2, Check, Loader2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
    resumeId: string;
    size?: "sm" | "default";
    label?: string;
    variant?: "outline" | "ghost" | "default";
}

export function CvShareLinkButton({
    resumeId,
    size = "sm",
    label,
    variant = "outline",
}: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Link Metadata
    const [isPro, setIsPro] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const [createdAt, setCreatedAt] = useState<string | null>(null);

    // Fetch or create share link when dialog opens
    const handleOpen = useCallback(async () => {
        setOpen(true);
        if (shareUrl) return; // already loaded
        setLoading(true);
        try {
            // 1. Try to get existing link
            const getRes = await fetch(`/api/cv-share?resumeId=${resumeId}`);
            const getData = await getRes.json();

            if (getData.shareLink?.shareId) {
                setShareUrl(`${window.location.origin}/cv/${getData.shareLink.shareId}`);
                setIsPro(getData.shareLink.isPro);
                setIsEnabled(getData.shareLink.isEnabled);
                setCreatedAt(getData.shareLink.createdAt);
                return;
            }

            // 2. Create new link
            const postRes = await fetch("/api/cv-share", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeId }),
            });
            const postData = await postRes.json();

            if (!postRes.ok) throw new Error(postData.error || "Link oluşturulamadı");

            setShareUrl(`${window.location.origin}/cv/${postData.shareId}`);
            setIsPro(postData.isPro);
            setIsEnabled(postData.isEnabled);
            setCreatedAt(postData.createdAt);
        } catch (err: any) {
            toast.error(err.message);
            setOpen(false);
        } finally {
            setLoading(false);
        }
    }, [resumeId, shareUrl]);

    const handleCopy = useCallback(async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link kopyalandı!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Kopyalanamadı — tarayıcı izni gerekebilir.");
        }
    }, [shareUrl]);

    const handleDisable = useCallback(async () => {
        if (!shareUrl) return;
        const shareId = shareUrl.split("/cv/")[1];
        if (!shareId) return;
        if (!confirm("Bu paylaşım linkini devre dışı bırakmak istiyor musunuz?")) return;
        try {
            await fetch(`/api/cv-share?id=${shareId}`, { method: "DELETE" });
            setIsEnabled(false);
            toast.success("Link devre dışı bırakıldı.");
        } catch {
            toast.error("İşlem başarısız.");
        }
    }, [shareUrl]);

    // Calculate Days Left for Free Users
    let daysLeft = 0;
    let isExpired = false;

    if (createdAt && !isPro) {
        const linkCreated = new Date(createdAt);
        const expiresAt = new Date(linkCreated);
        expiresAt.setDate(expiresAt.getDate() + 14); // SHARE_LINK_TRIAL_DAYS
        const now = new Date();

        daysLeft = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        isExpired = daysLeft <= 0;
    }

    return (
        <>
            <Button
                variant={variant}
                size={size}
                onClick={handleOpen}
                className="gap-1.5 font-semibold"
                title="CV Paylaşım Linki"
            >
                <Share2 className="w-3.5 h-3.5" />
                {label && <span>{label}</span>}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-zinc-900">
                            <Link2 className="w-5 h-5 text-indigo-600" />
                            CV Paylaşım Linki
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {loading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                            </div>
                        ) : shareUrl ? (
                            <>
                                {/* Status Banner */}
                                {!isEnabled ? (
                                    <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-rose-900">Link Disabled</h4>
                                            <p className="text-xs text-rose-700 mt-1">
                                                You have manually disabled this share link.
                                            </p>
                                        </div>
                                    </div>
                                ) : isPro ? (
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-start gap-3">
                                        <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-indigo-900">Lifetime Active</h4>
                                            <p className="text-xs text-indigo-700 mt-1">
                                                Your Lifetime plan keeps this link permanently accessible.
                                            </p>
                                        </div>
                                    </div>
                                ) : isExpired ? (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                        <div className="w-full">
                                            <h4 className="text-sm font-semibold text-amber-900">Link Expired</h4>
                                            <p className="text-xs text-amber-700 mt-1 mb-3">
                                                Your 14-day free sharing period has ended. Visitors can no longer view this link.
                                            </p>
                                            <Button
                                                onClick={() => router.push('/upgrade')}
                                                className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-none h-8 text-xs"
                                            >
                                                Upgrade to Lifetime ($99 one-time)
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex items-start gap-3">
                                        <Share2 className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-zinc-900">Free sharing: {daysLeft} days left</h4>
                                            <p className="text-xs text-zinc-600 mt-1">
                                                After 14 days, visitors will not be able to view this CV unless you upgrade.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* URL display + copy (Only if enabled and not expired) */}
                                {isEnabled && (!isExpired || isPro) && (
                                    <div className="flex items-center gap-2 mt-4">
                                        <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-700 font-mono truncate select-all">
                                            {shareUrl}
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={handleCopy}
                                            className={`shrink-0 transition-all ${copied
                                                ? "bg-emerald-600 hover:bg-emerald-700"
                                                : "bg-indigo-600 hover:bg-indigo-700"
                                                } text-white`}
                                        >
                                            {copied ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                "Copy"
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {/* Disable link */}
                                {isEnabled && (
                                    <button
                                        onClick={handleDisable}
                                        className="text-xs text-rose-400 hover:text-rose-600 flex items-center gap-1 transition-colors mt-2"
                                    >
                                        <X className="w-3 h-3" />
                                        Disable link
                                    </button>
                                )}
                            </>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
