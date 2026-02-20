"use client";

import { useState } from "react";
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0" title="Mail Olarak Paylaş">
                    <Mail className="h-4 w-4 text-blue-400" />
                </Button>
            </DialogTrigger>
            <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5 text-blue-500" />
                        CV'yi E-posta ile Paylaş
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Bu CV'nin herkese açık bağlantısını dilediğiniz e-posta adresine anında (Resend API) iletebilirsiniz.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <input
                        type="email"
                        placeholder="alici@sirket.com"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        onClick={handleShare}
                        disabled={sending || !email}
                        className="bg-blue-600 hover:bg-blue-700 w-full"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Gönder"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
