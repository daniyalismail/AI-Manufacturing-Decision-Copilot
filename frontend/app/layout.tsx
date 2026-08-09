import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/Footer";
import { EvidenceDrawer } from "@/components/evidence/EvidenceDrawer";
import { Providers } from "@/providers/query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ProcureIQ | AI Procurement Intelligence",
  description: "Enterprise Procurement Workspace",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased h-full`}>
      <body className="min-h-screen flex flex-col font-sans bg-cream-paper text-ink-black selection:bg-fresh-grass/30" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="pt-[120px] pb-20 px-4 md:px-8 max-w-[1240px] mx-auto w-full flex-grow">
            {children}
          </main>
          <EvidenceDrawer />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
