import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
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
  title: "WorkTales - Workplace Stories for Social Media",
  description: "Generate engaging fictional workplace stories perfect for TikTok, YouTube Shorts, and Instagram Reels. Available in English and French.",
  keywords: ["workplace stories", "TikTok content", "YouTube Shorts", "social media", "storytelling", "content creation", "French stories", "English stories"],
  authors: [{ name: "WorkTales" }],
  openGraph: {
    title: "WorkTales - Stories from the jobs we all know",
    description: "Generate compelling workplace stories for social media content. Bilingual support for English and French creators.",
    type: "website",
    locale: "en_US",
    alternateLocale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkTales - Workplace Stories Generator",
    description: "Create engaging workplace stories for TikTok and YouTube Shorts",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
