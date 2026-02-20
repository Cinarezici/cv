"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Crown, Ban } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.users) {
                setUsers(data.users);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateStatus = async (userId: string, status: string) => {
        setActionId(userId);
        try {
            const res = await fetch('/api/admin/users/update-sub', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUserId: userId, newStatus: status })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update');
            toast.success("Kullanıcı aboneliği güncellendi!");
            await fetchUsers();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setActionId(null);
        }
    };

    const getDaysRemaining = (endDateStr: string | null) => {
        if (!endDateStr) return 0;
        const diffTime = Math.max(0, new Date(endDateStr).getTime() - new Date().getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-500" /> Kullanıcılar / Abonelik Yönetimi
            </h1>

            <Card className="border-zinc-800 bg-zinc-900/50">
                <CardHeader>
                    <CardTitle className="text-xl">Sistemdeki Tüm Hesaplar</CardTitle>
                    <CardDescription>
                        Kullanıcılarınızın abonelik (subscription) durumunu ve kalan sürelerini buradan yönetin. (Yoksa otomatik tanımlanır).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center text-zinc-400 py-8 justify-center">
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Veriler çekiliyor...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                                        <th className="py-4 px-4 font-medium">E-Posta / Hesap</th>
                                        <th className="py-4 px-4 font-medium">Durum (Status)</th>
                                        <th className="py-4 px-4 font-medium">Kalan Süre</th>
                                        <th className="py-4 px-4 font-medium text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => {
                                        const status = u.subscription?.status || 'yok';
                                        const isActive = status === 'active';
                                        const trialEnd = u.subscription?.trial_end;
                                        const daysLeft = isActive ? getDaysRemaining(trialEnd) : 0;

                                        return (
                                            <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-zinc-200">{u.email}</div>
                                                    <div className="text-xs text-zinc-500 mt-1">ID: {u.id.substring(0, 8)}...</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {status === 'active' ? (
                                                        <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">Aktif (Active)</Badge>
                                                    ) : status === 'yok' ? (
                                                        <Badge variant="outline" className="text-zinc-500">Kayıtsız</Badge>
                                                    ) : (
                                                        <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-none">{status}</Badge>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    {isActive && daysLeft > 0 ? (
                                                        <span className="text-sm text-emerald-400">{daysLeft} gün kaldı</span>
                                                    ) : (
                                                        <span className="text-sm text-zinc-600">-</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-right space-x-2">
                                                    {status !== 'active' ? (
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            className="bg-blue-600 hover:bg-blue-700 h-8"
                                                            disabled={actionId === u.id}
                                                            onClick={() => handleUpdateStatus(u.id, 'active')}
                                                        >
                                                            {actionId === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Crown className="w-3 h-3 mr-1" /> Abone Yap (1 Yıl)</>}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-8"
                                                            disabled={actionId === u.id}
                                                            onClick={() => handleUpdateStatus(u.id, 'canceled')}
                                                        >
                                                            {actionId === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Ban className="w-3 h-3 mr-1" /> İptal Et</>}
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-zinc-500">Kayıtlı kullanıcı bulunamadı.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
