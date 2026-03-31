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
    default: "Interview Ready CV — AI-Powered Resume Optimizer",
    template: "%s | Interview Ready CV",
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
  authors: [{ name: "Interview Ready CV" }],
  creator: "Interview Ready CV",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Interview Ready CV — AI-Powered Resume Optimizer",
    description:
      "Build, optimize, and share your resume with AI. Get a tailored CV that passes ATS systems and lands you interviews — in minutes.",
    siteName: "Interview Ready CV",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Ready CV — AI-Powered Resume Optimizer",
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
        <link rel="preconnect" href="https://images.unsplash.com" />
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
