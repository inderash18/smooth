"use client";

import { motion, useInView } from "framer-motion";
import { useRef, MouseEvent } from "react";
import { EASE } from "@/lib/motion";

interface CardProps {
  title: string;
  items: string[];
  delay: number;
}

function ExpertiseCard({ title, items, delay }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  const handleMouseEnter = () => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    let rect = rectRef.current;
    if (!rect) {
      rect = cardRef.current.getBoundingClientRect();
      rectRef.current = rect;
    }
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE, delay }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card p-10 h-full flex flex-col group relative overflow-hidden will-change-transform"
      style={{ transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease" }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-text mb-8">{title}</h3>
        
        <ul className="flex flex-col gap-4">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-secondary font-medium group-hover:text-text transition-colors duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-50 group-hover:opacity-100 transition-opacity" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Expertise() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const expertiseData = [
    {
      title: "AI Engineering",
      items: ["LLMs", "RAG Systems", "Knowledge Graphs", "NLP", "Computer Vision"]
    },
    {
      title: "Full Stack Development",
      items: ["React", "Next.js", "Node.js", "Flask", "MongoDB", "PostgreSQL"]
    },
    {
      title: "Software Engineering",
      items: ["System Design", "REST APIs", "Architecture", "Cloud", "Optimization"]
    }
  ];

  return (
    <section id="expertise" className="py-24 relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10" ref={ref}>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16"
        >
          <span className="label-mono text-accent mb-4 block">Expertise</span>
          <h2 className="section-title text-text">Domains</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertiseData.map((data, i) => (
            <ExpertiseCard 
              key={data.title}
              title={data.title}
              items={data.items}
              delay={0.2 + (i * 0.1)}
            />
          ))}
        </div>

        {/* Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
          className="mt-24 text-center"
        >
          <h3 className="text-xl md:text-2xl font-bold text-text mb-10">Expertise in Tools</h3>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {[
              { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" },
              { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
              { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" },
              { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
              { name: "Illustrator", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-plain.svg" },
              { name: "Photoshop", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-plain.svg" },
              { name: "Canva", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg" }
            ].map((tool) => (
              <div 
                key={tool.name} 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-border/50 bg-bg shadow-sm flex items-center justify-center p-3.5 md:p-4 hover:scale-110 hover:shadow-md transition-all duration-300 cursor-pointer"
                title={tool.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain drop-shadow-sm" />
              </div>
            ))}
            
            {/* "more" circle */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-border/50 bg-bg shadow-sm flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-300 cursor-pointer">
              <span className="text-sm md:text-base font-bold text-text">more</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
