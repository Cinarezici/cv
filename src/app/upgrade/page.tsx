import type { Metadata } from 'next';
import UpgradeClient from './UpgradeClient';

export const metadata: Metadata = {
  title: 'CVOptimizerAI Pricing — One-Time Pro Plan | No Subscription',
  description:
    'Get unlimited CV optimization, ATS scanning, cover letters, and more. Choose monthly, yearly, or a one-time lifetime plan.',
  openGraph: {
    title: 'CVOptimizerAI Pricing — One-Time Pro Plan | No Subscription',
    description:
      'Get unlimited CV optimization, ATS scanning, cover letters, and more. Choose monthly, yearly, or a one-time lifetime plan.',
    type: 'website',
    url: 'https://cvoptimizerai.com/upgrade',
  },
};

export default function UpgradePage() {
  return <UpgradeClient />;
}
