'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EXPERIENCES } from '@/lib/constants';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';
import { ParticleTextCanvas } from '@/components/ui/ParticleTextCanvas';

// Maps each experience to the particle-text that forms on scroll
const PARTICLE_TEXTS = [
  'Office Bearer',
  'RAS MAGIC Mastermind',
  'IEEE Day & Hackathon Organizer',
  'Tech Team Member',
  'AI/DS Intern',
];

export function Experience() {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track which timeline card is centred in the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-exp-idx'));
            if (!isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const activeText = activeIndex >= 0 ? PARTICLE_TEXTS[activeIndex] ?? '' : '';

  return (
    <section id="experience" className="section-padding border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Experience" subtitle="Leadership roles and professional experience" />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* ── Left — Timeline ── */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="relative"
          >
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

            {EXPERIENCES.map((exp, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariants}
                className="relative pl-10 pb-10 last:pb-0 group"
                ref={(el) => { cardRefs.current[index] = el; }}
                data-exp-idx={index}
              >
                {/* Dot — filled when active */}
                <div
                  className={`absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 transition-colors duration-300 ${
                    activeIndex === index
                      ? 'bg-foreground border-foreground'
                      : 'bg-background border-border group-hover:bg-foreground group-hover:border-foreground'
                  }`}
                />

                {/* Card — highlighted when active */}
                <div
                  className={`p-6 md:p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-1 ${
                    activeIndex === index
                      ? 'border-foreground/40 bg-muted/30'
                      : 'border-border hover:border-foreground/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <h3 className="text-lg font-semibold tracking-tight">{exp.title}</h3>
                    {exp.period && (
                      <span className="text-xs text-muted-foreground tracking-wider font-mono shrink-0">
                        {exp.period}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground font-medium block mb-2">
                    {exp.organization}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Right — Particle Text (large screens only) ── */}
          <div className="hidden lg:block sticky top-20 h-[600px]">
            <ParticleTextCanvas activeText={activeText} />
          </div>
        </div>
      </div>
    </section>
  );
}
