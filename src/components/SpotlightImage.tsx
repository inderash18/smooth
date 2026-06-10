"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import Image from "next/image";

interface SpotlightImageProps {
  primarySrc: string;
  secondarySrc: string;
  alt?: string;
  className?: string;
  spotlightSize?: number;
}

export default function SpotlightImage({
  primarySrc,
  secondarySrc,
  alt = "Profile Image",
  className = "",
  spotlightSize = 100,
}: SpotlightImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Track mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth the mouse movement
  const springX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28 });
  
  // Smooth the circle radius
  const radius = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    radius.set(isHovered ? spotlightSize : 0);
  }, [isHovered, radius, spotlightSize]);

  const clipPath = useMotionTemplate`circle(${radius}px at ${springX}px ${springY}px)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-none w-full h-full select-none group ${className}`}
    >
      {/* Primary Image */}
      <div className="w-full h-full will-change-[mask-image]">
        <Image
          src={primarySrc}
          alt={alt}
          fill
          draggable={false}
          className="object-contain pointer-events-none"
        />
      </div>

      {/* Secondary Image revealed by spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none will-change-[clip-path]"
        style={{ clipPath }}
      >
        <Image
          src={secondarySrc}
          alt={`${alt} Reveal`}
          fill
          draggable={false}
          className="object-contain scale-[1.02] origin-center pointer-events-none"
        />
      </motion.div>
    </div>
  );
}
