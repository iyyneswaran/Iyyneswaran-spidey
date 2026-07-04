'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Link2, GitBranch, Globe, ArrowUpRight } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';
import { fadeUpVariants, staggerContainerVariants, textRevealVariants } from '@/lib/animations';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function Contact() {
  return (
    <section id="contact" className="relative bg-foreground text-background">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Big headline */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="mb-16 md:mb-20"
          >
            <div className="overflow-hidden">
              <motion.h2
                variants={textRevealVariants}
                className="text-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-background"
              >
                Let&apos;s Talk
              </motion.h2>
            </div>
            <motion.div
              variants={textRevealVariants}
              className="mt-6 h-px bg-white/20 w-24"
            />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left — Contact Info */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="space-y-6"
            >
              <motion.p
                variants={fadeUpVariants}
                className="text-white/60 text-base md:text-lg leading-relaxed max-w-md"
              >
                Have a project in mind or want to collaborate? Feel free to reach out.
              </motion.p>

              <motion.div variants={fadeUpVariants} className="space-y-4 pt-4">
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{CONTACT_INFO.email}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                {/* <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{CONTACT_INFO.phone}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a> */}
                <a
                  href={CONTACT_INFO.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                >
                  <Link2 className="w-4 h-4" />
                  <span className="text-sm">{CONTACT_INFO.linkedin}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href={CONTACT_INFO.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                >
                  <GitBranch className="w-4 h-4" />
                  <span className="text-sm">{CONTACT_INFO.github}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href={CONTACT_INFO.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{CONTACT_INFO.portfolio}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </motion.div>
            </motion.div>

            {/* Right — CTA Buttons */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="flex flex-col gap-4 justify-center"
            >
              <motion.div variants={fadeUpVariants}>
                <MagneticButton href={`mailto:${CONTACT_INFO.email}`} variant="outline-light" className="w-full justify-center">
                  <Mail className="w-4 h-4" /> Send Email
                </MagneticButton>
              </motion.div>
              <motion.div variants={fadeUpVariants}>
                <MagneticButton href={CONTACT_INFO.linkedinUrl} variant="outline-light" className="w-full justify-center">
                  <Link2 className="w-4 h-4" /> LinkedIn
                </MagneticButton>
              </motion.div>
              <motion.div variants={fadeUpVariants}>
                <MagneticButton href={CONTACT_INFO.githubUrl} variant="outline-light" className="w-full justify-center">
                  <GitBranch className="w-4 h-4" /> GitHub
                </MagneticButton>
              </motion.div>
              <motion.div variants={fadeUpVariants}>
                <MagneticButton href="#" variant="outline-light" className="w-full justify-center" download>
                  Download CV
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <span className="text-xs text-white/40 tracking-wider">
              © {new Date().getFullYear()} IYYNESWARAN P. All rights reserved.
            </span>
            <span className="text-xs text-white/40 tracking-wider">
              Designed & Built with passion
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
