"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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

const SERVICES = [
  {
    num: "01",
    title: "Full Stack Web Development",
    desc: "End-to-end web applications — from pixel-perfect frontends to robust backend APIs and databases. Built to scale from day one.",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    accent: "#FF5A1F",
    bg: "#FF5A1F0D",
  },
  {
    num: "02",
    title: "AI & LLM Integration",
    desc: "Embed GPT-4, Claude, or open-source LLMs into your product. Build autonomous agents, RAG pipelines, and intelligent automation workflows.",
    tags: ["LangChain", "OpenAI", "RAG"],
    accent: "#A8DDE7",
    bg: "#A8DDE710",
  },
  {
    num: "03",
    title: "API Design & Microservices",
    desc: "RESTful and GraphQL APIs designed for reliability, security, and speed. Microservice architectures that let your team ship independently.",
    tags: ["FastAPI", "GraphQL", "Docker"],
    accent: "#F86C6C",
    bg: "#F86C6C0D",
  },
  {
    num: "04",
    title: "Mobile Application Development",
    desc: "Cross-platform mobile apps with React Native — consistent UX on iOS and Android, with real-time features, offline sync, and push notifications.",
    tags: ["React Native", "Expo", "Firebase"],
    accent: "#111111",
    bg: "#11111108",
  },
  {
    num: "05",
    title: "Machine Learning Solutions",
    desc: "Custom ML models for classification, regression, NLP, and computer vision. Data pipelines, model evaluation, and production deployment included.",
    tags: ["Python", "TensorFlow", "Scikit-learn"],
    accent: "#FF5A1F",
    bg: "#FF5A1F0D",
  },
  {
    num: "06",
    title: "Technical Consulting",
    desc: "Architecture reviews, stack selection, code audits, and developer mentorship. Get expert guidance to ship faster and avoid costly mistakes.",
    tags: ["Architecture", "Code Review", "Mentorship"],
    accent: "#A8DDE7",
    bg: "#A8DDE710",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-28 grid-canvas border-t border-[rgba(17,17,17,0.08)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Label */}
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="label-tag text-accent">06 // Services</span>
            <div className="h-px flex-1 bg-[rgba(17,17,17,0.1)]" />
          </div>
        </Reveal>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <Reveal delay={0.08}>
            <h2 className="section-headline text-ink">
              What I Build
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <a id="services-contact-btn" href="#contact" className="pill pill-dark flex-shrink-0">
              Start a Project ↗
            </a>
          </Reveal>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.06}>
              <div
                className="card-base p-8 h-full flex flex-col gap-5 group cursor-default"
                style={{ background: s.bg, border: `1px solid ${s.accent}20` }}
              >
                {/* Number */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-5xl font-black leading-none opacity-15 group-hover:opacity-30 transition-opacity"
                    style={{ color: s.accent }}
                  >
                    {s.num}
                  </span>
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                    style={{ background: s.accent }}
                  >
                    ↗
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-ink leading-snug">{s.title}</h3>

                {/* Description */}
                <p className="text-ink/55 text-sm leading-relaxed flex-1">{s.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[rgba(17,17,17,0.06)]">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                      style={{ color: s.accent, background: `${s.accent}15` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
