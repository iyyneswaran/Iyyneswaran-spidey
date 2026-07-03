'use client';

import { motion } from 'framer-motion';
import { textRevealVariants, staggerContainerVariants } from '@/lib/animations';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ title, subtitle, align = 'left', className = '' }: SectionHeadingProps) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={`mb-16 md:mb-20 ${align === 'center' ? 'text-center' : ''} ${className}`}
    >
      <div className="overflow-hidden">
        <motion.h2
          variants={textRevealVariants}
          className="text-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground"
        >
          {title}
        </motion.h2>
      </div>
      {subtitle && (
        <motion.p
          variants={textRevealVariants}
          className="mt-4 md:mt-6 text-body text-muted-foreground text-base md:text-lg max-w-2xl"
          style={align === 'center' ? { marginInline: 'auto' } : {}}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        variants={textRevealVariants}
        className={`mt-6 h-px bg-border w-24 ${align === 'center' ? 'mx-auto' : ''}`}
      />
    </motion.div>
  );
}
