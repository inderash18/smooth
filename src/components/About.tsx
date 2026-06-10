"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE } from "@/lib/motion";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const badges = [
    "AI Engineering",
    "Machine Learning",
    "NLP",
    "Computer Vision",
    "Full Stack Development",
    "Cloud Systems"
  ];

  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10" ref={ref}>
        
        <div className="flex flex-col lg:flex-row gap-16 items-start lg:items-center">
          
          {/* Main Statement */}
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: EASE }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-text leading-tight tracking-tight"
            >
              I build <span className="text-accent">intelligent systems</span> where
            </motion.h2>
            
            <div className="mt-6 flex flex-col gap-2 overflow-hidden">
              {["Artificial Intelligence,", "Software Engineering,", "and Modern Web Technologies", "meet."].map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, rotate: 2 }}
                  animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
                  transition={{ duration: 1, ease: EASE, delay: 0.2 + (i * 0.1) }}
                  className="text-3xl md:text-5xl lg:text-6xl font-black text-secondary leading-tight"
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Floating Badges */}
          <div className="lg:w-[400px] flex flex-wrap gap-3">
            {badges.map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.5 + (i * 0.05) }}
                whileHover={{ y: -5, scale: 1.05, backgroundColor: "var(--text)", color: "var(--bg)" }}
                className="px-5 py-3 rounded-full border border-border bg-bg-card backdrop-blur-md text-sm font-bold text-text cursor-default transition-colors duration-300"
              >
                {badge}
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
