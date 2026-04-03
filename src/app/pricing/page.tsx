import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: "Pricing — Free ATS Score & Pro Plans",
  description:
    "Get your ATS score free. Upgrade to Pro for AI rewriting, premium templates, and unlimited scans. Plans from $7.42/mo. No credit card required to start.",
  openGraph: {
    title: "CV Optimizer AI Pricing — Plans & Features",
    description:
      "Compare Free and Pro plans. Start with a free ATS score, upgrade for AI rewriting and premium features.",
    type: "website",
    url: "https://cvoptimizerai.com/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Optimizer AI Pricing — Plans & Features",
    description:
      "Compare Free and Pro plans. Start with a free ATS score, upgrade for AI rewriting and premium features.",
  },
  alternates: { canonical: "https://cvoptimizerai.com/pricing" },
};

export default function PricingPage() {
  return <PricingClient />;
}
