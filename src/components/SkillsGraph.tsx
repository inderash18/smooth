"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { EASE } from "@/lib/motion";

const SKILLS = [
  "React", "Next.js", "Node.js", "Python", 
  "Java", "Flask", "MongoDB", "PostgreSQL", 
  "AI", "ML", "NLP"
];

// Generate deterministic coordinates for a pleasing network layout
const NODE_POSITIONS = [
  { x: 50, y: 50 },   // React (Center-ish)
  { x: 30, y: 20 },   // Next.js
  { x: 70, y: 30 },   // Node.js
  { x: 20, y: 70 },   // Python
  { x: 80, y: 60 },   // Java
  { x: 40, y: 90 },   // Flask
  { x: 85, y: 90 },   // MongoDB
  { x: 10, y: 40 },   // PostgreSQL
  { x: 50, y: 15 },   // AI
  { x: 60, y: 80 },   // ML
  { x: 90, y: 20 },   // NLP
];

// Define connections between specific nodes (indices)
const EDGES = [
  [0, 1], [0, 2], [1, 8], [2, 6], [2, 7], 
  [3, 8], [3, 9], [3, 5], [4, 6], [8, 9], 
  [9, 10], [5, 7], [0, 5], [2, 4], [0, 7]
];

export default function SkillsGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Handle mouse move for parallax/interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (!container) return;
        let rect = rectRef.current;
        if (!rect) {
          rect = container.getBoundingClientRect();
          rectRef.current = rect;
        }

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (lightRef.current) {
          lightRef.current.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`;
        }
      });
    };

    const handleMouseEnter = () => {
      if (container) {
        rectRef.current = container.getBoundingClientRect();
      }
    };

    const handleResize = () => {
      rectRef.current = null;
    };

    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (hasHover) {
      container.addEventListener("mouseenter", handleMouseEnter);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("resize", handleResize);
    }
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (hasHover) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <section id="skills" className="py-24 relative overflow-hidden" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-16 text-center"
        >
          <span className="label-mono text-accent mb-4 block">Capabilities</span>
          <h2 className="section-title text-text">Neural Skillset</h2>
        </motion.div>

        {/* SVG Network Graph */}
        <div className="relative w-full h-[500px] md:h-[700px] glass-card rounded-3xl p-4 overflow-hidden group">
          
          {/* Subtle cursor light */}
          <div 
            ref={lightRef}
            className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 will-change-transform"
            style={{ 
              transform: 'translate3d(-1000px, -1000px, 0)'
            }}
          />

          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 z-0">
            {/* Draw Edges */}
            {inView && EDGES.map((edge, i) => {
              const p1 = NODE_POSITIONS[edge[0]];
              const p2 = NODE_POSITIONS[edge[1]];
              const isHovered = hoveredNode === edge[0] || hoveredNode === edge[1];
              
              return (
                <g key={`edge-${i}`}>
                  <motion.line
                    x1={p1.x} y1={p1.y}
                    x2={p2.x} y2={p2.y}
                    stroke="var(--secondary)"
                    strokeWidth="0.2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: isHovered ? 0.8 : 0.2 }}
                    transition={{ duration: 1.5, ease: EASE, delay: 0.5 + (i * 0.05) }}
                  />
                  {/* Energy pulse on hovered edges */}
                  {isHovered && (
                    <motion.circle
                      r="0.5"
                      fill="var(--accent)"
                      initial={{ cx: p1.x, cy: p1.y, opacity: 1 }}
                      animate={{ cx: p2.x, cy: p2.y, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML Nodes for accessibility and text rendering */}
          {inView && SKILLS.map((skill, i) => {
            const pos = NODE_POSITIONS[i];
            const isHovered = hoveredNode === i;
            
            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE, delay: 1 + (i * 0.05) }}
                style={{
                  position: 'absolute',
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="z-10"
                onMouseEnter={() => setHoveredNode(i)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node Dot */}
                <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${isHovered ? 'bg-accent scale-150' : 'bg-text'}`}>
                  {isHovered && <div className="absolute w-8 h-8 rounded-full bg-accent/30 animate-ping" />}
                </div>
                
                {/* Label */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap px-3 py-1.5 rounded-lg border backdrop-blur-md transition-all duration-300 pointer-events-none ${
                  isHovered 
                    ? 'opacity-100 border-accent/50 bg-bg-card text-text scale-100' 
                    : 'opacity-0 border-transparent scale-95'
                }`}>
                  <p className="font-bold text-sm">{skill}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
