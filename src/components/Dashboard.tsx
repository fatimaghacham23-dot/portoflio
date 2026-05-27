import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  Edit3,
  Key,
  LayoutGrid,
  Lock,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';
import { AdminSession, BlogPost, ContactMessage, Project, ProjectCategory } from '../types';
import {
  createBlogPost,
  createProject,
  deleteBlogPost,
  deleteContactMessage,
  deleteProject,
  getAdminBlogPosts,
  getAdminProjects,
  getContactMessages,
  isSupabaseConfigured,
  signInAdmin,
  updateBlogPost,
  updateContactMessageStatus,
  updateProject,
  uploadPortfolioImage,
} from '../utils/api';

interface DashboardProps {
  currentSession: AdminSession | null;
  onLoginSuccess: (session: AdminSession) => void;
  onLogout: () => void;
  onRefreshPortfolio: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const emptyProjectForm = () => ({
  title: '',
  category: 'fashion' as ProjectCategory,
  image: '',
  description: '',
  tags: '',
  clientName: '',
  date: today(),
  published: true,
});

const emptyBlogForm = () => ({
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  tags: '',
  author: 'Fatima Ghacham',
  date: today(),
  published: true,
});

const parseTags = (value: string) => value.split(',').map(tag => tag.trim()).filter(Boolean);

export default function Dashboard({
  currentSession,
  onLoginSuccess,
  onLogout,
  onRefreshPortfolio,
}: DashboardProps) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState<'analytics' | 'cms' | 'messages'>('analytics');

  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectUploadLoading, setProjectUploadLoading] = useState(false);
  const [cmsFeedback, setCmsFeedback] = useState({ success: false, msg: '' });

  const [blogForm, setBlogForm] = useState(emptyBlogForm);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogUploadLoading, setBlogUploadLoading] = useState(false);
  const [blogFeedback, setBlogFeedback] = useState({ success: false, msg: '' });

  useEffect(() => {
    if (currentSession) {
      loadDashboardData();
    }
  }, [currentSession]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [projectRows, blogRows, messageRows] = await Promise.all([
        getAdminProjects(),
        getAdminBlogPosts(),
        getContactMessages(),
      ]);

      setProjects(projectRows);
      setBlogs(blogRows);
      setMessages(messageRows);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const session = await signInAdmin(emailInput, passwordInput);
      onLoginSuccess(session);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.image || !projectForm.description) {
      setCmsFeedback({ success: false, msg: 'Please provide a title, image URL, and description.' });
      return;
    }

    try {
      const payload = {
        title: projectForm.title,
        category: projectForm.category,
        image: projectForm.image,
        description: projectForm.description,
        tags: parseTags(projectForm.tags),
        clientName: projectForm.clientName || undefined,
        date: projectForm.date,
        published: projectForm.published,
      };

      if (editingProjectId) {
        await updateProject(editingProjectId, payload);
        setCmsFeedback({ success: true, msg: 'Project updated in Supabase.' });
      } else {
        await createProject(payload);
        setCmsFeedback({ success: true, msg: 'Project saved to Supabase.' });
      }

      setProjectForm(emptyProjectForm());
      setEditingProjectId(null);
      await loadDashboardData();
      onRefreshPortfolio();
    } catch (err: any) {
      setCmsFeedback({ success: false, msg: err.message || 'Project save failed.' });
    }
  };


  const handleImageUpload = async (
    file: File | undefined,
    target: 'project' | 'blog',
  ) => {
    if (!file) return;

    const setLoading = target === 'project' ? setProjectUploadLoading : setBlogUploadLoading;
    const setFeedback = target === 'project' ? setCmsFeedback : setBlogFeedback;

    try {
      setLoading(true);

      const imageUrl = await uploadPortfolioImage(file);

      if (target === 'project') {
        setProjectForm(prev => ({
          ...prev,
          image: imageUrl,
        }));
      } else {
        setBlogForm(prev => ({
          ...prev,
          coverImage: imageUrl,
        }));
      }

      setFeedback({
        success: true,
        msg: 'Image uploaded successfully.',
      });
    } catch (err: any) {
      setFeedback({
        success: false,
        msg: err.message || 'Upload failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content || !blogForm.coverImage) {
      setBlogFeedback({ success: false, msg: 'Please provide a title, cover image URL, and article content.' });
      return;
    }

    try {
      const payload = {
        title: blogForm.title,
        summary: blogForm.summary || `${blogForm.content.slice(0, 140)}...`,
        content: blogForm.content,
        coverImage: blogForm.coverImage,
        tags: parseTags(blogForm.tags),
        author: blogForm.author || 'Fatima Ghacham',
        date: blogForm.date,
        published: blogForm.published,
      };

      if (editingBlogId) {
        await updateBlogPost(editingBlogId, payload);
        setBlogFeedback({ success: true, msg: 'Blog post updated in Supabase.' });
      } else {
        await createBlogPost(payload);
        setBlogFeedback({ success: true, msg: 'Blog post saved to Supabase.' });
      }

      setBlogForm(emptyBlogForm());
      setEditingBlogId(null);
      await loadDashboardData();
      onRefreshPortfolio();
    } catch (err: any) {
      setBlogFeedback({ success: false, msg: err.message || 'Blog post save failed.' });
    }
  };

  const startProjectEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      category: project.category,
      image: project.image,
      description: project.description,
      tags: project.tags.join(', '),
      clientName: project.clientName || '',
      date: project.date,
      published: project.published,
    });
    setAdminActiveTab('cms');
  };

  const startBlogEdit = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setBlogForm({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      coverImage: blog.coverImage,
      tags: blog.tags.join(', '),
      author: blog.author,
      date: blog.date,
      published: blog.published,
    });
    setAdminActiveTab('cms');
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Delete this project from Supabase?')) return;
    await deleteProject(id);
    await loadDashboardData();
    onRefreshPortfolio();
  };

  const handleDeleteBlog = async (id: string) => {
    if (!window.confirm('Delete this blog post from Supabase?')) return;
    await deleteBlogPost(id);
    await loadDashboardData();
    onRefreshPortfolio();
  };

  const handleMessageStatus = async (id: string, status: ContactMessage['status']) => {
    await updateContactMessageStatus(id, status);
    await loadDashboardData();
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this contact message?')) return;
    await deleteContactMessage(id);
    await loadDashboardData();
  };

  return (
    <section id="dashboard-section" className="py-16 sm:py-24 bg-slate-900 text-white relative min-h-[700px] overflow-hidden">
      <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20">
        {!currentSession ? (
          <div className="max-w-md mx-auto bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl relative">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-tr from-rose-600 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Lock className="w-5 h-5" />
            </div>

            <div className="text-center mt-6 mb-8">
              <h3 className="text-2xl font-sans font-light tracking-tight">
                Creator Admin Portal
              </h3>
            </div>

            {!isSupabaseConfigured() && (
              <div className="mb-5 p-3 bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs rounded-xl font-mono leading-relaxed">
                Supabase environment variables are missing.
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-mono tracking-widest text-[#FDA4AF] uppercase mb-2">
                  ADMIN EMAIL
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="login-username-input"
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all font-body"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-widest text-[#FDA4AF] uppercase mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    placeholder="Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all font-body"
                  />
                </div>
              </div>

              {authError && (
                <div id="auth-error-alert" className="p-3 bg-red-950/50 border border-red-500/30 text-red-300 text-xs rounded-xl font-mono leading-relaxed">
                  Error: {authError}
                </div>
              )}

              <button
                id="submit-login-btn"
                type="submit"
                disabled={authLoading || !isSupabaseConfigured()}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 font-body font-semibold text-white rounded-xl text-sm transition-all focus:outline-none disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                {authLoading ? 'Signing in...' : 'Sign In to Dashboard'}
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-4 sm:px-8 py-5 sm:py-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/50">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-gradient-to-tr from-[#E11D48] to-pink-500 flex items-center justify-center shadow-md font-serif italic text-lg text-white font-bold select-none">
                  F
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-sans tracking-tight text-white flex flex-wrap items-center gap-2">
                    {currentSession.username}
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono tracking-widest uppercase">
                      Admin
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-body break-all sm:break-normal">
                    {currentSession.email} - Supabase Auth session
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  id="refresh-dashboard-btn"
                  onClick={loadDashboardData}
                  disabled={loadingData}
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition-all"
                  title="Refresh dashboard data"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
                </button>
                <button
                  id="dashboard-logout-btn"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-4.5 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-white text-xs font-body font-medium rounded-xl transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row min-h-[500px]">
              <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/10 bg-slate-950/30 p-3 sm:p-6 space-y-0 lg:space-y-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible scrollbar-thin">
                <div className="text-[10px] font-mono tracking-widest text-[#FDA4AF] uppercase mb-4 hidden lg:block">
                  Portfolio Control
                </div>
                {[
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'cms', label: 'Content Studio', icon: LayoutGrid },
                  { id: 'messages', label: 'Client Requests', icon: Mail },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAdminActiveTab(tab.id as 'analytics' | 'cms' | 'messages')}
                      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs font-body tracking-wide text-left transition-all whitespace-nowrap lg:w-full ${
                        adminActiveTab === tab.id
                          ? 'bg-rose-600/20 text-[#FDA4AF] font-medium border-l-2 border-rose-500'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 p-4 sm:p-8 lg:p-10 min-w-0">
                {adminActiveTab === 'analytics' && (
                  <div id="analytics-panel" className="space-y-8">
                    <div>
                      <h4 className="text-lg font-sans font-light">
                        Portfolio Analytics
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Analytics not connected yet.
                      </p>
                    </div>

                    <div className="bg-[#0B0F19] p-6 sm:p-8 border border-white/5 rounded-2xl text-center">
                      <BarChart3 className="w-10 h-10 mx-auto text-slate-600 mb-4" />
                      <p className="text-slate-400 font-body text-sm">
                        Analytics not connected yet.
                      </p>
                    </div>
                  </div>
                )}

                {adminActiveTab === 'cms' && (
                  <div id="cms-panel" className="space-y-10">
                    <div>
                      <h4 className="text-lg font-sans font-light">
                        Supabase Content Studio
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Create, edit, publish, and delete portfolio projects and journal posts.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <motion.form
                        onSubmit={handleProjectSubmit}
                        className="bg-[#0B0F19] p-4 sm:p-6 border border-white/5 rounded-2xl space-y-4"
                        layout
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#FDA4AF] uppercase tracking-wider">
                            {editingProjectId ? 'Edit Project' : 'New Project'}
                          </span>
                          {editingProjectId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProjectId(null);
                                setProjectForm(emptyProjectForm());
                              }}
                              className="text-[10px] text-slate-400 hover:text-white font-mono"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        <input
                          value={projectForm.title}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Project title"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <select
                            value={projectForm.category}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, category: e.target.value as ProjectCategory }))}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body"
                          >
                            <option value="fashion">Fashion</option>
                            <option value="graphic">Graphic</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                          <input
                            type="date"
                            value={projectForm.date}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body"
                          />
                        </div>

                        <input
                          value={projectForm.image}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="Image URL"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body"
                        />

                        <div className="space-y-3">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            Or Upload Image
                          </label>

                          <label
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              handleImageUpload(e.dataTransfer.files?.[0], 'project');
                            }}
                            className="w-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl px-4 py-6 cursor-pointer hover:border-rose-400 transition-all bg-slate-950/40"
                          >
                            <span className="text-xs text-slate-400 font-body text-center">
                              Drag & drop image here or click to upload
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono mt-1">
                              PNG, JPEG, WEBP, or GIF up to 5MB
                            </span>

                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/gif"
                              className="hidden"
                              onChange={(e) => {
                                handleImageUpload(e.target.files?.[0], 'project');
                                e.currentTarget.value = '';
                              }}
                            />
                          </label>

                          {projectUploadLoading && (
                            <div className="text-xs text-rose-300 font-mono">
                              Uploading image...
                            </div>
                          )}

                          {projectForm.image && (
                            <img
                              src={projectForm.image}
                              alt="Project preview"
                              className="w-full h-48 object-cover rounded-2xl border border-white/10"
                            />
                          )}
                        </div>

                        <input
                          value={projectForm.clientName}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, clientName: e.target.value }))}
                          placeholder="Client or context (optional)"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body"
                        />

                        <textarea
                          value={projectForm.description}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={5}
                          placeholder="Project description"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body resize-none"
                        />

                        <input
                          value={projectForm.tags}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="Tags separated by commas"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body"
                        />

                        <label className="flex items-center gap-2 text-xs text-slate-300 font-body">
                          <input
                            type="checkbox"
                            checked={projectForm.published}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, published: e.target.checked }))}
                            className="accent-rose-600"
                          />
                          Published
                        </label>

                        {cmsFeedback.msg && (
                          <div className={`p-3 rounded-xl text-xs font-mono border ${
                            cmsFeedback.success
                              ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300'
                              : 'bg-red-950/30 border-red-500/20 text-red-300'
                          }`}>
                            {cmsFeedback.msg}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full py-3 bg-rose-600 hover:bg-rose-700 font-body font-semibold text-white rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {editingProjectId ? 'Update Project' : 'Save Project'}
                        </button>
                      </motion.form>

                      <motion.form
                        onSubmit={handleBlogSubmit}
                        className="bg-[#0B0F19] p-4 sm:p-6 border border-white/5 rounded-2xl space-y-4"
                        layout
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#FDA4AF] uppercase tracking-wider">
                            {editingBlogId ? 'Edit Blog Post' : 'New Blog Post'}
                          </span>
                          {editingBlogId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBlogId(null);
                                setBlogForm(emptyBlogForm());
                              }}
                              className="text-[10px] text-slate-400 hover:text-white font-mono"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        <input
                          value={blogForm.title}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Blog title"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            value={blogForm.author}
                            onChange={(e) => setBlogForm(prev => ({ ...prev, author: e.target.value }))}
                            placeholder="Author"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body"
                          />
                          <input
                            type="date"
                            value={blogForm.date}
                            onChange={(e) => setBlogForm(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body"
                          />
                        </div>

                        <input
                          value={blogForm.coverImage}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, coverImage: e.target.value }))}
                          placeholder="Cover image URL"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body"
                        />

                        <div className="space-y-3">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            Or Upload Cover Image
                          </label>

                          <label
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              handleImageUpload(e.dataTransfer.files?.[0], 'blog');
                            }}
                            className="w-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl px-4 py-6 cursor-pointer hover:border-rose-400 transition-all bg-slate-950/40"
                          >
                            <span className="text-xs text-slate-400 font-body text-center">
                              Drag & drop image here or click to upload
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono mt-1">
                              PNG, JPEG, WEBP, or GIF up to 5MB
                            </span>

                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/gif"
                              className="hidden"
                              onChange={(e) => {
                                handleImageUpload(e.target.files?.[0], 'blog');
                                e.currentTarget.value = '';
                              }}
                            />
                          </label>

                          {blogUploadLoading && (
                            <div className="text-xs text-rose-300 font-mono">
                              Uploading image...
                            </div>
                          )}

                          {blogForm.coverImage && (
                            <img
                              src={blogForm.coverImage}
                              alt="Blog cover preview"
                              className="w-full h-48 object-cover rounded-2xl border border-white/10"
                            />
                          )}
                        </div>

                        <textarea
                          value={blogForm.summary}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, summary: e.target.value }))}
                          rows={2}
                          placeholder="Summary"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body resize-none"
                        />

                        <textarea
                          value={blogForm.content}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                          rows={6}
                          placeholder="Article content"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body resize-none"
                        />

                        <input
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="Tags separated by commas"
                          className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-rose-400 text-white font-body"
                        />

                        <label className="flex items-center gap-2 text-xs text-slate-300 font-body">
                          <input
                            type="checkbox"
                            checked={blogForm.published}
                            onChange={(e) => setBlogForm(prev => ({ ...prev, published: e.target.checked }))}
                            className="accent-rose-600"
                          />
                          Published
                        </label>

                        {blogFeedback.msg && (
                          <div className={`p-3 rounded-xl text-xs font-mono border ${
                            blogFeedback.success
                              ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300'
                              : 'bg-red-950/30 border-red-500/20 text-red-300'
                          }`}>
                            {blogFeedback.msg}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full py-3 bg-rose-600 hover:bg-rose-700 font-body font-semibold text-white rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {editingBlogId ? 'Update Blog Post' : 'Save Blog Post'}
                        </button>
                      </motion.form>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <div className="bg-[#0B0F19] p-4 sm:p-6 border border-white/5 rounded-2xl space-y-4">
                        <span className="text-xs font-mono text-[#FDA4AF] uppercase tracking-wider">
                          Portfolio Projects
                        </span>
                        {projects.length > 0 ? (
                          <div className="space-y-3">
                            {projects.map(project => (
                              <div key={project.id} className="p-4 bg-slate-950 border border-white/5 rounded-xl min-w-0">
                                <div className="flex items-start justify-between gap-3 min-w-0">
                                  <div>
                                    <h5 className="text-sm font-sans font-medium text-white break-words">{project.title}</h5>
                                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                                      {project.category.toUpperCase()} - {project.published ? 'Published' : 'Draft'}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => startProjectEdit(project)}
                                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300"
                                      title="Edit project"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProject(project.id)}
                                      className="p-2 bg-red-950/40 hover:bg-red-900/60 rounded-lg text-red-300"
                                      title="Delete project"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-500 text-center font-mono py-10 text-xs">
                            No projects published yet.
                          </div>
                        )}
                      </div>

                      <div className="bg-[#0B0F19] p-4 sm:p-6 border border-white/5 rounded-2xl space-y-4">
                        <span className="text-xs font-mono text-[#FDA4AF] uppercase tracking-wider">
                          Blog Posts
                        </span>
                        {blogs.length > 0 ? (
                          <div className="space-y-3">
                            {blogs.map(blog => (
                              <div key={blog.id} className="p-4 bg-slate-950 border border-white/5 rounded-xl min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h5 className="text-sm font-sans font-medium text-white break-words">{blog.title}</h5>
                                    <p className="text-[10px] font-mono text-slate-500 mt-1">
                                      {blog.date} - {blog.published ? 'Published' : 'Draft'}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => startBlogEdit(blog)}
                                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300"
                                      title="Edit blog post"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteBlog(blog.id)}
                                      className="p-2 bg-red-950/40 hover:bg-red-900/60 rounded-lg text-red-300"
                                      title="Delete blog post"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-500 text-center font-mono py-10 text-xs">
                            No blog posts yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {adminActiveTab === 'messages' && (
                  <div id="messages-panel" className="space-y-6">
                    <div>
                      <h4 className="text-lg font-sans font-light">
                        Contact Requests
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Messages submitted through the public contact form.
                      </p>
                    </div>

                    <div className="bg-[#0B0F19] p-4 sm:p-6 border border-white/5 rounded-2xl space-y-4">
                      {messages.length > 0 ? (
                        messages.map(message => (
                          <div key={message.id} className="p-4 sm:p-5 bg-slate-950 border border-white/5 rounded-2xl space-y-4 min-w-0">
                            <div className="flex flex-col md:flex-row justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-sans text-base sm:text-lg font-medium break-words">{message.name}</h5>
                                  {message.company && (
                                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                      {message.company}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 font-body mt-0.5 break-all sm:break-normal">
                                  {message.email} - {new Date(message.createdAt).toLocaleString()}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                                <span className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md font-medium ${
                                  message.status === 'new' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                                  message.status === 'reviewed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                  'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                                }`}>
                                  {message.status}
                                </span>
                                {message.status === 'new' && (
                                  <button
                                    type="button"
                                    onClick={() => handleMessageStatus(message.id, 'reviewed')}
                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-body font-medium rounded transition"
                                  >
                                    Mark Reviewed
                                  </button>
                                )}
                                {message.status !== 'archived' && (
                                  <button
                                    type="button"
                                    onClick={() => handleMessageStatus(message.id, 'archived')}
                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-body font-medium rounded transition"
                                  >
                                    Archive
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(message.id)}
                                  className="p-1.5 bg-red-950/40 hover:bg-red-900/60 rounded-lg text-red-300"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="bg-[#0B0F19] p-4 rounded-xl border border-white/5 space-y-2 overflow-hidden">
                              <span className="text-[10px] font-mono text-[#FDA4AF] block uppercase tracking-wider">
                                Subject: {message.subject}
                              </span>
                              <p className="text-slate-300 font-body text-sm leading-relaxed whitespace-pre-line break-words">
                                {message.message}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-500 text-center font-mono py-12 text-xs">
                          No client requests yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}