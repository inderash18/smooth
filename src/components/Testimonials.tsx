"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { EASE } from "@/lib/motion";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Product Manager, TechCorp India",
    avatar: "RS",
    avatarBg: "#FF5A1F",
    rating: 5,
    text: "Inderash delivered a full-stack platform in record time. His attention to code quality and user experience is unmatched. The AI features he integrated have transformed how our team operates.",
  },
  {
    name: "Priya Mehta",
    role: "Co-founder, StartupLabs",
    avatar: "PM",
    avatarBg: "#A8DDE7",
    rating: 5,
    text: "Working with Inderash felt like having a senior engineer and a product thinker on the team simultaneously. He didn't just write code — he shaped our architecture from the ground up.",
  },
  {
    name: "Dr. K. Venkatesh",
    role: "Dean of Engineering, VIT University",
    avatar: "KV",
    avatarBg: "#111111",
    rating: 5,
    text: "The campus bus tracker Inderash built for us handles thousands of students daily with zero downtime. Exceptional technical skill combined with professionalism.",
  },
  {
    name: "Aisha Nair",
    role: "Founder, AIFirst Ventures",
    avatar: "AN",
    avatarBg: "#F86C6C",
    rating: 5,
    text: "Rare combination: someone who understands both the ML pipeline and the frontend polish needed to ship a consumer AI product. I'd hire him again immediately.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-accent text-accent" viewBox="0 0 24 24">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const current = TESTIMONIALS[active];

  return (
    <section id="testimonials" className="py-28 grid-canvas border-t border-[rgba(17,17,17,0.08)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Label */}
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="label-tag text-accent">07 // Testimonials</span>
            <div className="h-px flex-1 bg-[rgba(17,17,17,0.1)]" />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="section-headline text-ink mb-14">
            Client Voices
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main testimonial */}
          <div className="lg:col-span-8">
            <Reveal delay={0.12}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="card-base bg-bg-card p-10 lg:p-14 h-full flex flex-col justify-between gap-10"
              >
                {/* Quote mark */}
                <div className="text-7xl font-black text-accent/20 leading-none select-none">&ldquo;</div>

                {/* Text */}
                <p className="text-xl md:text-2xl font-medium text-ink leading-relaxed -mt-6">
                  {current.text}
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-[rgba(17,17,17,0.06)]">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                    style={{ background: current.avatarBg }}
                  >
                    {current.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-ink">{current.name}</p>
                    <p className="text-xs text-ink/50">{current.role}</p>
                  </div>
                  <div className="ml-auto">
                    <Stars count={current.rating} />
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </div>

          {/* Sidebar: testimonial switcher */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <Reveal delay={0.18}>
              <p className="label-tag text-ink/40 mb-3">All Reviews</p>
            </Reveal>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={0.2 + i * 0.06}>
                <button
                  id={`testimonial-btn-${i}`}
                  onClick={() => setActive(i)}
                  className={`
                    w-full text-left rounded-2xl p-5 border transition-all duration-300
                    ${active === i
                      ? "bg-ink text-white border-ink shadow-lg"
                      : "bg-bg-card border-[rgba(17,17,17,0.08)] hover:border-[rgba(17,17,17,0.18)]"}
                  `}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                      style={{ background: t.avatarBg }}
                    >
                      {t.avatar}
                    </div>
                    <span className={`font-bold text-sm ${active === i ? "text-white" : "text-ink"}`}>
                      {t.name}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${active === i ? "text-white/70" : "text-ink/50"}`}>
                    {t.text}
                  </p>
                </button>
              </Reveal>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
