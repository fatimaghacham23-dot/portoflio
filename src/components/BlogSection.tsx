import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, Sparkles, Tag, User, X } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  blogs: BlogPost[];
  onBlogInteractTracker: () => void;
}

export default function BlogSection({
  blogs,
  onBlogInteractTracker,
}: BlogSectionProps) {
  const [readingBlog, setReadingBlog] = useState<BlogPost | null>(null);

  const handleOpenBlog = (blog: BlogPost) => {
    setReadingBlog(blog);
    onBlogInteractTracker();
  };

  return (
    <section id="blog-section" className="py-16 sm:py-24 bg-[#FAF9F5] relative overflow-hidden">
      <div className="absolute top-20 left-[-100px] w-96 h-96 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-[-100px] w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100/60 text-amber-700 text-xs font-medium tracking-widest uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Vibrant Editorial
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight font-light text-slate-900 mb-6 leading-tight">
            Designer Journals: <span className="font-serif italic text-rose-600 font-normal">Botanics & Fabric</span>
          </h2>

          <p className="max-w-2xl mx-auto text-slate-500 font-sans leading-relaxed text-sm sm:text-base">
            Published notes and reflections from Fatima's studio. Tap on an editorial piece to enter the Reading Room.
          </p>
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
            {blogs.map((blog, idx) => (
              <motion.div
                key={blog.id}
                id={`blog-card-${blog.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-amber-100/80 shadow-sm hover:shadow-xl transition-all duration-400 cursor-pointer flex flex-col min-h-[420px] sm:h-[460px]"
                onClick={() => handleOpenBlog(blog)}
              >
                <div className="relative h-48 sm:h-56 bg-slate-100 overflow-hidden">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />

                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-sm shadow rounded-full font-sans text-[10px] font-semibold tracking-wide text-slate-700">
                    {blog.date}
                  </div>
                </div>

                <div className="p-5 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1.5 flex-wrap mb-3.5">
                      {blog.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider font-sans font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-sans font-medium tracking-tight text-[#1E293B] group-hover:text-amber-700 transition-colors duration-300 line-clamp-2 mb-2">
                      {blog.title}
                    </h3>

                    <p className="text-sm font-sans text-slate-500 line-clamp-2 leading-relaxed">
                      {blog.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 font-sans text-xs">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-300" /> By {blog.author}
                    </span>
                    <span className="flex items-center gap-1 text-rose-500 font-semibold">
                      Read <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 rounded-3xl border border-slate-100 shadow-sm py-16 px-6 text-center">
            <Tag className="w-8 h-8 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-sans text-sm">No blog posts yet.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {readingBlog && (
          <div id="blog-reader-modal" className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl my-4 sm:my-auto border border-slate-100 flex flex-col max-h-[92vh] md:max-h-[85vh]"
            >
              <button
                id="close-blog-modal"
                onClick={() => setReadingBlog(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 bg-slate-900/90 text-white rounded-full hover:bg-rose-600 hover:scale-105 transition-all shadow-md focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-y-auto">
                <div className="relative h-[240px] sm:h-[280px] md:h-[340px] bg-slate-100">
                  <img
                    src={readingBlog.coverImage}
                    alt={readingBlog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                  <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 right-5 sm:right-8 text-white">
                    <div className="flex gap-2 mb-3">
                      {readingBlog.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-sans font-semibold tracking-wider rounded uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3.5xl font-sans tracking-tight font-light text-white leading-tight">
                      {readingBlog.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-8 md:p-12">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 font-sans pb-6 border-b border-slate-100 mb-8">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Published by <strong className="text-slate-800">{readingBlog.author}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Date: {readingBlog.date}
                    </span>
                  </div>

                  <div className="prose prose-rose max-w-none text-slate-700 font-sans leading-relaxed text-sm md:text-base space-y-5">
                    {readingBlog.content.split('\n\n').map((para, i) => {
                      if (para.startsWith('###')) {
                        return (
                          <h4 key={i} className="text-lg md:text-xl font-sans font-bold text-slate-900 tracking-tight pt-4">
                            {para.replace('###', '').trim()}
                          </h4>
                        );
                      }
                      if (para.startsWith('*')) {
                        return (
                          <div key={i} className="pl-4 border-l-2 border-rose-500/80 italic text-slate-600 my-1">
                            {para.replace('*', '').trim()}
                          </div>
                        );
                      }
                      return <p key={i}>{para}</p>;
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
