'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ABOUT_TEXT, STATS } from '@/lib/constants';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section-padding border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column */}
          <div>
            <SectionHeading title="About" />
            <motion.p
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-body text-muted-foreground text-base md:text-lg leading-relaxed"
            >
              {ABOUT_TEXT}
            </motion.p>
          </div>

          {/* Right Column — Stats */}
          <div className="flex items-end">
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-2 gap-4 md:gap-6 w-full"
            >
              {STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUpVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group p-6 md:p-8 rounded-2xl border border-border bg-white hover:bg-foreground hover:text-background transition-colors duration-500 cursor-default"
                >
                  <div className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-editorial">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground group-hover:text-background/70 tracking-wide transition-colors duration-500">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
