'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EXPERIENCES } from '@/lib/constants';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';

export function Experience() {
  return (
    <section id="experience" className="section-padding border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Experience" subtitle="Leadership roles and professional experience" />

        <div className="max-w-3xl">
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
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 border-border bg-background group-hover:bg-foreground group-hover:border-foreground transition-colors duration-300" />

                {/* Card */}
                <div className="p-6 md:p-8 rounded-2xl border border-border hover:border-foreground/30 transition-all duration-500 hover:-translate-y-1">
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
        </div>
      </div>
    </section>
  );
}
