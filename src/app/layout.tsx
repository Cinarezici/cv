import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LangProvider } from "@/lib/i18n";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cvoptimizerai.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "Free ATS Resume Checker & AI CV Optimizer | CVOptimizerAI",
    template: "%s | CVOptimizerAI",
  },
  description:
    "Check your resume vs any job in seconds. ATS score out of 100, every weakness ranked, fix it with one AI rewrite. Free, no sign-up.",
  keywords: [
    "resume builder",
    "CV optimizer",
    "AI resume",
    "ATS",
    "interview",
    "cover letter",
    "job search",
  ],
  authors: [{ name: "CVOptimizerAI" }],
  creator: "CVOptimizerAI",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" }
    ]
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: 'https://cvoptimizerai.com',
    title: "Free ATS Resume Checker & AI CV Optimizer | CVOptimizerAI",
    description:
      "Check your resume vs any job in seconds. ATS score out of 100, every weakness ranked, fix it with one AI rewrite. Free, no sign-up.",
    siteName: "CVOptimizerAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS Resume Checker & AI CV Optimizer | CVOptimizerAI",
    description:
      "Check your resume vs any job in seconds. ATS score out of 100, every weakness ranked, fix it with one AI rewrite. Free, no sign-up.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cvoptimizerai.ghost.io" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleAnalytics />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LangProvider>
            <Navbar />
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
