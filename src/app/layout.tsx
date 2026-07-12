import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

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
    default: "Stadium Knowledge Network — SKN",
    template: "%s | SKN",
  },
  description:
    "Every Match Makes Every Stadium Smarter. SKN is an AI-powered operational intelligence platform that transforms FIFA World Cup stadium incidents into reusable playbooks.",
  keywords: [
    "FIFA World Cup",
    "stadium operations",
    "AI playbook",
    "incident management",
    "crowd control",
    "Gemini AI",
    "smart stadium",
  ],
  authors: [{ name: "SKN Team" }],
  openGraph: {
    title: "Stadium Knowledge Network (SKN)",
    description:
      "AI Operational Intelligence for FIFA World Cup 2026. Every match creates a smarter stadium.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stadium Knowledge Network",
    description: "AI-powered stadium ops for the FIFA World Cup 2026.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-100 bg-slate-950`}
      >
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
