'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Medal, Zap } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { HACKATHON_STATS, HACKATHON_HIGHLIGHTS } from '@/lib/constants';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function Hackathons() {
  return (
    <section id="achievements" className="section-padding border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Hackathons" subtitle="Competing, building, and winning under pressure" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Counters */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col gap-8"
          >
            {HACKATHON_STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUpVariants}
                className="p-8 md:p-10 rounded-2xl border border-border"
              >
                <div className="text-5xl md:text-7xl font-bold tracking-tighter text-editorial mb-3">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground tracking-wider uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right — Highlights */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col gap-4"
          >
            {HACKATHON_HIGHLIGHTS.map((highlight, index) => {
              const Icon = index === 0 ? Trophy : index === 1 ? Medal : Zap;
              return (
                <motion.div
                  key={index}
                  variants={fadeUpVariants}
                  whileHover={{ y: -2 }}
                  className={`p-6 md:p-8 rounded-2xl border transition-all duration-500 ${
                    highlight.featured
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:border-foreground/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl ${
                      highlight.featured ? 'bg-white/10' : 'bg-muted'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold tracking-tight mb-1">
                        {highlight.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${
                        highlight.featured ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {highlight.venue}
                      </p>
                      {highlight.prize && (
                        <div className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${
                          highlight.featured
                            ? 'bg-white/20 text-white'
                            : 'bg-muted text-foreground'
                        }`}>
                          {highlight.prize}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Extra info cards */}
            <motion.div
              variants={fadeUpVariants}
              className="p-6 rounded-2xl border border-border bg-muted/30"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                Led team execution under 12–24 hour constraints. Rapidly pivoted system design under changing constraints.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
