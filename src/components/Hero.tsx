"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { EASE } from "@/lib/motion";
import SpotlightImage from "@/components/SpotlightImage";
import TextMorph from "@/components/TextMorph";

function FloatingNode({ delay, x, y, size }: { delay: number, x: string, y: string, size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm z-10"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{
        y: ["0%", "-50%", "0%"],
        x: ["0%", "20%", "0%"],
        rotate: [0, 90, 0],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax on mouse move
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Cache elements on mount
    const elements = Array.from(container.querySelectorAll('.parallax-layer')) as HTMLElement[];
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 20;
        const y = (clientY / window.innerHeight - 0.5) * 20;
        
        elements.forEach((el, index) => {
          const factor = (index + 1) * 0.5;
          el.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
        });
      });
    };

    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (hasHover) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (hasHover) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20" ref={containerRef}>
      
      {/* Floating Nodes */}
      <FloatingNode delay={0} x="15%" y="30%" size={80} />
      <FloatingNode delay={2} x="80%" y="20%" size={120} />
      <FloatingNode delay={1} x="70%" y="75%" size={60} />
      <FloatingNode delay={3} x="10%" y="80%" size={100} />

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Top Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="label-mono text-secondary">Creative Developer & AI Engineer</span>
        </motion.div>

        {/* Massive Typography Grid */}
        <div className="relative">
          <motion.h1 
            initial={{ opacity: 0, y: 50, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
            className="hero-display text-text parallax-layer"
          >
            INDERASH
          </motion.h1>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mt-2 parallax-layer">
            <div className="flex flex-col">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.5 }}
                className="text-2xl md:text-4xl font-black tracking-tight text-accent"
              >
                AI ENGINEER
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.6 }}
                className="text-2xl md:text-4xl font-black tracking-tight text-text flex items-center flex-wrap"
              >
                <span className="mr-2">FULL STACK</span>
                <TextMorph words={["DEVELOPER", "DESIGNER"]} className="text-accent" />
              </motion.div>
            </div>

            {/* Profile / Abstract Shape Placeholder */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 group flex items-center justify-center">
              {/* Rotating SVG Frame */}
              <div className="absolute inset-0 z-0">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                  <path d="M50 10 C 20 10, 10 30, 10 50 C 10 70, 30 90, 50 90 C 80 90, 90 70, 90 50 C 90 20, 70 10, 50 10 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-accent"></path>
                  <path d="M50 20 C 30 20, 20 40, 20 50 C 20 70, 40 80, 50 80 C 70 80, 80 60, 80 50 C 80 30, 70 20, 50 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-text"></path>
                </svg>
              </div>

              {/* Profile Image nested inside */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: EASE, delay: 0.7 }}
                className="absolute inset-[20%] rounded-full overflow-hidden glass-card z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <SpotlightImage 
                    primarySrc="/1.jpeg"
                    secondarySrc="/face.jpg"
                    spotlightSize={50}
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Subheading & CTA */}
        <div className="mt-16 flex flex-col md:flex-row md:items-end justify-between gap-10 parallax-layer">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.8 }}
            className="body-large text-secondary max-w-xl"
          >
            Building <span className="text-text font-semibold">intelligent systems</span>, AI-powered products,
            and modern digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.9 }}
            className="flex items-center gap-4"
          >
            <a href="#projects" className="btn-primary magnetic-wrap group">
              Explore Work
              <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
