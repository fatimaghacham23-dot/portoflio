import { Award, Briefcase, Download, GraduationCap, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function ResumeView() {
  return (
    <section id="resume-section" className="py-16 sm:py-24 relative overflow-hidden bg-white">
      <div className="absolute top-[30%] left-[-100px] w-80 h-80 bg-rose-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[25%] right-[-120px] w-96 h-96 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-10">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium tracking-widest uppercase mb-4"
              >
                <Award className="w-3.5 h-3.5 text-rose-500" />
                Artistic Resume
              </motion.div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-light tracking-tight text-slate-900 leading-tight">
                Curriculum Vitae: <br />
                <span className="font-serif italic font-normal text-rose-600">The Creative Matrix</span>
              </h3>
              <p className="text-sm font-body text-slate-500 mt-4 leading-relaxed">
                Fatima Ghacham is building a creative path shaped by fashion inspiration, visual design, and a long-standing love for drawing fashion clothing from a young age.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono tracking-widest text-slate-400 block uppercase">
                Professional Skills
              </span>

              <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-5">
                {[
                  { label: 'Fashion inspiration', value: 88 },
                  { label: 'Creative drawing', value: 84 },
                  { label: 'Visual composition', value: 78 },
                  { label: 'Textile and clothing concepts', value: 74 },
                ].map(skill => (
                  <div key={skill.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-body font-semibold text-slate-700">
                        {skill.label}
                      </span>
                      <span className="text-[10px] font-mono text-rose-500">
                        {skill.value}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white border border-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="h-full rounded-full bg-rose-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              id="download-resume-btn"
              type="button"
              disabled
              className="w-full py-4.5 bg-slate-900 text-white font-body text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 border border-slate-950/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Resume PDF not connected yet
            </button>
          </div>

          <div className="lg:col-span-7 space-y-10">
            <span className="text-xs font-mono tracking-widest text-[#E11D48] block uppercase">
              Professional Timeline
            </span>

            <div className="relative border-l border-slate-100 pl-5 sm:pl-6 md:pl-8 space-y-10 font-body">
              <div className="relative group/timeline">
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4.5 h-4.5 rounded-full bg-slate-100 group-hover/timeline:bg-rose-100 transition-colors flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-400 group-hover/timeline:bg-rose-600 transition-colors" />
                </div>
                <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <h4 className="text-base font-sans font-medium text-slate-900 tracking-tight">
                        Creative Fashion & Visual Design Practice
                      </h4>
                      <p className="text-[10px] font-mono text-rose-500 uppercase tracking-widest mt-1">
                        Around 1.5 years experience
                      </p>
                      <p className="text-sm font-body text-slate-500 leading-relaxed mt-4">
                        Practical experience developing fashion concepts, scarf-inspired visual ideas, styling direction, and refined design compositions. Her creative eye is influenced by an early talent for drawing and imagining fashion clothing from a young age.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <span className="text-[10px] font-mono tracking-widest text-[#E11D48] block uppercase mb-4">
                Education
              </span>
              <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="text-base font-sans font-medium text-slate-900 tracking-tight">
                      Islamic University of Lebanon, Sour
                    </h4>
                    <p className="text-[10px] font-mono text-rose-500 uppercase tracking-widest mt-1">
                      Medical Laboratory Science
                    </p>
                    <p className="text-sm font-body text-slate-500 leading-relaxed mt-4">
                      Fatima studies Medical Laboratory Science while continuing to develop her creative direction in design and fashion. This balance gives her work a thoughtful mix of precision, observation, elegance, and artistic sensitivity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}