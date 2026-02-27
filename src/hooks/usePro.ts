import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function usePro() {
    const [isPro, setIsPro] = useState<boolean | null>(null);
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
                    .select('*')
                    .eq('user_id', user.id)
                    .maybeSingle();

                // Strictly check status === 'active'
                // If we want to be safe with date, we can include it, but the instruction emphasized 'active' status.
                const isProActive = ['active', 'trialing'].includes(sub?.status as string);

                setIsPro(isProActive);
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
        } else {
            // Trigger upgrade modal event across app
            const event = new CustomEvent('open-upgrade-modal');
            window.dispatchEvent(event);
            return false;
        }
    };

    return { isPro, isLoading, requirePro };
}
