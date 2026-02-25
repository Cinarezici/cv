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
import { Share2, Link2, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

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
                // Build URL from shareId using current origin — works in dev + prod
                setShareUrl(`${window.location.origin}/cv/${getData.shareLink.shareId}`);
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
            // Build URL from shareId using current origin
            setShareUrl(`${window.location.origin}/cv/${postData.shareId}`);
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
            setShareUrl(null);
            setOpen(false);
            toast.success("Link devre dışı bırakıldı.");
        } catch {
            toast.error("İşlem başarısız.");
        }
    }, [shareUrl]);

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
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Bu link ile CV'nizi herkesle paylaşabilirsiniz.{" "}
                            <span className="font-semibold text-zinc-700">
                                Planınız aktif olduğu sürece link çalışır.
                            </span>{" "}
                            Planınız sona ererse ziyaretçiler otomatik yönlendirilir.
                        </p>

                        {loading ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                            </div>
                        ) : shareUrl ? (
                            <>
                                {/* URL display + copy */}
                                <div className="flex items-center gap-2">
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
                                            "Kopyala"
                                        )}
                                    </Button>
                                </div>

                                {/* Disable link */}
                                <button
                                    onClick={handleDisable}
                                    className="text-xs text-rose-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                    Linki devre dışı bırak
                                </button>
                            </>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
