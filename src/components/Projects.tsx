"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE } from "@/lib/motion";

interface ProjectCardProps {
  title: string;
  year: string;
  color: string;
  textColor: string;
  pills: string[];
  delay: number;
  marginTop?: string;
}

function ProjectCard({ title, year, color, textColor, pills, delay, marginTop = "0px" }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-100px" });

  // Split title by space for stacked rendering
  const titleWords = title.split(" ");

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={`relative w-full rounded-[40px] overflow-hidden flex flex-col pt-10 px-8 pb-8 group`}
      style={{ 
        backgroundColor: color, 
        color: textColor,
        height: "600px",
        marginTop: marginTop
      }}
    >
      {/* Top Header */}
      <div className="flex justify-between items-start w-full">
        <div className="w-8 h-[1px] mt-3" style={{ backgroundColor: textColor }} />
        <div 
          className="px-4 py-1.5 rounded-full text-xs font-semibold border"
          style={{ borderColor: `${textColor}40` }}
        >
          {year}
        </div>
      </div>

      {/* Title Area */}
      <div className="mt-12 flex flex-col">
        {titleWords.map((word, i) => (
          <h3 
            key={i} 
            className="text-4xl md:text-[2.75rem] leading-[0.95] font-black uppercase tracking-tight"
          >
            {word}
          </h3>
        ))}
        <span className="text-[10px] font-bold tracking-widest mt-6 opacity-80 uppercase">
          Case Study
        </span>
      </div>

      {/* Bottom Image Container Placeholder */}
      <div className="mt-auto relative w-full h-[220px] bg-white rounded-3xl overflow-hidden shadow-sm flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(to bottom right, ${color}, transparent)` }} />
        
        {/* Placeholder for the project UI image */}
        <span className="text-black/20 font-bold text-2xl rotate-[-10deg]">Project UI</span>
        
        {/* Floating Pills */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
          {pills.map((pill, i) => (
            <motion.div
              key={pill}
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: delay + 0.5 + (i * 0.1) }}
              className="px-4 py-2 bg-white rounded-full text-[10px] font-extrabold text-black uppercase tracking-widest shadow-lg"
            >
              {pill}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  
  return (
    <section id="projects" className="py-24 relative" ref={ref}>
      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        
        {/* Central timeline line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-border z-0 hidden lg:block" />
        <div className="absolute left-1/2 -translate-x-1/2 top-24 w-3 h-3 rounded-full bg-border z-0 hidden lg:block" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          
          <ProjectCard 
            title="CHAT-APP WEBSITES"
            year="2023"
            color="#EAE8DF"
            textColor="#111111"
            pills={["DEVELOPMENT", "UI DESIGN"]}
            delay={0.1}
          />

          <ProjectCard 
            title="GRAPHIC EXPERIMENT ATION"
            year="2024"
            color="#FF5A5F"
            textColor="#FFFFFF"
            pills={["BRANDING"]}
            delay={0.3}
            marginTop="4rem"
          />

          <ProjectCard 
            title="E- COMMERCE PLATFORMS"
            year="2025"
            color="#7AC8CD"
            textColor="#111111"
            pills={["DEVELOPMENT", "UI DESIGN"]}
            delay={0.5}
          />

        </div>
      </div>
    </section>
  );
}
