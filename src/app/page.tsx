import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Free ATS Resume Checker & AI CV Optimizer | CVOptimizerAI',
  description:
    'Upload your CV and get an instant ATS score. AI rewrites your resume for any job in seconds. Try free — no sign-up required.',
  openGraph: {
    title: 'Free ATS Resume Checker & AI CV Optimizer | CVOptimizerAI',
    description:
      'Upload your CV and get an instant ATS score. AI rewrites your resume for any job in seconds. Try free — no sign-up required.',
    type: 'website',
    url: 'https://cvoptimizerai.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Checker & AI CV Optimizer | CVOptimizerAI',
    description:
      'Upload your CV and get an instant ATS score. AI rewrites your resume for any job in seconds. Try free — no sign-up required.',
  },
};

export default function Home() {
  return <HomeClient />;
}
