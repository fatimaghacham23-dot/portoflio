import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, X, Palette, Scissors, Layers, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface PortfolioGalleryProps {
  projects: Project[];
  onProjectClickTracker: (type: 'fashion' | 'graphic' | 'hybrid') => void;
  onInquireAboutProject: (projectTitle: string) => void;
}

export default function PortfolioGallery({
  projects,
  onProjectClickTracker,
  onInquireAboutProject,
}: PortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'fashion' | 'graphic' | 'hybrid'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredProjects = projects.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    onProjectClickTracker(project.category);
  };

  return (
    <section id="portfolio-section" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background Floral Overlay Elements */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-5%] w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium tracking-widest uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Vibrant Creations Gallery
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-body tracking-tight font-light text-slate-900 mb-6 leading-tight"
          >
            Design Showcase: <span className="font-serif italic font-normal text-rose-600">Pure Botanics & Pixel</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-500 font-body leading-relaxed text-sm sm:text-base"
          >
            Step into Fatima’s immersive collection, bridging sensory textile engineering and gorgeous artistic brand systems. Hover to blossom, click to step into the designer’s notebook.
          </motion.p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-10 sm:mb-16">
          {(['all', 'fashion', 'graphic', 'hybrid'] as const).map(cat => (
            <button
              key={cat}
              id={`filter-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-body tracking-wide transition-all duration-300 relative ${
                activeCategory === cat
                  ? 'text-white font-medium bg-slate-900 shadow-lg shadow-slate-900/10'
                  : 'text-slate-600 hover:text-rose-600 bg-white/60 hover:bg-rose-50/50 border border-slate-100'
              }`}
            >
              {cat === 'all' && 'All Masterpieces'}
              {cat === 'fashion' && 'Fashion & Silhouette'}
              {cat === 'graphic' && 'Graphic & Layout'}
              {cat === 'hybrid' && 'Hybrid / Tech-Textiles'}

              {activeCategory === cat && (
                <motion.span
                  layoutId="activeFilterTabIndicator"
                  className="absolute inset-0 rounded-full border border-rose-500 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Responsive Staggered Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                id={`project-card-${project.id}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col min-h-[520px] sm:min-h-[620px]"
                onClick={() => handleOpenProject(project)}
              >
                {/* Custom Decorative Floating Tag */}
                <span className="absolute top-6 left-6 z-30 px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white font-body text-[11px] font-medium tracking-widest uppercase flex items-center gap-1.5 shadow-md">
                  {project.category === 'fashion' && <Scissors className="w-3 h-3 text-rose-400" />}
                  {project.category === 'graphic' && <Layers className="w-3 h-3 text-emerald-400" />}
                  {project.category === 'hybrid' && <Palette className="w-3 h-3 text-sky-400" />}
                  {project.category.toUpperCase()}
                </span>

                {/* Display Image Outer with Floral Hover effect */}
                <div className="relative w-full h-[300px] sm:h-[360px] lg:h-[420px] overflow-hidden bg-white">
                  {project.mediaType === 'video' ? (
                    <video
                      src={project.mediaUrl || project.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{ objectPosition: `${project.mediaPositionX ?? 50}% ${project.mediaPositionY ?? 50}%` }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={project.mediaUrl || project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      style={{ objectPosition: `${project.mediaPositionX ?? 50}% ${project.mediaPositionY ?? 50}%` }}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

                  {/* Blossom interactive ring on hover */}
                  <AnimatePresence>
                    {hoveredId === project.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        {/* Decorative bloom design */}
                        <div className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg border border-white/20 select-none">
                          <Search className="w-5 h-5 animate-pulse" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Text Context Area */}
                <div className="p-5 sm:p-8 flex-1 flex flex-col justify-between bg-white relative">
                  {/* Miniature decorative leaf corners for design feel */}
                  <span className="absolute right-6 top-6 w-3 h-3 border-r-2 border-t-2 border-rose-500/0 group-hover:border-rose-500/20 transition-all duration-500" />
                  <span className="absolute left-6 bottom-6 w-3 h-3 border-l-2 border-b-2 border-rose-500/0 group-hover:border-rose-500/20 transition-all duration-500" />

                  <div>
                    <h3 className="text-lg sm:text-xl font-sans tracking-tight font-medium text-slate-900 group-hover:text-rose-600 transition-colors duration-300 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mb-4 flex items-center gap-1.5">
                      <span>CLIENT: {project.clientName || 'STUDIO WORK'}</span>
                      <span className="text-slate-200">/</span>
                      <span>{project.date}</span>
                    </p>
                    <p className="text-sm text-slate-500 font-body line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags mapping */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] font-body font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"
                      >
                        #{tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[11px] font-body text-rose-500 bg-rose-50 px-2 py-1 rounded-md self-center">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm py-16 px-6 text-center"
              >
                <Sparkles className="w-8 h-8 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-body text-sm">No projects published yet.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* DETAILED PROJECT BOARD MODAL DRAWER */}
      <AnimatePresence>
        {selectedProject && (
          <div id="project-detail-modal" className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row my-4 sm:my-auto border border-white/10"
            >
              {/* Escape Button */}
              <button
                id="close-project-modal"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 bg-slate-900/90 text-white rounded-full hover:bg-rose-600 hover:scale-105 transition-all shadow-md focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Banner / Product View Image Area */}
              <div className="w-full lg:w-1/2 relative bg-white h-[320px] sm:h-[420px] lg:h-auto lg:min-h-[560px]">
                {selectedProject.mediaType === 'video' ? (
                  <video
                    src={selectedProject.mediaUrl || selectedProject.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    style={{ objectPosition: `${selectedProject.mediaPositionX ?? 50}% ${selectedProject.mediaPositionY ?? 50}%` }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={selectedProject.mediaUrl || selectedProject.image}
                    alt={selectedProject.title}
                    referrerPolicy="no-referrer"
                    style={{ objectPosition: `${selectedProject.mediaPositionX ?? 50}% ${selectedProject.mediaPositionY ?? 50}%` }}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent lg:hidden" />
                <div className="absolute bottom-6 left-6 right-6 lg:hidden">
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-body text-xs tracking-wider uppercase font-medium">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-2xl font-sans text-white font-light tracking-tight mt-2">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Design & Specifications Board Details Area */}
              <div className="w-full lg:w-1/2 p-5 sm:p-8 lg:p-12 overflow-y-auto max-h-none lg:max-h-[800px] flex flex-col justify-between">
                <div>
                  <div className="hidden lg:block mb-6">
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white font-body text-xs tracking-wider uppercase font-semibold">
                      {selectedProject.category.toUpperCase()} MASTERPIECE
                    </span>
                    <h3 className="text-3xl font-sans text-slate-900 font-light tracking-tight mt-3">
                      {selectedProject.title}
                    </h3>
                  </div>

                  <p className="text-[10px] sm:text-xs font-mono text-slate-400 tracking-wide uppercase mb-6 flex flex-wrap items-center gap-1.5">
                    <span>CREATION DATE: {selectedProject.date}</span>
                    <span>/</span>
                    <span>CLIENT: {selectedProject.clientName || 'STUDIO WORK'}</span>
                  </p>

                  <div className="h-px bg-slate-100 w-full mb-6" />

                  {/* Conceptual Description */}
                  <div className="mb-8">
                    <h4 className="text-xs font-sans font-bold text-slate-800 tracking-wider uppercase mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-500" />
                      THE CONCEPT & STORYBOARD
                    </h4>
                    <p className="text-slate-600 text-sm font-body leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* High Realism: Dynamic Design Specifications Modules */}
                  {selectedProject.fashionDetails && (
                    <div className="mb-8 p-5 bg-rose-50/50 rounded-2xl border border-rose-100/60">
                      <h4 className="text-xs font-sans font-semibold text-rose-700 tracking-wider uppercase mb-3 flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-rose-500" />
                        HAUTE COUTURE SPECIFICATIONS
                      </h4>
                      <div className="space-y-2.5 text-xs font-body text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-800">Materials: </span>
                          {selectedProject.fashionDetails.fabrics}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-800">Architecture: </span>
                          {selectedProject.fashionDetails.silhouette}
                        </p>
                        
                        {/* Interactive Color Swatch Board */}
                        <div className="pt-2">
                          <span className="font-semibold text-slate-800 block mb-2">Botanical Palette:</span>
                          <div className="flex gap-2">
                            {selectedProject.fashionDetails.palette?.map(color => (
                              <div key={color} className="group/swatch relative flex items-center justify-center">
                                <div
                                  className="w-8 h-8 rounded-full border border-slate-200/50 shadow-sm cursor-help hover:scale-110 transition-all duration-300"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="absolute bottom-10 scale-0 group-hover/swatch:scale-100 bg-slate-900 text-white font-mono text-[9px] px-1.5 py-0.5 rounded transition-transform">
                                  {color}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedProject.graphicDetails && (
                    <div className="mb-8 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/60">
                      <h4 className="text-xs font-sans font-semibold text-emerald-800 tracking-wider uppercase mb-3 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-500" />
                        GRAPHIC DESIGN BLUEPRINT
                      </h4>
                      <div className="space-y-2.5 text-xs font-body text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-800">Typography Pairing: </span>
                          <span className="font-serif italic">{selectedProject.graphicDetails.typography}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-slate-800">Spectrum/Color Space: </span>
                          {selectedProject.graphicDetails.colorSpace}
                        </p>
                        <div className="pt-1.5 flex flex-wrap gap-1.5">
                          {selectedProject.graphicDetails.software?.map(soft => (
                            <span
                              key={soft}
                              className="px-2 py-0.5 rounded bg-emerald-100 text-[10px] font-body font-medium text-emerald-800"
                            >
                              {soft}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fully functional list of tags */}
                  <div className="mb-4">
                    <span className="text-xs font-body font-bold text-slate-800 tracking-wider uppercase block mb-2.5">
                      TAG CREDITS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tags.map(t => (
                        <span
                          key={t}
                          className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-xs font-body rounded-md"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Direct Action triggers to create seamless scroll links described in design philosophy */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <button
                    id="modal-inquire-action"
                    onClick={() => {
                      onInquireAboutProject(selectedProject.title);
                      setSelectedProject(null);
                    }}
                    className="flex-1 py-3 px-3 bg-rose-600 hover:bg-rose-700 font-body font-medium text-white rounded-xl text-center text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:translate-x-1"
                  >
                    Discuss Packaging & Dress Customization
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    id="modal-back-action"
                    onClick={() => setSelectedProject(null)}
                    className="py-3 px-6 bg-slate-50 hover:bg-slate-100 font-body text-slate-600 rounded-xl text-center text-sm transition-all"
                  >
                    Keep Browsing
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}