"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export interface FAQItem {
  q: string;
  a: string;
}

export function ComparisonFAQ({ faqs }: { faqs: FAQItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section className="w-full bg-white py-24 border-t border-zinc-100">
      <div className="container px-6 mx-auto max-w-3xl">
        <h2 className="text-3xl font-extrabold text-center mb-10 tracking-tight text-zinc-900">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#fafafa] border text-left border-zinc-200 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-zinc-900 outline-none"
              >
                <span className="pr-4">{faq.q}</span>
                <ChevronDown className={clsx("w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300", openFaq === i && "rotate-180")} />
              </button>
              <div
                className={clsx(
                  "px-6 text-zinc-600 font-medium leading-relaxed overflow-hidden transition-all duration-300",
                  openFaq === i ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
}
