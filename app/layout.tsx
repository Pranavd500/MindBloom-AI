import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import WellnessCoach from "@/components/features/WellnessCoach";
import PWAInstallPrompt from "@/components/features/PWAInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindBloom AI - Your AI Wellness Companion",
  description: "AI-powered emotional intelligence and wellness platform for students preparing for competitive exams. Track mood, discover hidden stress triggers, and get personalized wellness plans.",
  keywords: ["mental health", "student wellness", "AI wellness", "exam preparation", "stress management", "mindfulness"],
  manifest: "/manifest.json",
  themeColor: "#8b5cf6",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MindBloom AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <WellnessCoach />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
