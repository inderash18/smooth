"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE } from "@/lib/motion";

interface ProjectCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  year: string;
  color: string;
  textColor: string;
  pills: string[];
  delay: number;
  marginTop?: string;
  image?: string;
  link?: string;
}

function ProjectCard({ title, subtitle, description, year, color, textColor, pills, delay, marginTop = "0px", image, link }: ProjectCardProps) {
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
      className={`relative w-full rounded-[40px] overflow-hidden flex flex-col pt-8 px-6 lg:px-8 pb-8 group`}
      style={{ 
        backgroundColor: color, 
        color: textColor,
        minHeight: "600px",
        marginTop: marginTop
      }}
    >
      {/* Top Header */}
      <div className="flex justify-between items-start w-full">
        <div className="w-8 h-[1px] mt-3" style={{ backgroundColor: textColor }} />
        <div className="flex items-center gap-3 z-10">
          {link && (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors hover:opacity-70 flex items-center gap-1"
              style={{ borderColor: `${textColor}40`, color: textColor }}
            >
              Visit ↗
            </a>
          )}
          <div 
            className="px-4 py-1.5 rounded-full text-xs font-semibold border"
            style={{ borderColor: `${textColor}40` }}
          >
            {year}
          </div>
        </div>
      </div>

      {/* Title Area */}
      <div className="mt-8 flex flex-col z-10">
        {titleWords.map((word, i) => (
          <h3 
            key={i} 
            className="text-3xl lg:text-[2.2rem] leading-[1.05] font-black uppercase tracking-tight"
          >
            {word}
          </h3>
        ))}
        {subtitle && (
          <span className="text-[10px] lg:text-xs font-bold tracking-widest mt-6 opacity-80 uppercase">
            {subtitle}
          </span>
        )}
        {description && (
          <p className="mt-4 text-sm opacity-90 leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>

      {/* Bottom Image Container */}
      <div className="mt-8 relative w-full flex-grow min-h-[220px] bg-black/5 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center">
        {image ? (
          link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 w-full h-full block z-10">
              <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </a>
          ) : (
            <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          )
        ) : (
          <>
            <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(to bottom right, ${color}, transparent)` }} />
            <span className="text-black/20 font-bold text-2xl rotate-[-10deg]">Project UI</span>
          </>
        )}
      </div>

      {/* Tags / Features */}
      <div className="mt-6 flex flex-wrap gap-2 z-10">
        {pills.map((pill, i) => (
          <motion.div
            key={pill}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.3 + (i * 0.05) }}
            className="px-3 py-1.5 rounded-full text-[9px] lg:text-[10px] font-extrabold uppercase tracking-widest border"
            style={{ borderColor: `${textColor}30`, backgroundColor: `${textColor}10`, color: textColor }}
          >
            {pill}
          </motion.div>
        ))}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 items-start">
          
          <ProjectCard 
            title="NETFLIX AI PORTFOLIO"
            subtitle="IMMERSIVE DEVELOPER EXPERIENCE"
            year="2026"
            color="#EAE8DF"
            textColor="#111111"
            pills={["3D Interactive Elements", "AI Assistant Integration", "Neural Background", "Theme Switching Animation", "Premium Motion Design", "Modern Portfolio Architecture"]}
            delay={0.1}
            image="/first card.png"
            link="https://inderash-dev.vercel.app/"
          />

          <ProjectCard 
            title="BLOCKCHAIN NETWORK"
            subtitle="DECENTRALIZED TRUST PLATFORM"
            description="Exploring decentralized technologies, digital ownership, and trustless systems through modern blockchain architecture."
            year="2025"
            color="#FF5A5F"
            textColor="#FFFFFF"
            pills={["Blockchain", "Smart Contracts", "Web3", "Security"]}
            delay={0.3}
            marginTop="4rem"
            image="/second card.jpg"
          />

          <ProjectCard 
            title="JARVIS AI"
            subtitle="PERSONAL AI ASSISTANT"
            description="A next-generation AI assistant inspired by JARVIS, capable of conversation, automation, information retrieval, and intelligent task execution."
            year="2026"
            color="#7AC8CD"
            textColor="#111111"
            pills={["Generative AI", "Voice Interface", "Automation", "LLM"]}
            delay={0.5}
            image="/third card.jpg"
          />

        </div>
      </div>
    </section>
  );
}
