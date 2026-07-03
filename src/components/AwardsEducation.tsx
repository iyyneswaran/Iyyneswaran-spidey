'use client';

import { motion } from 'framer-motion';
import { Award, BookOpen, GraduationCap, Languages as LanguagesIcon } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AWARDS, SYMPOSIUMS, EDUCATION, LANGUAGES } from '@/lib/constants';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';

export function AwardsEducation() {
  return (
    <section id="education" className="section-padding border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Education & Awards" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="space-y-12">
            {/* Awards */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-muted">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">Awards</h3>
              </div>
              {AWARDS.map((award) => (
                <motion.div
                  key={award.title}
                  variants={fadeUpVariants}
                  className="p-6 rounded-2xl border border-border hover:border-foreground/30 transition-all duration-500"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold tracking-tight mb-1">{award.title}</h4>
                      <p className="text-sm text-muted-foreground">{award.organization}</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground shrink-0">{award.year}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Symposiums */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-muted">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">Symposiums & Presentations</h3>
              </div>
              <div className="space-y-3">
                {SYMPOSIUMS.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUpVariants}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border/50 hover:border-border transition-colors duration-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            {/* Education */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-muted">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">Education</h3>
              </div>
              <div className="space-y-4">
                {EDUCATION.map((edu, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUpVariants}
                    className="relative pl-6 pb-6 last:pb-0"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full border-2 border-foreground bg-background" />
                    {i < EDUCATION.length - 1 && (
                      <div className="absolute left-[4.5px] top-4 bottom-0 w-px bg-border" />
                    )}

                    <div className="p-5 rounded-2xl border border-border hover:border-foreground/30 transition-all duration-500">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-semibold tracking-tight text-sm">{edu.degree}</h4>
                        <span className="text-xl font-bold tracking-tight text-editorial shrink-0">
                          {edu.grade}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{edu.institution}</p>
                      {edu.period && (
                        <p className="text-xs text-muted-foreground font-mono mt-1">{edu.period}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-muted">
                  <LanguagesIcon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">Languages</h3>
              </div>
              <div className="space-y-4">
                {LANGUAGES.map((lang) => (
                  <motion.div
                    key={lang.name}
                    variants={fadeUpVariants}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{lang.name}</span>
                      <span className="text-xs text-muted-foreground">{lang.proficiency}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lang.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                        className="h-full bg-foreground rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
