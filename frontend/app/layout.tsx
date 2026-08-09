import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/providers/query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MindMarket | AI Procurement Intelligence",
  description: "Enterprise Procurement Workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-cream-paper text-ink-black" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 pb-24">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
