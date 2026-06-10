"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { EASE } from "@/lib/motion";
import SpotlightImage from "@/components/SpotlightImage";

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

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      
      const elements = container.querySelectorAll('.parallax-layer');
      elements.forEach((el, index) => {
        const factor = (index + 1) * 0.5;
        (el as HTMLElement).style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
          <motion.div 
            initial={{ opacity: 0, y: 50, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
            className="hero-display text-text parallax-layer"
          >
            INDERASH
          </motion.div>

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
                className="text-2xl md:text-4xl font-black tracking-tight text-text"
              >
                FULL STACK DEVELOPER
              </motion.div>
            </div>

            {/* Profile / Abstract Shape Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: EASE, delay: 0.7 }}
              className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden glass-card flex-shrink-0 group"
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
