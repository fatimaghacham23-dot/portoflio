import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Mail, Send } from 'lucide-react';
import { submitContactMessage } from '../utils/api';

interface ContactFormProps {
  prefilledSubject: string;
  onClearPrefilledSubject: () => void;
}

export default function ContactForm({
  prefilledSubject,
  onClearPrefilledSubject,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (prefilledSubject) {
      setFormData(prev => ({
        ...prev,
        subject: `Inquiry Regarding: ${prefilledSubject}`,
        message: `Hello Fatima,\n\nI was browsing your portfolio and would love to collaborate or request a custom design review for: "${prefilledSubject}".`,
      }));
    }
  }, [prefilledSubject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorText('Please supply your name, email, subject, and message.');
      return;
    }

    setLoading(true);
    setErrorText('');
    setSuccessResponse(false);

    try {
      await submitContactMessage(formData);
      setSuccessResponse(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
      });
      onClearPrefilledSubject();
    } catch (err: any) {
      setErrorText(err.message || 'Message could not be saved.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-section" className="py-16 sm:py-24 bg-[#0F172A] text-white relative overflow-hidden">
      <div className="absolute top-[20%] right-[-5%] w-[450px] h-[450px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[15%] left-[-5%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="text-center mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/20 text-[#FDA4AF] text-xs font-medium tracking-widest uppercase mb-4"
          >
            <Mail className="w-3.5 h-3.5 text-rose-500" />
            Studio Contact
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight font-light text-white mb-6 leading-tight">
            Initiate Collaboration: <span className="font-serif italic font-normal text-rose-400">Let's Design</span>
          </h2>
          <p className="max-w-xl mx-auto text-slate-400 font-body leading-relaxed text-sm">
            Send a project note or collaboration request. Messages are stored in Supabase for Fatima to review from the admin dashboard.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!successResponse ? (
            <motion.div
              layout
              key="form-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900 border border-white/5 shadow-2xl rounded-3xl p-5 sm:p-8 md:p-12 relative"
            >
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-2">Full Name</label>
                    <input
                      id="contact-name-input"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-slate-950 text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 font-body transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-2">Email Address</label>
                    <input
                      id="contact-email-input"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-slate-950 text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 font-body transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-2">Company / Organisation (Optional)</label>
                    <input
                      id="contact-company-input"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company or studio"
                      className="w-full bg-slate-950 text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 font-body transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-2">Collaboration Subject</label>
                    <input
                      id="contact-subject-input"
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project subject"
                      className="w-full bg-slate-950 text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 font-body transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-2">Your Concept & Timeline</label>
                  <textarea
                    id="contact-message-input"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share the collaboration details, scope, timeline, or question."
                    className="w-full bg-slate-950 text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 font-body transition-all resize-none"
                  />
                </div>

                {errorText && (
                  <div className="p-3.5 text-xs bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl font-mono break-words">
                    Connection interrupted: {errorText}
                  </div>
                )}

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-700 font-body font-semibold text-white rounded-xl text-xs transition-all flex items-center justify-center gap-2 hover:translate-x-1 disabled:opacity-50"
                >
                  {loading ? 'Submitting request...' : 'Send Collaboration Request'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-950/80 border border-emerald-500/30 shadow-2xl rounded-3xl p-5 sm:p-8 md:p-10 relative overflow-hidden"
            >
              <div className="absolute top-[20%] left-[-15%] w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                </div>

                <div>
                  <h4 className="text-2xl font-sans font-light tracking-tight text-white">
                    Message Received
                  </h4>
                  <p className="text-xs text-slate-400 font-body max-w-md mx-auto mt-2">
                    Your message was saved successfully. Fatima can review it from the admin dashboard.
                  </p>
                </div>

                <div className="w-full bg-[#0B0F19] rounded-2xl border border-white/5 p-4 sm:p-6 text-left font-mono text-xs space-y-4">
                  <span className="text-[10px] text-[#FDA4AF] uppercase tracking-widest block font-bold border-b border-white/5 pb-2">
                    Message Record
                  </span>

                  <div className="space-y-2.5 text-slate-300 text-[11px] leading-relaxed">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Save Status:</span>
                      <span className="text-emerald-400 font-bold">Saved</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Current Status:</span>
                      <span className="text-[#FDA4AF]">new</span>
                    </p>
                    <div className="h-px bg-white/5 my-2" />

                    <p className="text-slate-400 leading-normal font-body italic p-2.5 bg-slate-950/60 rounded border border-white/5 text-[11px]">
                      This form stores the request only. Email notifications are not configured yet.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    id="back-contact-btn"
                    onClick={() => setSuccessResponse(false)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-body font-medium transition"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}