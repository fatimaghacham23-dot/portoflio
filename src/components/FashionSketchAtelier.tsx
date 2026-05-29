import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Brush, Eye, Sparkles, X } from 'lucide-react';
import { FashionSketch } from '../types';

interface FashionSketchAtelierProps {
  sketches: FashionSketch[];
}

const techniqueFilters = ['all', 'Pencil', 'Marker', 'Watercolor', 'Digital', 'Mixed Media', 'Other'] as const;

export default function FashionSketchAtelier({ sketches }: FashionSketchAtelierProps) {
  const [activeTechnique, setActiveTechnique] = useState<(typeof techniqueFilters)[number]>('all');
  const [selectedSketch, setSelectedSketch] = useState<FashionSketch | null>(null);

  const filteredSketches = sketches.filter(sketch => {
    if (activeTechnique === 'all') return true;
    return sketch.technique === activeTechnique;
  });

  return (
    <section id="fashion-sketches-section" className="py-16 sm:py-24 bg-[#FAF7F2] relative overflow-hidden">
      <div className="absolute top-10 left-[-120px] w-96 h-96 rounded-full bg-rose-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-[-120px] w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-100 text-rose-600 text-xs font-body font-semibold tracking-widest uppercase mb-4 shadow-sm"
          >
            <Brush className="w-3.5 h-3.5 text-rose-500" />
            Fashion Sketch Atelier
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight font-light text-slate-900 leading-tight"
          >
            Hand-Drawn Fashion <span className="font-serif italic font-normal text-rose-600">Imagination</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="text-sm sm:text-base font-body text-slate-500 leading-relaxed mt-5"
          >
            A dedicated sketch room for fashion silhouettes, clothing ideas, textile moods, and illustration studies shaped by Fatima’s early passion for drawing and style.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {techniqueFilters.map(technique => (
            <button
              key={technique}
              type="button"
              onClick={() => setActiveTechnique(technique)}
              className={`px-4 py-2.5 rounded-full text-xs font-body font-semibold transition-all ${
                activeTechnique === technique
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                  : 'bg-white/80 text-slate-500 border border-slate-100 hover:text-rose-600 hover:border-rose-100'
              }`}
            >
              {technique === 'all' ? 'All Sketches' : technique}
            </button>
          ))}
        </div>

        {filteredSketches.length > 0 ? (
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6 space-y-5 sm:space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredSketches.map((sketch, index) => (
                <motion.article
                  key={sketch.id}
                  layout
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  onClick={() => setSelectedSketch(sketch)}
                  className="break-inside-avoid group cursor-pointer bg-white rounded-[2rem] overflow-hidden border border-white shadow-sm hover:shadow-2xl hover:shadow-rose-950/10 transition-all duration-500"
                >
                  <div className="relative overflow-hidden bg-white">
                    <img
                      src={sketch.imageUrl}
                      alt={sketch.title}
                      referrerPolicy="no-referrer"
                      className="w-full object-cover max-h-[560px] group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-mono tracking-widest uppercase text-rose-600 shadow-sm">
                      {sketch.technique}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-sans font-medium tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                        {sketch.title}
                      </h3>
                      {sketch.year && (
                        <span className="text-[10px] font-mono text-slate-400 pt-1">
                          {sketch.year}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-body text-slate-500 leading-relaxed mt-3 line-clamp-2">
                      {sketch.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm py-16 px-6 text-center">
            <Sparkles className="w-8 h-8 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-body text-sm">
              No fashion sketches published yet.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedSketch && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              className="relative w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row my-4"
            >
              <button
                type="button"
                onClick={() => setSelectedSketch(null)}
                className="absolute top-4 right-4 z-50 p-2.5 bg-slate-900/90 text-white rounded-full hover:bg-rose-600 transition-all"
                aria-label="Close sketch"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full lg:w-3/5 bg-[#F8F3EC] flex items-center justify-center min-h-[360px] lg:min-h-[720px]">
                <img
                  src={selectedSketch.imageUrl}
                  alt={selectedSketch.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-[80vh]"
                />
              </div>

              <div className="w-full lg:w-2/5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <span className="inline-flex px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-mono tracking-widest uppercase">
                    {selectedSketch.technique}
                  </span>

                  <h3 className="text-3xl font-sans font-light tracking-tight text-slate-900 mt-5">
                    {selectedSketch.title}
                  </h3>

                  {selectedSketch.year && (
                    <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400 mt-2">
                      Sketch Year: {selectedSketch.year}
                    </p>
                  )}

                  <div className="h-px bg-slate-100 my-6" />

                  <p className="text-sm font-body text-slate-600 leading-relaxed">
                    {selectedSketch.description}
                  </p>

                  {selectedSketch.inspiration && (
                    <div className="mt-7 p-5 rounded-2xl bg-rose-50/60 border border-rose-100">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-rose-600 block mb-2">
                        Inspiration Notes
                      </span>
                      <p className="text-sm font-body text-slate-600 leading-relaxed">
                        {selectedSketch.inspiration}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSketch(null)}
                  className="mt-8 w-full py-3 bg-slate-900 hover:bg-rose-600 text-white rounded-xl text-sm font-body font-semibold transition-all"
                >
                  Close Sketch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
