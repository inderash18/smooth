"use client";

import { useEffect, useState } from "react";

interface TextMorphProps {
  words: string[];
  className?: string;
  duration?: number; // duration of transition in ms
  interval?: number; // interval between morphs in ms
}

export default function TextMorph({
  words,
  className = "",
  duration = 1000,
  interval = 3500,
}: TextMorphProps) {
  const [isWordOne, setIsWordOne] = useState(true);
  const [word1, setWord1] = useState(words[0]);
  const [word2, setWord2] = useState(words[1] || words[0]);

  useEffect(() => {
    if (words.length <= 1) return;

    let currentIndex = 0;

    const timer = setInterval(() => {
      setIsWordOne((prev) => {
        const nextIsWordOne = !prev;
        currentIndex = (currentIndex + 1) % words.length;

        if (nextIsWordOne) {
          const futureIndex = (currentIndex + 1) % words.length;
          setWord2(words[futureIndex]);
        } else {
          const futureIndex = (currentIndex + 1) % words.length;
          setWord1(words[futureIndex]);
        }

        return nextIsWordOne;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  const opacity1 = isWordOne ? 1 : 0;
  const opacity2 = isWordOne ? 0 : 1;

  const filterId = "gooey-text-morph-filter";

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      {/* SVG Threshold Filter */}
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            />
          </filter>
        </defs>
      </svg>

      {/* Invisible text placeholder to reserve layout width based on the longest word */}
      <span className="invisible select-none pointer-events-none whitespace-nowrap" aria-hidden="true">
        {words.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>

      {/* morph wrapper */}
      <span
        className="absolute inset-0 flex items-center justify-start"
        style={{ filter: `url(#${filterId})` }}
      >
        <span
          className="absolute left-0 inline-block select-none whitespace-nowrap"
          style={{
            opacity: opacity1,
            transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        >
          {word1}
        </span>
        <span
          className="absolute left-0 inline-block select-none whitespace-nowrap"
          style={{
            opacity: opacity2,
            transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        >
          {word2}
        </span>
      </span>
    </span>
  );
}
