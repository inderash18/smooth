import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ParticleField from "@/components/ParticleField";
import AICatAssistant from "@/components/AICatAssistant";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var theme = savedTheme;
                  if (!theme) {
                    var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    theme = isDark ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-accent selection:text-white">
        <ThemeProvider>
          {/* Background Elements */}
          <ParticleField />
          <div className="bg-noise"></div>
          <div className="bg-grid"></div>
          
          <SmoothScroll />
          {children}
          <AICatAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
