"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";

interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned?: boolean;
}

export default function NeuralDNARope() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  
  const [isPulling, setIsPulling] = useState(false);
  const ropeColor = theme === "light" ? "#111111" : "#F5F5F5";
  const glowColor = "#FF6A3D"; // Accent

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 100;
    let height = 300;
    canvas.width = width;
    canvas.height = height;

    const points: Point[] = [];
    const segments = 15;
    const segmentLength = Math.min(10, height / segments);

    // Initialize points
    for (let i = 0; i <= segments; i++) {
      points.push({
        x: width / 2,
        y: i * segmentLength,
        oldX: width / 2,
        oldY: i * segmentLength,
        pinned: i === 0,
      });
    }

    let mouseX = width / 2;
    let mouseY = height;
    let isDragging = false;
    let draggedPoint: Point | null = null;
    let time = 0;
    
    // Physics parameters
    const gravity = 0.5;
    const friction = 0.92;
    const bounce = 0.9;

    let toggleTriggered = false;
    let energyWaveProgress = 0;
    let energyWaveActive = false;

    const update = () => {
      // Update points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.pinned) continue;

        const vx = (p.x - p.oldX) * friction;
        const vy = (p.y - p.oldY) * friction;

        p.oldX = p.x;
        p.oldY = p.y;

        p.x += vx;
        p.y += vy;
        p.y += gravity;

        if (isDragging && draggedPoint === p) {
          p.x = mouseX;
          p.y = mouseY;
        }
      }

      // Constrain points (Verlet integration)
      for (let iter = 0; iter < 5; iter++) {
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const difference = segmentLength - dist;
          const percent = difference / dist / 2;
          const offsetX = dx * percent;
          const offsetY = dy * percent;

          if (!p1.pinned) {
            if (!(isDragging && draggedPoint === p1)) {
              p1.x -= offsetX;
              p1.y -= offsetY;
            }
          }
          if (!p2.pinned) {
            if (!(isDragging && draggedPoint === p2)) {
              p2.x += offsetX;
              p2.y += offsetY;
            }
          }
        }
      }

      // Check if pulled far enough to trigger theme
      const lastPoint = points[points.length - 1];
      if (isDragging && lastPoint.y > height * 0.8 && !toggleTriggered) {
        toggleTriggered = true;
        energyWaveActive = true;
        energyWaveProgress = 0;
        
        // Haptic feedback if supported
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(50);
        }
        
        // Timeout to allow release effect
        setTimeout(() => {
          toggleTheme();
          toggleTriggered = false;
        }, 300);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw energy wave if active
      if (energyWaveActive) {
        energyWaveProgress += 0.05;
        if (energyWaveProgress > 1) {
          energyWaveActive = false;
        }
      }

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        
        // Draw main rope segment
        ctx.lineTo(p1.x, p1.y);
      }

      // Styling the rope
      ctx.strokeStyle = ropeColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // DNA / Neural styling (sine waves along the points)
      time += 0.05;
      
      const drawStrand = (offset: number, color: string, alpha: number) => {
        ctx.beginPath();
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const angle = Math.atan2(dy, dx);
          
          const wavePhase = (i * 0.5) + time + offset;
          const perpOffset = Math.sin(wavePhase) * 6;
          
          const px = p1.x + Math.cos(angle + Math.PI / 2) * perpOffset;
          const py = p1.y + Math.sin(angle + Math.PI / 2) * perpOffset;
          
          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = energyWaveActive ? 15 : 5;
        ctx.shadowColor = glowColor;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      };

      drawStrand(0, glowColor, 0.6);
      drawStrand(Math.PI, ropeColor, 0.4);

      // Draw handle node at bottom
      const lastPoint = points[points.length - 1];
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = energyWaveActive ? glowColor : ropeColor;
      ctx.fill();
      
      // Draw energy wave traveling
      if (energyWaveActive) {
        const waveIndex = Math.floor((1 - energyWaveProgress) * points.length);
        if (waveIndex >= 0 && waveIndex < points.length) {
          const wp = points[waveIndex];
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, 12, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.globalAlpha = 0.8;
          ctx.shadowBlur = 20;
          ctx.shadowColor = glowColor;
          ctx.fill();
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 0;
        }
      }
    };

    let animationId: number;
    const loop = () => {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    };
    loop();

    // Event Handlers
    const handleDown = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      
      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;

      // Find closest point
      let closest = points[points.length - 1]; // usually pull from bottom
      let minDist = 30; // hit radius
      
      const dx = closest.x - mouseX;
      const dy = closest.y - mouseY;
      if (Math.sqrt(dx * dx + dy * dy) < minDist) {
        isDragging = true;
        draggedPoint = closest;
        setIsPulling(true);
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;
    };

    const handleUp = () => {
      isDragging = false;
      draggedPoint = null;
      setIsPulling(false);
    };

    canvas.addEventListener("mousedown", handleDown);
    canvas.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    
    canvas.addEventListener("touchstart", handleDown, { passive: false });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousedown", handleDown);
      canvas.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      
      canvas.removeEventListener("touchstart", handleDown);
      canvas.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [theme, ropeColor, glowColor, toggleTheme]);

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 right-8 z-[100] h-[300px] w-[100px] pointer-events-none"
    >
      <canvas 
        ref={canvasRef} 
        className="pointer-events-auto cursor-grab active:cursor-grabbing w-full h-full"
      />
      <div 
        className={`absolute bottom-[-20px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold tracking-widest uppercase transition-opacity duration-300 ${
          isPulling ? "opacity-100 text-accent" : "opacity-0"
        }`}
      >
        Pull to shift
      </div>
    </div>
  );
}
