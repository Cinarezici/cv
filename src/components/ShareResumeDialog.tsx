"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function ShareResumeDialog({ slug }: { slug: string }) {
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleShare = async () => {
        if (!email) {
            toast.error("Lütfen bir e-posta adresi girin.");
            return;
        }

        const cvLink = `${window.location.origin}/r/${slug}`;

        setSending(true);
        try {
            const res = await fetch("/api/share/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    subject: "Interview Ready CV: Size bir özgeçmiş gönderildi!",
                    cvLink,
                    message: "Merhaba, optimizasyonunu yaptığım özgeçmişimi incelemek isterseniz aşağıdaki bağlantıya tıklayabilirsiniz."
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Mail gönderilemedi");

            toast.success("Özgeçmiş başarıyla e-posta ile gönderildi!");
            setOpen(false);
            setEmail("");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSending(false);
        }
    };

    if (!mounted) {
        return (
            <Button variant="outline" size="icon" className="shrink-0 bg-white opacity-50 pointer-events-none" title="Mail Olarak Paylaş">
                <Mail className="h-4 w-4 text-indigo-600" />
            </Button>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 bg-white hover:bg-zinc-100" title="Mail Olarak Paylaş">
                    <Mail className="h-4 w-4 text-indigo-600" />
                </Button>
            </DialogTrigger>
            <DialogContent className="border-zinc-200 bg-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-zinc-900">
                        <Send className="h-5 w-5 text-indigo-600" />
                        CV'yi E-posta ile Paylaş
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Bu CV'nin herkese açık bağlantısını dilediğiniz e-posta adresine anında (Resend API) iletebilirsiniz.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <input
                        type="email"
                        placeholder="alici@sirket.com"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-md p-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        onClick={handleShare}
                        disabled={sending || !email}
                        className="bg-indigo-600 hover:bg-indigo-700 w-full text-white"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Gönder"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
