'use client';
import { useEffect, useRef, useState } from 'react';
import { MotivationLetter } from '@/types/motivation-letter';

const ACTIVE_STATUSES = ['pending', 'researching', 'generating', 'creating_pdf'];
const POLL_INTERVAL_MS = 3000; // poll every 3 seconds

/**
 * Polls the API for updated letter statuses while any letter is in an active
 * (non-terminal) state. Stops polling when all letters are completed or failed.
 */
export function useLetterProgress(initialLetters: MotivationLetter[]) {
    const [letters, setLetters] = useState<MotivationLetter[]>(initialLetters);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isMountedRef = useRef(true);

    // Sync initial letters when parent re-renders
    useEffect(() => {
        setLetters(initialLetters);
    }, [initialLetters]);

    useEffect(() => {
        isMountedRef.current = true;

        const poll = async () => {
            // Check if there are any active letters before hitting the API
            const hasActive = letters.some(l => ACTIVE_STATUSES.includes(l.generation_status));
            if (!hasActive) {
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
                return;
            }

            try {
                const res = await fetch('/api/motivation-letters', { cache: 'no-store' });
                if (!res.ok || !isMountedRef.current) return;
                const updated: MotivationLetter[] = await res.json();
                if (!isMountedRef.current) return;

                setLetters(prev => {
                    // Merge: keep client-side state for non-polled fields, but
                    // update generation_status, pdf_url, etc from server
                    return prev.map(letter => {
                        const fresh = updated.find(u => u.id === letter.id);
                        return fresh ?? letter;
                    });
                });
            } catch {
                // Silently ignore network errors — will retry on next interval
            }
        };

        // Start polling if there are active letters
        const hasActive = letters.some(l => ACTIVE_STATUSES.includes(l.generation_status));
        if (hasActive && !intervalRef.current) {
            intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
        } else if (!hasActive && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [letters.map(l => l.generation_status).join(',')]);

    return { letters, setLetters };
}
