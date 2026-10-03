import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "EXPRESS | Complete Website SEO, AEO & GEO Diagnostic Platform",
  description: "Free end-to-end website diagnostic tool. 50+ SEO checks, Answer Engine Optimization, Generative Engine Optimization. Analyze any website instantly.",
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
      <body className="min-h-full flex flex-col bg-bg-main text-text-primary selection:bg-brand-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
