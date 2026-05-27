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
              <p className="text-sm font-sans text-slate-500 mt-4 leading-relaxed">
                Resume details are not published yet.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono tracking-widest text-slate-400 block uppercase">
                Professional Skills
              </span>

              <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <Sparkles className="w-8 h-8 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-sans text-sm">No resume skills published yet.</p>
              </div>
            </div>

            <button
              id="download-resume-btn"
              type="button"
              disabled
              className="w-full py-4.5 bg-slate-900 text-white font-sans text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 border border-slate-950/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Resume PDF not connected yet
            </button>
          </div>

          <div className="lg:col-span-7 space-y-10">
            <span className="text-xs font-mono tracking-widest text-[#E11D48] block uppercase">
              Professional Timeline
            </span>

            <div className="relative border-l border-slate-100 pl-5 sm:pl-6 md:pl-8 space-y-10 font-sans">
              <div className="relative group/timeline">
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4.5 h-4.5 rounded-full bg-slate-100 group-hover/timeline:bg-rose-100 transition-colors flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-400 group-hover/timeline:bg-rose-600 transition-colors" />
                </div>
                <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-sans text-sm">No work history published yet.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <span className="text-[10px] font-mono tracking-widest text-[#E11D48] block uppercase mb-4">
                Education
              </span>
              <div className="p-6 sm:p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <GraduationCap className="w-8 h-8 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-sans text-sm">No education details published yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
