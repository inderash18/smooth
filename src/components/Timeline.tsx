"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EASE } from "@/lib/motion";

const timelineData = [
  {
    year: "2025",
    title: "AI Projects & Hackathons",
    desc: "Building autonomous agents, participating in global AI hackathons, and integrating advanced LLMs into production workflows."
  },
  {
    year: "2025",
    title: "Full Stack Development",
    desc: "Shipping enterprise-grade web applications with Next.js, scaling backend microservices, and refining system architectures."
  },
  {
    year: "2024",
    title: "Software Engineering Journey",
    desc: "Mastering core CS fundamentals, algorithms, and full-stack basics. Building foundational projects and contributing to open source."
  }
];

function TimelineItem({ data, index }: { data: typeof timelineData[0], index: number }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 90%", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <div className="relative pl-12 md:pl-24 py-12" ref={itemRef}>
      
      {/* Node Dot */}
      <motion.div 
        style={{ scale, opacity }}
        className="absolute left-[-6px] top-14 w-3 h-3 rounded-full bg-accent z-10"
      >
        <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-50" />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity, y }} className="group">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xl md:text-2xl font-black text-accent">{data.year}</span>
          <div className="h-px flex-1 bg-border group-hover:bg-accent/30 transition-colors" />
        </div>
        
        <h3 className="text-2xl md:text-3xl font-black text-text mb-4 transition-transform group-hover:translate-x-2 duration-300">
          {data.title}
        </h3>
        <p className="text-lg text-secondary leading-relaxed max-w-2xl">
          {data.desc}
        </p>
      </motion.div>
    </div>
  );
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="mb-20 text-center">
          <span className="label-mono text-accent mb-4 block">Experience</span>
          <h2 className="section-title text-text">The Journey</h2>
        </div>

        <div className="relative" ref={containerRef}>
          {/* Vertical Line Background */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-border" />
          
          {/* Animated Draw Line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-[0px] top-0 w-[1px] bg-accent transform origin-top"
          />

          <div className="flex flex-col">
            {timelineData.map((item, i) => (
              <TimelineItem key={i} data={item} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
