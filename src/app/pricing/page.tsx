import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'Pricing 2026: Free ATS Score & AI Resume Plans | CVOptimizerAI',
  description: "Get your ATS score free. Upgrade to Pro for AI rewriting, premium templates, and unlimited scans. High-value lifetime access available. No credit card required.",
  alternates: { canonical: 'https://cvoptimizerai.com/pricing' },
  openGraph: {
    title: 'CVOptimizerAI Pricing 2026: Plans & Features',
    description: "Get your ATS score free. Upgrade to Pro for AI rewriting, premium templates, and unlimited scans. High-value lifetime access available.",
    type: 'website',
    url: 'https://cvoptimizerai.com/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVOptimizerAI Pricing 2026: Plans & Features',
    description: "Compare Free, Starter, Pro, and Lifetime plans for ATS resume optimization.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://cvoptimizerai.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Pricing",
      "item": "https://cvoptimizerai.com/pricing"
    }
  ]
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PricingClient />
    </>
  );
}
