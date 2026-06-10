import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ParticleField from "@/components/ParticleField";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Inderash — AI Engineer & Full Stack Developer",
  description:
    "Portfolio of Inderash, building intelligent systems, AI-powered products, and modern digital experiences.",
  metadataBase: new URL("https://inderash.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased selection:bg-accent selection:text-white`}>
        <ThemeProvider>
          {/* Background Elements */}
          <ParticleField />
          <div className="bg-noise"></div>
          <div className="bg-grid"></div>
          
          <SmoothScroll />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
