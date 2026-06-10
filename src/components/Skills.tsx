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

const SKILL_GROUPS = [
  {
    category: "Frontend",
    color: "#A8DDE7",
    skills: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 92 },
      { name: "TypeScript", level: 88 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Framer Motion", level: 82 },
    ],
  },
  {
    category: "Backend",
    color: "#FF5A1F",
    skills: [
      { name: "Node.js", level: 90 },
      { name: "FastAPI", level: 85 },
      { name: "PostgreSQL", level: 87 },
      { name: "MongoDB", level: 83 },
      { name: "Redis", level: 76 },
    ],
  },
  {
    category: "AI / ML",
    color: "#F86C6C",
    skills: [
      { name: "Python", level: 93 },
      { name: "LangChain", level: 80 },
      { name: "TensorFlow", level: 75 },
      { name: "OpenAI API", level: 88 },
      { name: "Scikit-learn", level: 78 },
    ],
  },
  {
    category: "DevOps & Cloud",
    color: "#111111",
    skills: [
      { name: "Docker", level: 82 },
      { name: "AWS", level: 74 },
      { name: "GitHub Actions", level: 85 },
      { name: "Vercel", level: 92 },
      { name: "Linux", level: 80 },
    ],
  },
];

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">{name}</span>
        <span className="text-xs font-bold text-ink/40">{level}%</span>
      </div>
      <div className="h-1.5 bg-[rgba(17,17,17,0.08)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.2, ease: EASE, delay: delay + 0.1 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 grid-canvas border-t border-[rgba(17,17,17,0.08)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Section label */}
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="label-tag text-accent">04 // Skills</span>
            <div className="h-px flex-1 bg-[rgba(17,17,17,0.1)]" />
          </div>
        </Reveal>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <Reveal delay={0.08}>
            <h2 className="section-headline text-ink">
              Tech Stack
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="text-ink/50 max-w-sm text-sm leading-relaxed">
              A curated arsenal of technologies I use daily to build fast, intelligent, and scalable products.
            </p>
          </Reveal>
        </div>

        {/* Skill groups grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {SKILL_GROUPS.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 0.08}>
              <div className="card-base bg-bg-card p-7 h-full flex flex-col gap-6">
                {/* Category label */}
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: group.color }}
                  />
                  <span className="label-tag text-ink/60">{group.category}</span>
                </div>

                {/* Bars */}
                <div className="flex flex-col gap-4 flex-1">
                  {group.skills.map((skill, si) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      color={group.color}
                      delay={gi * 0.08 + si * 0.06}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Tools / badges ribbon */}
        <Reveal delay={0.3}>
          <div className="mt-10 p-6 rounded-2xl border border-[rgba(17,17,17,0.1)] bg-bg-card flex flex-wrap gap-3 items-center">
            <span className="label-tag text-ink/40 mr-2">Also comfortable with:</span>
            {["GraphQL","Socket.io","Prisma","Stripe","Figma","Jupyter","Hugging Face","Supabase","Firebase"].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-bg border border-[rgba(17,17,17,0.1)] text-ink/70">
                {t}
              </span>
            ))}
          </div>
        </Reveal>

      </div>
    </section>
  );
}
