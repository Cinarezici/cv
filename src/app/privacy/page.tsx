import Link from "next/link";
import { Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — CV Optimizer AI",
  description: "Privacy Policy and data handling practices for CV Optimizer AI.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-blue-500/30">
      <main className="flex-1 pt-36 pb-24">
        <div className="container px-6 mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 font-medium mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="space-y-8 text-zinc-700 leading-relaxed font-medium">
            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">1. Introduction</h2>
              <p>
                At CV Optimizer AI, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and application. 
                Our primary goal is to provide you with the tools to optimize your CV/Resume securely and privately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">2. What Data We Collect</h2>
              <p className="mb-3">We collect information that you voluntarily provide to us when you register for an account or use our application. This may include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, and authentication credentials.</li>
                <li><strong>Resume Data:</strong> The text, uploaded PDF files, work history, and contact details included within the CVs you upload for optimization.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our platform (e.g., page views, feature usage) to help us improve the service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">3. How We Use Your Data</h2>
              <p className="mb-3">Your data is strictly used to provide and enhance the features of CV Optimizer AI. We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and analyze your uploaded CVs to generate ATS scores and AI-driven recommendations.</li>
                <li>Maintain and secure your account and personal dashboard.</li>
                <li>Communicate vital account notifications and updates.</li>
                <li>Comply with necessary legal and regulatory obligations.</li>
              </ul>
              <p className="mt-4 font-bold text-zinc-900">
                We never sell, rent, or trade your personal information or resume content to third-party data brokers or marketing agencies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">4. Data Security</h2>
              <p>
                We implement industry-standard security measures, including encryption in transit and at rest, to ensure that your data is protected against unauthorized access, alteration, or disclosure. While no internet-based service can be 100% secure, we deeply prioritize the confidentiality of your professional history.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">5. Third-Party Services</h2>
              <p>
                To provide our AI rewriting services, your CV data may be processed by our selected AI partners (e.g., OpenAI). However, we ensure via strict API agreements that your specific data is <strong>never used to train their public data models</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">6. Your Rights</h2>
              <p>
                Depending on your location (such as under the GDPR or CCPA), you have the right to access, correct, delete, or export your personal data at any time. You can view or delete your CVs directly from your dashboard, or delete your entire account by contacting our support team.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">7. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy, or how your personal information is handled, please contact us at <strong>privacy@cvoptimizerai.com</strong>.
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
            <Link href="/terms" className="hover:text-zinc-900 transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-zinc-900 transition-colors">Return to Homepage</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
