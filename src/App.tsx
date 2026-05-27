import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Instagram, Linkedin, Lock, MoveDown, Sparkles
} from 'lucide-react';
import { AdminSession, Project, BlogPost } from './types';
import { getProjects, getBlogPosts, getCurrentAdminSession, signOutAdmin } from './utils/api';
import FloralCanvas from './components/FloralCanvas';
import PortfolioGallery from './components/PortfolioGallery';
import BlogSection from './components/BlogSection';
import ResumeView from './components/ResumeView';
import Dashboard from './components/Dashboard';
import ContactForm from './components/ContactForm';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  // Prefilled contact form subject when clicking project action
  const [prefilledSubject, setPrefilledSubject] = useState('');

  const [session, setSession] = useState<AdminSession | null>(null);

  // Dynamic feedback parameters for active user scrolls
  const [scrolledPct, setScrolledPct] = useState(0);

  // Pre-load data
  useEffect(() => {
    loadAllContents();
    getCurrentAdminSession().then(setSession).catch(() => setSession(null));

    const handleProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height > 0) {
        setScrolledPct((window.scrollY / height) * 100);
      }
    };
    window.addEventListener('scroll', handleProgress, { passive: true });
    return () => window.removeEventListener('scroll', handleProgress);
  }, []);

  const loadAllContents = async () => {
    try {
      const projs = await getProjects();
      const articleList = await getBlogPosts();
      setProjects(projs);
      setBlogs(articleList);
    } catch (err) {
      console.error('Failed to load Supabase content:', err);
    }
  };

  // Scroll to layout sections helper
  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquireFromProject = (projectTitle: string) => {
    setPrefilledSubject(projectTitle);
    scrollToAnchor('contact-section');
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased relative selection:bg-rose-100 selection:text-rose-900">
      
      {/* Scroll-driven top progress bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500 z-50 transition-all duration-100 origin-left"
        style={{ transform: `scaleX(${scrolledPct / 100})` }}
      />

      {/* Falling Floral Backdrop */}
      <FloralCanvas />

      {/* Glassmorphism Floating Ribbon Navigation */}
      <header className="fixed top-3 sm:top-5 left-3 right-3 sm:inset-x-0 sm:mx-auto max-w-5xl rounded-3xl sm:rounded-full bg-white/80 backdrop-blur-md border border-slate-100 shadow-md py-2.5 sm:py-3 px-3 sm:px-6 md:px-8 flex items-center justify-between gap-3 z-40 transition-all">
        
        {/* Brand Icon or Monogram logo */}
        <div 
          onClick={() => scrollToAnchor('hero-section')} 
          className="flex items-center gap-2 min-w-0 cursor-pointer select-none group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-serif italic text-sm font-bold group-hover:bg-rose-600 transition-colors">
            F
          </div>
          <span className="font-sans font-semibold text-xs sm:text-sm tracking-wide text-slate-900 group-hover:text-rose-600 transition-colors truncate">
            Fatima <span className="text-rose-600 font-serif italic font-normal">Ghacham</span>
          </span>
        </div>

        {/* Ribbons links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs font-sans font-medium text-slate-600">
          <button onClick={() => scrollToAnchor('portfolio-section')} className="hover:text-rose-600 focus:outline-none transition-colors">Showroom</button>
          <button onClick={() => scrollToAnchor('blog-section')} className="hover:text-rose-600 focus:outline-none transition-colors">Journals</button>
          <button onClick={() => scrollToAnchor('resume-section')} className="hover:text-rose-600 focus:outline-none transition-colors">CV Matrix</button>
          <button onClick={() => scrollToAnchor('dashboard-section')} className="hover:text-rose-500 focus:outline-none transition-colors flex items-center gap-1 font-mono text-[11px] text-[#E11D48] bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
            <Lock className="w-3 h-3" /> Admin Portal
          </button>
        </nav>

        {/* Call to collaborate action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {session && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-semibold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Admin: {session.username.split(' ')[0]}
            </div>
          )}
          <button
            onClick={() => scrollToAnchor('contact-section')}
            className="px-3 sm:px-4.5 py-2 rounded-full bg-slate-900 hover:bg-rose-600 text-white text-[11px] sm:text-xs font-sans font-medium transition-all shadow-sm hover:translate-y-[-1px]"
          >
            Collaborate
          </button>
        </div>
      </header>

      {/* HERO / WELCOME LANDING CANVAS */}
      <section id="hero-section" className="min-h-screen flex items-center justify-center pt-28 sm:pt-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#FDFCF7] to-white">
        {/* Soft floral colors backdrop circles */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-amber-50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-rose-50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-20">
          
          {/* Glowing launcher note */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            Vibrant Fashion & Graphic Alchemist
          </motion.div>

          {/* Majestic Typography titles */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-8xl font-sans tracking-tight font-extralight text-slate-900 leading-tight"
            >
              Fatima <span className="font-serif italic font-normal text-rose-600">Ghacham</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl font-sans text-slate-500 leading-normal max-w-2xl mx-auto"
            >
              Botanical texture, expressive layout, and fashion-led visual systems shaped into vivid digital aesthetics.
            </motion.p>
          </div>

          {/* Interactive blossom widgets buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch sm:items-center gap-3 sm:gap-4 pt-4"
          >
            <button
              onClick={() => scrollToAnchor('portfolio-section')}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-sans font-semibold transition-all shadow-md hover:-translate-y-0.5"
            >
              Explore Showroom
            </button>
            
            <button
              onClick={() => {
                scrollToAnchor('blog-section');
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 rounded-xl text-sm font-sans font-medium transition-all"
            >
              Open Editorial Journals
            </button>
          </motion.div>

          {/* Micro scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.6, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
            className="flex flex-col items-center gap-2 pt-16 cursor-pointer"
            onClick={() => scrollToAnchor('portfolio-section')}
          >
            <span className="text-xs font-mono tracking-widest text-slate-400">SCROLL DOWN TO BLOSSOM</span>
            <MoveDown className="w-4 h-4 text-slate-400" />
          </motion.div>

        </div>
      </section>

      {/* MAIN LAYOUTS CORE */}
      <main>
        
        {/* SECTION 1: Categorized Portfolio Grid */}
        <PortfolioGallery
          projects={projects}
          onProjectClickTracker={() => undefined}
          onInquireAboutProject={handleInquireFromProject}
        />

        {/* SECTION 2: Blog editorial journals */}
        <BlogSection
          blogs={blogs}
          onBlogInteractTracker={() => undefined}
        />

        {/* SECTION 3: Curriculum Vitae experience blueprint */}
        <ResumeView />

        {/* SECTION 4: Supabase admin dashboard */}
        <Dashboard
          currentSession={session}
          onLoginSuccess={(sess) => setSession(sess)}
          onLogout={handleLogout}
          onRefreshPortfolio={loadAllContents}
        />

        {/* SECTION 5: Contact Envelope styled inquiry form */}
        <ContactForm
          prefilledSubject={prefilledSubject}
          onClearPrefilledSubject={() => setPrefilledSubject('')}
        />

      </main>

      {/* HIGH POLISHED COMPOSURE FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-14 sm:py-20 px-4 sm:px-6 font-sans border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 text-center sm:text-left">
          
          {/* Logo card column */}
          <div className="space-y-4">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-serif italic text-sm font-bold">
                F
              </div>
              <span className="font-semibold text-sm tracking-wide text-white">
                Fatima Ghacham
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Artistic graphic and fashion portfolio work. Published projects, journal posts, and contact requests are managed with Supabase.
            </p>
          </div>

          {/* Useful categories quick jumps */}
          <div className="space-y-3.5 text-xs text-slate-400">
            <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 font-bold block">SHOWROOM SECTIONALS</span>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToAnchor('portfolio-section')} className="hover:text-white transition">Fashion Silhouettes</button></li>
              <li><button onClick={() => scrollToAnchor('portfolio-section')} className="hover:text-white transition">Graphic Layout Boards</button></li>
              <li><button onClick={() => scrollToAnchor('portfolio-section')} className="hover:text-white transition">Digital Pattern Generators</button></li>
              <li><button onClick={() => scrollToAnchor('blog-section')} className="hover:text-white transition">Color & Slay theory</button></li>
            </ul>
          </div>

          {/* Client access tools */}
          <div className="space-y-3.5 text-xs text-slate-400">
            <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 font-bold block">ADMIN RESOURCES</span>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToAnchor('dashboard-section')} className="hover:text-white transition">Open admin dashboard</button></li>
              <li><button onClick={() => scrollToAnchor('resume-section')} className="hover:text-white transition">View resume section</button></li>
              <li><button onClick={() => scrollToAnchor('contact-section')} className="hover:text-white transition">Send a collaboration request</button></li>
            </ul>
          </div>

          {/* Social connections */}
          <div className="space-y-4 text-xs text-slate-400">
            <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 font-bold block">VISUALLY CONNECT</span>
            <div className="flex justify-center sm:justify-start gap-4">
              <button type="button" disabled title="Instagram link not connected yet" className="p-2.5 bg-white/5 rounded-full text-slate-500 transition-all shadow-sm cursor-not-allowed">
                <Instagram className="w-4 h-4" />
              </button>
              <button type="button" disabled title="LinkedIn link not connected yet" className="p-2.5 bg-white/5 rounded-full text-slate-500 transition-all shadow-sm cursor-not-allowed">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-[10px] text-slate-600 leading-normal pt-2">
              Social links are not connected yet.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-xs text-slate-600 font-mono leading-normal">
          <p>(c) 2026 FATIMA GHACHAM.</p>
        </div>
      </footer>

    </div>
  );
}
