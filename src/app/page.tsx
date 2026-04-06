import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Free ATS Resume Checker 2026: Get Your CV Score | CVOptimizerAI',
  description: "See exactly why your resume gets rejected. Upload your CV, get an instant ATS score out of 100, and fix every issue with one AI rewrite. Trusted by 20,000+ professionals.",
  alternates: { canonical: 'https://cvoptimizerai.com' },
  openGraph: {
    title: 'Free ATS Resume Checker 2026: Get Your CV Score | CVOptimizerAI',
    description: "See exactly why your resume gets rejected. Upload your CV, get an instant ATS score out of 100, and fix every issue with one AI rewrite.",
    type: 'website',
    url: 'https://cvoptimizerai.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Checker 2026: Get Your CV Score | CVOptimizerAI',
    description: "Get an instant ATS score out of 100 and fix issues with one AI rewrite.",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CVOptimizerAI",
    "description": "Free ATS resume checker and AI CV optimizer. Upload your CV, get an instant ATS score out of 100, and rewrite it for any job in seconds.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": "https://cvoptimizerai.com",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "20313",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "ATS Resume Scoring",
      "AI-Powered CV Rewrite",
      "LinkedIn URL Import",
      "PDF Upload",
      "ATS-Friendly Resume Templates",
      "Shareable CV Link",
      "Keyword Gap Analysis"
    ],
    "screenshot": "https://cvoptimizerai.com/og-image.png"
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CVOptimizerAI",
    "url": "https://cvoptimizerai.com",
    "logo": "https://cvoptimizerai.com/logo.png",
    "sameAs": [
      "https://www.linkedin.com/company/cvoptimizerai",
      "https://twitter.com/cvoptimizerai"
    ],
    "description": "CVOptimizerAI is a free AI-powered ATS resume checker and CV optimizer trusted by 20,000+ professionals."
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://cvoptimizerai.com",
    "name": "CVOptimizerAI",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://cvoptimizerai.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
