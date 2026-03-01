import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function usePro() {
    const [isPro, setIsPro] = useState<boolean | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkProStatus() {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setIsPro(false);
                    return;
                }

                const { data: sub } = await supabase
                    .from('subscriptions')
                    .select('status, trial_end_at, trial_ends_at')
                    .eq('user_id', user.id)
                    .maybeSingle();

                // Compute effective status client-side (mirrors server logic)
                let effectiveStatus = (sub?.status as string) || 'trialing';

                if (effectiveStatus === 'trialing') {
                    const rawEnd = sub?.trial_end_at ?? sub?.trial_ends_at;
                    if (rawEnd && new Date() > new Date(rawEnd)) {
                        effectiveStatus = 'canceled';
                        // Fire-and-forget DB update via API (avoids service role on client)
                        fetch('/api/subscription/expire', { method: 'POST' }).catch(() => { });
                    }
                }

                setStatus(effectiveStatus);
                setIsPro(effectiveStatus === 'active');
            } catch (error) {
                console.error('Error checking pro status:', error);
                setIsPro(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkProStatus();
    }, []);

    const requirePro = (callback?: () => void) => {
        if (isPro) {
            if (callback) callback();
            return true;
        } else if (status === 'canceled') {
            // Fire trial-expired modal
            window.dispatchEvent(new CustomEvent('trial-expired'));
            return false;
        } else {
            // Trialing but hit a pro-only feature
            const event = new CustomEvent('open-upgrade-modal');
            window.dispatchEvent(event);
            return false;
        }
    };

    return { isPro, isLoading, requirePro, status };
}
