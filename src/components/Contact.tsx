"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE } from "@/lib/motion";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="pt-32 pb-10 relative bg-bg" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Massive Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center w-full"
        >
          <h2 className="text-6xl md:text-[8rem] leading-[0.85] font-black tracking-tighter text-text">
            INTERESTED IN<br/>WORKING <span className="text-accent">TOGETHER?</span>
          </h2>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          className="mt-16"
        >
          <a 
            href="mailto:inderash18@gmail.com" 
            className="px-8 py-3 rounded-full bg-white border border-border text-black font-bold flex items-center gap-3 hover:border-accent hover:text-accent transition-colors shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-black" />
            Get in Touch
          </a>
        </motion.div>

        {/* Brand & Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          className="mt-32 flex flex-col items-center gap-6"
        >
          <div className="font-black text-4xl tracking-tight flex items-center text-text">
            Inderash<span className="text-accent text-5xl leading-none -ml-1 relative -top-1">.</span>
          </div>
          
          <a href="mailto:inderash18@gmail.com" className="flex items-center gap-2 text-text font-bold hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            inderash18@gmail.com
          </a>
        </motion.div>

        {/* Bottom Line & Cat Illustration */}
        <div className="w-full mt-24 relative">
          
          {/* SVG Cat Placeholder sitting on the line */}
          <div className="absolute right-8 md:right-32 bottom-0 w-24 h-32 z-10 pointer-events-none">
            <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
              {/* Cat Body */}
              <path d="M30 110 C 20 60, 40 30, 50 30 C 60 30, 80 60, 70 110 Z" fill="#2A2A35" />
              {/* Cat Belly */}
              <path d="M40 110 C 35 80, 45 50, 50 50 C 55 50, 65 80, 60 110 Z" fill="#E6E4EA" />
              {/* Cat Ears */}
              <path d="M40 35 L 45 15 L 55 25" fill="#2A2A35" />
              <path d="M60 35 L 55 15 L 45 25" fill="#2A2A35" />
              {/* Cat Tail */}
              <path d="M70 100 C 90 100, 100 80, 90 60 C 80 40, 75 70, 70 80" fill="none" stroke="#2A2A35" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>

          <div className="w-full h-px bg-border" />
          
          {/* Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-4">
            <p className="text-secondary text-sm font-medium">
              © Inderash. All rights reserved.
            </p>
            
            <div className="flex gap-6 text-sm font-semibold text-text">
              <a href="https://github.com/inderash18" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
              <a href="https://www.reddit.com/user/Conscious-Cake157/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Reddit</a>
              <a href="mailto:inderash18@gmail.com" className="hover:text-accent transition-colors">Email</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
