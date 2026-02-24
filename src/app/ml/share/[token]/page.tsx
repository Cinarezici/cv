import { redirect } from 'next/navigation';
import { resolveLetterAccess } from '@/lib/cv-share';
import LetterViewer from './LetterViewer';

const HOME_URL = 'https://cvoptimizerai.com';

export default async function SharedLetterPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    if (!token) redirect(HOME_URL);

    const result = await resolveLetterAccess(token);

    // Redirection logic for expired subscription
    if (!result.allowed) {
        redirect(HOME_URL);
    }

    const { resume: letter, isPro } = result;

    return (
        <LetterViewer
            letter={letter}
            isPro={isPro}
        />
    );
}
