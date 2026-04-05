import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LangProvider } from "@/lib/i18n";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
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
  title: {
    default: "CV Optimizer AI — Free ATS Resume Checker & AI CV Optimizer",
    template: "%s | CV Optimizer AI",
  },
  description:
    "Build, optimize, and share your resume with AI. Get a tailored CV that passes ATS systems and lands you interviews — in minutes.",
  keywords: [
    "resume builder",
    "CV optimizer",
    "AI resume",
    "ATS",
    "interview",
    "cover letter",
    "job search",
  ],
  authors: [{ name: "CV Optimizer AI" }],
  creator: "CV Optimizer AI",
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
    title: "CV Optimizer AI — Free ATS Resume Checker & AI CV Optimizer",
    description:
      "Build, optimize, and share your resume with AI. Get a tailored CV that passes ATS systems and lands you interviews — in minutes.",
    siteName: "CV Optimizer AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Optimizer AI — Free ATS Resume Checker & AI CV Optimizer",
    description:
      "Build, optimize, and share your resume with AI. Get a tailored CV that passes ATS systems and lands you interviews — in minutes.",
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
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleAnalytics />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LangProvider>
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
