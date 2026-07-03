'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PROJECTS, PROJECT_TABS, type ProjectCategory } from '@/lib/constants';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';

function ProjectPlaceholder({ color, title }: { color: string; title: string }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: color }}
    >
      {/* Geometric pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-20 h-20 border border-white/30 rounded-full" />
        <div className="absolute bottom-8 right-8 w-32 h-32 border border-white/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-white/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-40 bg-white/30" />
      </div>
      <span className="text-white/40 text-sm font-medium tracking-[0.2em] uppercase">
        {title}
      </span>
    </div>
  );
}

export function Projects() {
  const [activeTab, setActiveTab] = useState<ProjectCategory>('Featured');

  const filteredProjects = PROJECTS.filter((p) =>
    p.categories.includes(activeTab)
  );

  return (
    <section id="projects" className="section-padding border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Projects"
          subtitle="Selected work showcasing full-stack, AI/ML, and hackathon projects"
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 md:mb-16">
          {PROJECT_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="grid md:grid-cols-2 gap-6 md:gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                variants={fadeUpVariants}
                className={`group relative rounded-2xl border border-border overflow-hidden hover:border-foreground/30 transition-all duration-500 ${
                  index === 0 && filteredProjects.length > 2 ? 'md:col-span-2' : ''
                }`}
              >
                {/* Image Area */}
                <div className={`relative overflow-hidden ${
                  index === 0 && filteredProjects.length > 2 ? 'h-64 md:h-80' : 'h-48 md:h-56'
                }`}>
                  <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700">
                    <ProjectPlaceholder color={project.color} title={project.title} />
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <span className="text-white text-sm font-medium tracking-wider flex items-center gap-2">
                        View Details <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300 shrink-0 mt-1" />
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-[11px] font-medium tracking-wide rounded-full bg-muted text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Outcome */}
                  {project.outcome && (
                    <div className="pt-4 border-t border-border">
                      <span className="text-xs font-medium tracking-wider text-foreground">
                        {project.outcome}
                      </span>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
