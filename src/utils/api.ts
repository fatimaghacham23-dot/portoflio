import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AdminSession,
  BlogPost,
  BlogPostInput,
  ContactMessage,
  ContactMessageInput,
  ContactMessageStatus,
  GraphicDetails,
  FashionDetails,
  Project,
  ProjectCategory,
  ProjectInput,
  ProjectMediaType,
} from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseClient;
}

interface ProjectRow {
  id: string;
  title: string;
  category: ProjectCategory;
  image_url: string;
  media_type: ProjectMediaType | null;
  media_url: string | null;
  media_position_x: number | null;
  media_position_y: number | null;
  description: string;
  tags: string[] | null;
  fashion_details: FashionDetails | null;
  graphic_details: GraphicDetails | null;
  client_name: string | null;
  project_date: string | null;
  published: boolean;
  created_at: string;
  updated_at: string | null;
}

interface BlogPostRow {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  cover_image_url: string;
  tags: string[] | null;
  author: string | null;
  published_at: string | null;
  published: boolean;
  created_at: string;
  updated_at: string | null;
}

interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  created_at: string;
  updated_at: string | null;
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    image: row.image_url,
    mediaType: row.media_type ?? 'image',
    mediaUrl: row.media_url ?? row.image_url,
    mediaPositionX: row.media_position_x ?? 50,
    mediaPositionY: row.media_position_y ?? 50,
    description: row.description,
    tags: row.tags ?? [],
    fashionDetails: row.fashion_details ?? undefined,
    graphicDetails: row.graphic_details ?? undefined,
    clientName: row.client_name ?? undefined,
    date: row.project_date ?? row.created_at.slice(0, 10),
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

function mapBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary ?? '',
    content: row.content,
    coverImage: row.cover_image_url,
    tags: row.tags ?? [],
    author: row.author ?? 'Fatima Ghacham',
    date: row.published_at ?? row.created_at.slice(0, 10),
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

function mapContactMessage(row: ContactMessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company ?? undefined,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

function projectToRow(project: ProjectInput) {
  return {
    title: project.title,
    category: project.category,
    image_url: project.image,
    media_type: project.mediaType ?? 'image',
    media_url: project.mediaUrl ?? project.image,
    media_position_x: project.mediaPositionX ?? 50,
    media_position_y: project.mediaPositionY ?? 50,
    description: project.description,
    tags: project.tags,
    fashion_details: project.fashionDetails ?? null,
    graphic_details: project.graphicDetails ?? null,
    client_name: project.clientName || null,
    project_date: project.date || new Date().toISOString().slice(0, 10),
    published: project.published ?? true,
  };
}

function blogPostToRow(blog: BlogPostInput) {
  return {
    title: blog.title,
    summary: blog.summary,
    content: blog.content,
    cover_image_url: blog.coverImage,
    tags: blog.tags,
    author: blog.author || 'Fatima Ghacham',
    published_at: blog.date || new Date().toISOString().slice(0, 10),
    published: blog.published ?? true,
  };
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('project_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(row => mapProject(row as ProjectRow));
}

export async function getAdminProjects(): Promise<Project[]> {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(row => mapProject(row as ProjectRow));
}

export async function createProject(project: ProjectInput): Promise<Project> {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .insert(projectToRow(project))
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return mapProject(data as ProjectRow);
}

export async function updateProject(id: string, project: ProjectInput): Promise<Project> {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .update(projectToRow(project))
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return mapProject(data as ProjectRow);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await getSupabaseClient().from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await getSupabaseClient()
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(row => mapBlogPost(row as BlogPostRow));
}

export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await getSupabaseClient()
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(row => mapBlogPost(row as BlogPostRow));
}

export async function createBlogPost(blog: BlogPostInput): Promise<BlogPost> {
  const { data, error } = await getSupabaseClient()
    .from('blog_posts')
    .insert(blogPostToRow(blog))
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return mapBlogPost(data as BlogPostRow);
}

export async function updateBlogPost(id: string, blog: BlogPostInput): Promise<BlogPost> {
  const { data, error } = await getSupabaseClient()
    .from('blog_posts')
    .update(blogPostToRow(blog))
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return mapBlogPost(data as BlogPostRow);
}

export async function deleteBlogPost(id: string): Promise<void> {
  const { error } = await getSupabaseClient().from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function submitContactMessage(message: ContactMessageInput): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('contact_messages')
    .insert({
      name: message.name,
      email: message.email,
      company: message.company || null,
      subject: message.subject,
      message: message.message,
    });

  if (error) throw new Error(error.message);
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await getSupabaseClient()
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(row => mapContactMessage(row as ContactMessageRow));
}

export async function updateContactMessageStatus(id: string, status: ContactMessageStatus): Promise<ContactMessage> {
  const { data, error } = await getSupabaseClient()
    .from('contact_messages')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return mapContactMessage(data as ContactMessageRow);
}

export async function deleteContactMessage(id: string): Promise<void> {
  const { error } = await getSupabaseClient().from('contact_messages').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function signInAdmin(email: string, password: string): Promise<AdminSession> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  const user = data.user;
  if (!user) throw new Error('Supabase did not return an authenticated user.');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);
  if (!profile || profile.role !== 'admin') {
    await supabase.auth.signOut();
    throw new Error('This account is not enabled for admin access.');
  }

  return {
    role: 'admin',
    username: profile.display_name || user.email || 'Admin',
    email: user.email || email,
  };
}

export async function getCurrentAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== 'admin') return null;

  return {
    role: 'admin',
    username: profile.display_name || data.user.email || 'Admin',
    email: data.user.email || '',
  };
}

export async function signOutAdmin(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) throw new Error(error.message);
}

export async function uploadPortfolioMedia(
  file: File,
): Promise<{
  url: string;
  mediaType: ProjectMediaType;
}> {
  const imageTypes = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
  ];

  const videoTypes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ];

  const allowedTypes = [...imageTypes, ...videoTypes];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      'Only PNG, JPEG, WEBP, GIF, MP4, WEBM, and MOV files are allowed.',
    );
  }

  const isVideo = videoTypes.includes(file.type);

  const maxSize = isVideo
    ? 25 * 1024 * 1024
    : 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      isVideo
        ? 'Video must be smaller than 25MB.'
        : 'Image must be smaller than 5MB.',
    );
  }

  const supabase = getSupabaseClient();

  const extension =
    file.name.split('.').pop()?.toLowerCase() || 'bin';

  const safeExtension =
    extension.replace(/[^a-z0-9]/g, '') || 'bin';

  const uniqueId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  const folder = isVideo ? 'videos' : 'images';

  const filePath = `portfolio/${folder}/${uniqueId}.${safeExtension}`;

  const { error } = await supabase.storage
    .from('portfolio-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    mediaType: isVideo ? 'video' : 'image',
  };
}
