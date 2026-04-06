import Link from "next/link";
import { Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service 2026 — CV Optimizer AI",
  description: "Terms of Service and usage agreement for CV Optimizer AI. By using our service, you agree to our data handling and AI processing terms.",
  alternates: { canonical: 'https://cvoptimizerai.com/terms' },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-blue-500/30">

      <main className="flex-1 pt-36 pb-24">
        <div className="container px-6 mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-6 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-zinc-500 font-medium mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="space-y-8 text-zinc-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using CV Optimizer AI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms in full, you must refrain from using the Service. 
                These terms govern your use of all tools, features, and content provided by CV Optimizer AI.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">2. Description of Service</h2>
              <p>
                CV Optimizer AI is an online software platform that provides Applicant Tracking System (ATS) document analysis, resume templates, and artificial intelligence-driven text generation to assist individuals in their job application processes. We do not guarantee employment, interviews, or specific outcomes resulting from the use of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">3. User Accounts</h2>
              <p className="mb-3">To use certain features of the service, you must register for an account. By registering, you agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are providing accurate, current, and complete information.</li>
                <li>You are responsible for safeguarding the password and credentials used to access the Service.</li>
                <li>You will immediately notify us of any unauthorized use of your account.</li>
                <li>You are at least 18 years of age or accessing the Service under parental supervision.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">4. Acceptable Use Policy</h2>
              <p className="mb-3">You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Using the Service for any illegal purpose or in violation of any local, state, national, or international law.</li>
                <li>Uploading content that contains malware, viruses, or malicious code.</li>
                <li>Attempting to bypass pricing, rate limits, or access controls established by the Service.</li>
                <li>Reverse-engineering the application or utilizing automated bots/scrapers to extract our templates or data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">5. Intellectual Property</h2>
              <p>
                The underlying technology, design, templates, and algorithms of CV Optimizer AI are our exclusive property. The specific resume content and data you upload into the system remains your intellectual property. By using the Service, you grant us a temporary license to process your content solely for the purpose of generating your optimized materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">6. Subscriptions and Payments</h2>
              <p>
                CV Optimizer AI operates under both free and premium subscription tiers. Access to premium features is billed per the terms shown at checkout. You can cancel your subscription at any time via your account dashboard to avoid future charges. Refunds for past billing periods are governed independently by our Money-Back Guarantee policy where explicitly stated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">7. Limitation of Liability</h2>
              <p>
                CV Optimizer AI is provided on an "AS IS" and "AS AVAILABLE" basis. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues resulting from your use of the Service. It is your sole responsibility to review the AI-generated outputs for accuracy before submitting them in job applications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">8. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of significant changes through the application or via email. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 border-t border-zinc-200/60 bg-[#fafafa]">
        <div className="container mx-auto max-w-3xl flex justify-between items-center text-sm font-medium text-zinc-500">
          <p>© {new Date().getFullYear()} CV Optimizer AI.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-zinc-900 transition-colors">Return to Homepage</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
