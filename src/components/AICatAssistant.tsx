"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import AIChatPanel from "./AIChatPanel";

interface ZParticle {
  id: number;
  offset: number;
}

export default function AICatAssistant() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [zParticles, setZParticles] = useState<ZParticle[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const catRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  
  // Track last activity time
  const lastMoveRef = useRef<number>(0);

  // Sync lastMoveRef on mount
  useEffect(() => {
    lastMoveRef.current = Date.now();
  }, []);

  // Mouse move: mascot translates towards cursor position (2.5D parallax)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMoveRef.current = Date.now();
      
      if (isSleeping) {
        setIsSleeping(false);
      }

      const container = catRef.current;
      if (!container) return;

      let rect = rectRef.current;
      if (!rect) {
        rect = container.getBoundingClientRect();
        rectRef.current = rect;
      }

      const catCenterX = rect.left + rect.width / 2;
      const catCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - catCenterX;
      const dy = e.clientY - catCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      // Translate limits
      const maxTranslate = 8;
      const tX = (dx / (dist + 100)) * maxTranslate;
      const tY = (dy / (dist + 100)) * maxTranslate;

      if (mascotRef.current) {
        mascotRef.current.style.transform = `translate3d(${tX}px, ${tY}px, 0)`;
      }
    };

    const handleResize = () => {
      rectRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [isSleeping]);

  // Scroll: Mascot leans towards the active section when cursor is idle
  useEffect(() => {
    const sections = ["home", "about", "expertise", "projects", "experience", "skills", "testimonials", "contact"];

    const handleScroll = () => {
      if (Date.now() - lastMoveRef.current < 2500 || isSleeping) return;

      let activeSectionId = "home";
      let minDistance = Infinity;
      const centerY = window.innerHeight / 2;

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const sectionCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenterY - centerY);

        if (distance < minDistance) {
          minDistance = distance;
          activeSectionId = id;
        }
      });

      const activeEl = document.getElementById(activeSectionId);
      if (!activeEl) return;

      const container = catRef.current;
      if (!container) return;

      let rect = rectRef.current;
      if (!rect) {
        rect = container.getBoundingClientRect();
        rectRef.current = rect;
      }

      const catCenterX = rect.left + rect.width / 2;
      const catCenterY = rect.top + rect.height / 2;

      const sectionRect = activeEl.getBoundingClientRect();
      const targetX = sectionRect.left + sectionRect.width / 2;
      const targetY = sectionRect.top + sectionRect.height / 2;

      const dx = targetX - catCenterX;
      const dy = targetY - catCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      const maxTranslate = 8;
      const tX = (dx / dist) * maxTranslate;
      const tY = (dy / dist) * maxTranslate;

      if (mascotRef.current) {
        mascotRef.current.style.transform = `translate3d(${tX}px, ${tY}px, 0)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSleeping]);

  // Sleep timer check
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMoveRef.current > 15000) {
        setIsSleeping(true);
        if (mascotRef.current) {
          mascotRef.current.style.transform = "translate3d(0, 4px, 0) scale(0.95)";
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Sleep Z particles spawning
  useEffect(() => {
    if (!isSleeping) return;

    const interval = setInterval(() => {
      setZParticles((prev) => [
        ...prev.slice(-4),
        { id: Date.now(), offset: (Math.random() - 0.5) * 16 },
      ]);
    }, 1400);

    return () => {
      clearInterval(interval);
      setZParticles([]);
    };
  }, [isSleeping]);

  return (
    <>
      {/* Speech bubble indicator to the left of the cat */}
      <AnimatePresence>
        {!isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0,
              y: [0, -4, 0] // floating micro-animation
            }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              },
              default: { type: "spring", stiffness: 300, damping: 25 }
            }}
            className="fixed bottom-10 right-24 sm:right-28 z-[99] cursor-pointer pointer-events-auto select-none group"
            onClick={() => setIsPanelOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-accent/25 dark:border-cyan-500/35 backdrop-blur-md text-accent dark:text-cyan-400 text-xs font-semibold shadow-lg hover:shadow-xl hover:border-accent/40 dark:hover:border-cyan-500/60 transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
              {/* Dynamic pulsing dot indicator */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/70 dark:bg-cyan-400/70 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent dark:bg-cyan-400"></span>
              </span>
              
              <span className="font-sans tracking-wide">
                {isSleeping 
                  ? "Zzz... Click to wake! 😴" 
                  : isHovered 
                    ? "Chat with Jarvis! ⚡" 
                    : "Click me! 🐾"}
              </span>

              {/* Speech bubble pointer arrow */}
              <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white/90 dark:bg-slate-950/80 border-t border-r border-accent/25 dark:border-cyan-500/35 rotate-45 backdrop-blur-md group-hover:border-accent/40 dark:group-hover:border-cyan-500/60 transition-all duration-300"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={catRef}
        onClick={() => setIsPanelOpen((prev) => !prev)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-4 right-4 z-[99] w-20 h-20 sm:w-24 sm:h-24 cursor-pointer select-none group pointer-events-auto"
        title="Click to interact with Jarvis!"
        role="button"
        aria-label="AI Assistant Mascot"
      >
        {/* Ambient background particles */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-visible">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/30 blur-[0.5px]"
              animate={{
                x: [0, (i % 2 === 0 ? 12 : -12), 0],
                y: [0, -25 - i * 8, 0],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4.5 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
              style={{
                left: `${25 + i * 25}%`,
                bottom: `${20 + i * 15}%`,
              }}
            />
          ))}
        </div>

        {/* Sleeping Z Particles */}
        {isSleeping && (
          <div className="absolute right-3 top-0 pointer-events-none select-none">
            <AnimatePresence>
              {zParticles.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 0, y: 10, scale: 0.6 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    y: -45,
                    x: [0, p.offset, 0],
                    scale: 1.2,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.8, ease: "easeOut" }}
                  className="absolute text-[10px] font-black text-cyan-400/90"
                  style={{ left: 0, top: 0 }}
                >
                  Z
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Mascot Shadow */}
        <div className="absolute inset-x-2 bottom-0 h-1.5 bg-black/30 rounded-full blur-[2px] group-hover:bg-black/40 transition-colors duration-300" />

        {/* Lottie Mascot Container */}
        <div
          ref={mascotRef}
          className="w-full h-full transition-transform duration-300 ease-out origin-center"
          style={{ opacity: isSleeping ? 0.75 : 1 }}
        >
          <DotLottieReact
            src="https://lottie.host/c781039a-8502-4134-9536-d0ab0972eae3/Xxj9a5iniw.lottie"
            loop
            autoplay
          />
        </div>
      </div>

      {/* AI Slide-out Chat Panel */}
      <AIChatPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </>
  );
}
