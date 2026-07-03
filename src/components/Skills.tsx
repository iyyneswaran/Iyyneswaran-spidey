'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SKILL_CATEGORIES } from '@/lib/constants';
import { fadeUpVariants, staggerContainerVariants, staggerFastContainerVariants } from '@/lib/animations';
import { TechSphere } from '@/components/ui/TechSphere';

export function Skills() {
  const [openCategory, setOpenCategory] = useState<number | null>(0);

  const toggleCategory = (index: number) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  return (
    <section id="skills" className="section-padding border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Skills" subtitle="Technologies and tools I work with" />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left — Accordion */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {SKILL_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.title}
                variants={fadeUpVariants}
                className="border-b border-border"
              >
                <button
                  onClick={() => toggleCategory(index)}
                  className="w-full flex items-center justify-between py-5 md:py-6 text-left group cursor-pointer"
                  aria-expanded={openCategory === index}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground font-mono w-6">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-lg md:text-xl font-medium tracking-tight group-hover:text-foreground transition-colors">
                      {category.title}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openCategory === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openCategory === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        variants={staggerFastContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap gap-2 pb-6 pl-10"
                      >
                        {category.skills.map((skill) => (
                          <motion.span
                            key={skill}
                            variants={fadeUpVariants}
                            whileHover={{ y: -2, scale: 1.05 }}
                            className="px-4 py-2 text-sm rounded-full border border-border bg-muted/50 hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 cursor-default"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Right — Tech Sphere (large screens only) */}
          <div className="hidden lg:flex items-center justify-center sticky top-24">
            <TechSphere />
          </div>
        </div>
      </div>
    </section>
  );
}
