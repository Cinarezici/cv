"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteButtonProps {
    id: string;
    type: "profiles" | "resumes";
}

export function DeleteButton({ id, type }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete this ${type === "profiles" ? "Profile" : "Resume"}? This action cannot be undone.`)) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/${type}/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete');
            }

            toast.success("Successfully deleted.");
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || 'Error deleting item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
            disabled={loading}
            title="Delete"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    );
}
