'use client';


import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown, ArrowRight, Download } from 'lucide-react';
import { HERO_HEADLINES, HERO_ROLES } from '@/lib/constants';
import { staggerContainerVariants, fadeUpVariants, textRevealVariants } from '@/lib/animations';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { OrbitingParticles } from '@/components/ui/OrbitingParticles';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 md:pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left — Text Content */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="order-2 lg:order-1"
          > 
            {/* Label */}
            <motion.div variants={fadeUpVariants} className="mb-6">
              <span className="text-label text-muted-foreground">Portfolio 2026</span>
            </motion.div>

            {/* Headlines */}
            <div className="space-y-1 md:space-y-2 mb-8">
              {HERO_HEADLINES.map((headline, i) => (
                <div key={headline} className="overflow-hidden">
                  <motion.h1
                    variants={textRevealVariants}
                    custom={i}
                    className="text-editorial text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
                    style={{
                      transitionDelay: `${i * 0.15}s`,
                    }}
                  >
                    {headline}
                    {headline === 'Hackathon Leader' && (
                      <span className="text-gradient-mask">.</span>
                    )}
                  </motion.h1>
                </div>
              ))}
            </div>

            {/* Subheadline */}
            <motion.p
              variants={fadeUpVariants}
              className="text-body text-muted-foreground text-base md:text-lg max-w-lg mb-8"
            >
              Full stack developer building scalable systems across AI/ML, backend, and real-time applications.
            </motion.p>

            {/* Role Tags */}
            <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-2 mb-10">
              {HERO_ROLES.map((role, i) => (
                <motion.span
                  key={role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.08, duration: 0.4 }}
                  className="px-4 py-1.5 text-xs font-medium tracking-wide rounded-full border border-border bg-white hover:bg-foreground hover:text-background transition-all duration-300 cursor-default"
                >
                  {role}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-4">
              <MagneticButton href="#projects" variant="primary">
                View Projects <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton href="#" variant="outline" download>
                Download Resume <Download className="w-4 h-4" />
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right — Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative circle behind image */}
              <div className="absolute -inset-4 md:-inset-6 rounded-full border border-border/40" />
              <div className="absolute -inset-8 md:-inset-12 rounded-full border border-border/20" />

              {/* Orbiting particles */}
              <OrbitingParticles />
              
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-2 border-border/30">
                <Image
                  src="/images/profile.png"
                  alt="IYYNESWARAN P — Full Stack Developer"
                  width={500}
                  height={600}
                  className="w-full h-full object-cover object-top"
                  preload
                />
              </div>

              {/* Floating label */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 bg-foreground text-background px-4 py-2 rounded-full text-xs font-medium tracking-wider shadow-lg"
              >
                Available for work
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-label text-muted-foreground text-[10px]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
