"use client";

import { useEffect, useRef, useState } from "react";
import AIChatPanel from "./AIChatPanel";

export default function InteractiveCat() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isWaggingFast, setIsWaggingFast] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTwitchingLeft, setIsTwitchingLeft] = useState(false);
  const [isTwitchingRight, setIsTwitchingRight] = useState(false);

  const catRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const lastMoveRef = useRef<number>(0);

  // Mouse move: head & eyes follow cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMoveRef.current = Date.now();
      
      // If sleeping, wake up!
      if (isSleeping) {
        setIsSleeping(false);
      }

      const container = catRef.current;
      if (!container) return;

      let rect = rectRef.current;
      if (!rect) {
        rect = container.getBoundingClientRect();
        rectRef.current = rect;
      }

      const catCenterX = rect.left + rect.width / 2;
      const catCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - catCenterX;
      const dy = e.clientY - catCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      // Restrict turning ranges
      const maxHead = 5;
      const maxEye = 3;

      const hX = (dx / (dist + 100)) * maxHead;
      const hY = (dy / (dist + 100)) * maxHead;

      const eX = (dx / (dist + 50)) * maxEye;
      const eY = (dy / (dist + 50)) * maxEye;

      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${hX}px, ${hY}px, 0)`;
      }
      if (eyesRef.current) {
        eyesRef.current.style.transform = `translate3d(${eX}px, ${eY}px, 0)`;
      }
    };

    const handleResize = () => {
      rectRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [isSleeping]);

  // Event Delegation: speed up tail sway when hoverable items are hovered
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], .glass-card, .btn-primary, .pill")) {
        setIsWaggingFast(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], .glass-card, .btn-primary, .pill")) {
        setIsWaggingFast(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  // Sleep checker loop (checks if mouse has not moved for 15 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMoveRef.current > 15000) {
        setIsSleeping(true);
        // Reset head and eyes position slowly during sleep
        if (headRef.current) {
          headRef.current.style.transform = "translate3d(0, 3px, 0) rotate(5deg)";
        }
        if (eyesRef.current) {
          eyesRef.current.style.transform = "translate3d(0, 0, 0)";
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Random blink loop (every 4-8 seconds)
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const runBlink = () => {
      if (!isSleeping) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
      const nextDelay = 4000 + Math.random() * 4000;
      timerId = setTimeout(runBlink, nextDelay);
    };

    timerId = setTimeout(runBlink, 5000);
    return () => clearTimeout(timerId);
  }, [isSleeping]);

  // Random ear twitch loop
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const runTwitch = () => {
      if (!isSleeping) {
        const left = Math.random() > 0.5;
        if (left) {
          setIsTwitchingLeft(true);
          setTimeout(() => setIsTwitchingLeft(false), 300);
        } else {
          setIsTwitchingRight(true);
          setTimeout(() => setIsTwitchingRight(false), 300);
        }
      }
      const nextDelay = 6000 + Math.random() * 6000;
      timerId = setTimeout(runTwitch, nextDelay);
    };

    timerId = setTimeout(runTwitch, 8000);
    return () => clearTimeout(timerId);
  }, [isSleeping]);

  return (
    <>
      <div 
        ref={catRef}
        onClick={() => setIsPanelOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-[99] w-20 h-24 sm:w-24 sm:h-28 cursor-pointer select-none group pointer-events-auto"
        title="Click me for help!"
      >
        {/* Floating Sleep Z Particles */}
        {isSleeping && (
          <div className="absolute left-4 top-0 pointer-events-none select-none">
            <span className="absolute text-[9px] font-black text-cyan-400 animate-z-float-1" style={{ left: 0, top: 0 }}>Z</span>
            <span className="absolute text-[11px] font-black text-cyan-400 animate-z-float-2" style={{ left: 8, top: -4 }}>Z</span>
            <span className="absolute text-[13px] font-black text-cyan-400 animate-z-float-3" style={{ left: 16, top: -10 }}>Z</span>
          </div>
        )}

        {/* Ambient shadow */}
        <div className="absolute inset-x-2 bottom-0 h-2 bg-black/30 rounded-full blur-sm group-hover:bg-black/40 transition-colors duration-300" />

        <svg
          viewBox="0 0 100 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Eye Glow filter definition */}
          <defs>
            <filter id="cyber-eye-glow">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Master Breathing Wrapper */}
          <g className={isSleeping ? "animate-breathing-sleep" : "animate-breathing"}>
            
            {/* Tail group (anchored at body connection root on the right side) */}
            <path
              d="M67 105 C 90 98, 88 72, 78 62 C 68 52, 62 72, 70 78 C 76 84, 75 93, 67 97"
              fill="none"
              stroke="#202331"
              strokeWidth="7"
              strokeLinecap="round"
              className={isWaggingFast ? "animate-tail-fast" : "animate-tail-slow"}
            />

            {/* Back Body structure */}
            <path
              d="M30 110 C 20 65, 40 38, 50 38 C 60 38, 80 65, 70 110 Z"
              fill="#202331"
            />

            {/* Chest/Belly Fur */}
            <path
              d="M40 110 C 36 82, 44 54, 50 54 C 56 54, 64 82, 60 110 Z"
              fill="#E6E4EA"
            />

            {/* Paw Dividers for premium detail */}
            <path
              d="M 36 110 C 36 106, 40 106, 40 110"
              fill="none"
              stroke="#151722"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M 64 110 C 64 106, 60 106, 60 110"
              fill="none"
              stroke="#151722"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Head Group (Rotated slightly when sleeping, tracks cursor when awake) */}
            <g 
              ref={headRef} 
              className="transition-transform duration-300 ease-out origin-center"
              style={{ transformOrigin: "50px 40px" }}
            >
              {/* Left Ear */}
              <g 
                className="transition-transform duration-200 ease-in-out"
                style={{ 
                  transform: isTwitchingLeft ? "rotate(-10deg)" : "none",
                  transformOrigin: "32px 30px" 
                }}
              >
                <path d="M32 30 L 16 10 L 38 22 Z" fill="#202331" />
                <path d="M30 28 L 19 13 L 35 22 Z" fill="#383D52" />
              </g>

              {/* Right Ear */}
              <g 
                className="transition-transform duration-200 ease-in-out"
                style={{ 
                  transform: isTwitchingRight ? "rotate(10deg)" : "none",
                  transformOrigin: "68px 30px" 
                }}
              >
                <path d="M68 30 L 84 10 L 62 22 Z" fill="#202331" />
                <path d="M70 28 L 81 13 L 65 22 Z" fill="#383D52" />
              </g>

              {/* Head Base */}
              <ellipse cx="50" cy="40" rx="20" ry="16" fill="#202331" />

              {/* Whiskers */}
              <line x1="26" y1="42" x2="16" y2="40" stroke="#E6E4EA" strokeWidth="1" opacity="0.3" />
              <line x1="26" y1="45" x2="14" y2="45" stroke="#E6E4EA" strokeWidth="1" opacity="0.3" />
              <line x1="74" y1="42" x2="84" y2="40" stroke="#E6E4EA" strokeWidth="1" opacity="0.3" />
              <line x1="74" y1="45" x2="86" y2="45" stroke="#E6E4EA" strokeWidth="1" opacity="0.3" />

              {/* Nose & Mouth */}
              <polygon points="49,43 51,43 50,45" fill="#E6E4EA" />
              <path d="M48 47 Q 50 49 52 47" fill="none" stroke="#E6E4EA" strokeWidth="1" opacity="0.6" />

              {/* Dynamic Eyes Group (tracks mouse position) */}
              <g ref={eyesRef} className="transition-transform duration-200 ease-out">
                {/* Left Eye Socket */}
                <ellipse cx="42" cy="36" rx="4.5" ry="3.5" fill="#151722" />
                {/* Right Eye Socket */}
                <ellipse cx="58" cy="36" rx="4.5" ry="3.5" fill="#151722" />

                {isSleeping ? (
                  // Closed sleeping eyes
                  <>
                    <path d="M 39 36 Q 42 39 45 36" fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 55 36 Q 58 39 61 36" fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                ) : (
                  // Open glowing pupils
                  <>
                    <ellipse
                      cx="42"
                      cy="36"
                      rx="3.2"
                      ry={isBlinking ? 0.3 : 3.2}
                      fill="#00E5FF"
                      filter="url(#cyber-eye-glow)"
                      className="transition-all duration-100 ease-out"
                    />
                    <ellipse
                      cx="58"
                      cy="36"
                      rx="3.2"
                      ry={isBlinking ? 0.3 : 3.2}
                      fill="#00E5FF"
                      filter="url(#cyber-eye-glow)"
                      className="transition-all duration-100 ease-out"
                    />
                  </>
                )}
              </g>
            </g>
          </g>
        </svg>
      </div>

      {/* AI Slide-out Chat Panel */}
      <AIChatPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </>
  );
}
