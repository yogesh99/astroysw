import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AstroYSW | Decode Your Cosmic Blueprint",
  description: "A premium astrology knowledge platform that builds trust, authority and curiosity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col pt-20" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 pt-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
