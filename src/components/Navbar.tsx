"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";

const NAV_LINKS = [
  { label: "Home",       href: "#home",        num: "01" },
  { label: "About",      href: "#about",       num: "02" },
  { label: "Blogs",      href: "#blogs",       num: "03" },
  { label: "Expertise",  href: "#expertise",   num: "04" },
  { label: "Work",       href: "#projects",    num: "05" },
  { label: "Experience", href: "#experience",  num: "06" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          px-8 py-6
          flex items-center justify-between
          transition-all duration-500
          ${scrolled ? "bg-bg/90 backdrop-blur-md shadow-sm border-b border-border/50 py-4" : "bg-transparent"}
        `}
      >
        {/* Left: Brand */}
        <a
          href="#home"
          className="font-black text-2xl tracking-tight flex items-center text-text"
        >
          Inderash<span className="text-accent text-3xl leading-none -ml-0.5 relative -top-1">.</span>
        </a>

        {/* Center: Links */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[15px] font-bold text-text hover:text-accent transition-colors relative group"
            >
              {link.label}
              <sup className="text-[9px] font-semibold text-secondary ml-0.5 absolute -top-1 -right-3">
                {link.num}
              </sup>
            </a>
          ))}
        </nav>

        {/* Right: Theme Toggle & Connect */}
        <div className="hidden lg:flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="text-text hover:text-accent transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            )}
          </button>
          
          <a
            href="#contact"
            className="px-6 py-2.5 rounded-full bg-bg border border-border text-text text-sm font-bold flex items-center gap-2 hover:border-accent hover:text-accent transition-colors shadow-sm"
          >
            Connect 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-text">
            {theme === "light" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 text-text z-50"
          >
            <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-bg flex flex-col items-center justify-center gap-8"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-black tracking-tight text-text hover:text-accent transition-colors flex items-start"
              >
                {link.label}
                <sup className="text-sm ml-1 text-secondary">{link.num}</sup>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
