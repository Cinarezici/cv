import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getEffectiveStatus } from '@/lib/subscription';
import LockedPageView from '@/components/LockedPageView';
import ATSScannerClient from './ATSScannerClient';

export const metadata: Metadata = {
  title: 'Free ATS Score Checker — Test Your Resume Instantly',
  description:
    'Check your resume\'s ATS score for free. See exactly what\'s wrong and fix it with one click. Upload PDF or paste text.',
  openGraph: {
    title: 'Free ATS Score Checker — Test Your Resume Instantly',
    description:
      'Check your resume\'s ATS score for free. See exactly what\'s wrong and fix it with one click.',
    type: 'website',
    url: 'https://cvoptimizerai.com/ats-scanner',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ATSScannerPage() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) redirect('/login');

    const status = await getEffectiveStatus(user.id);
    if (status === 'canceled') {
        return <LockedPageView featureName="ATS Scanner" subtitle="Scan and optimize your CVs with a Pro subscription." />;
    }

    return <ATSScannerClient />;
}
