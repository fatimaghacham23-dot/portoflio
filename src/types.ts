export type ProjectCategory = 'fashion' | 'graphic' | 'hybrid';
export type ProjectMediaType = 'image' | 'video';

export interface FashionDetails {
  fabrics?: string;
  silhouette?: string;
  palette?: string[];
}

export interface GraphicDetails {
  typography?: string;
  colorSpace?: string;
  software?: string[];
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  image: string;
  mediaType?: ProjectMediaType;
  mediaUrl?: string;
  mediaPositionX?: number;
  mediaPositionY?: number;
  description: string;
  tags: string[];
  fashionDetails?: FashionDetails;
  graphicDetails?: GraphicDetails;
  clientName?: string;
  date: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectInput {
  title: string;
  category: ProjectCategory;
  image: string;
  mediaType?: ProjectMediaType;
  mediaUrl?: string;
  mediaPositionX?: number;
  mediaPositionY?: number;
  description: string;
  tags: string[];
  fashionDetails?: FashionDetails;
  graphicDetails?: GraphicDetails;
  clientName?: string;
  date?: string;
  published?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  date: string;
  tags: string[];
  author: string;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPostInput {
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  tags: string[];
  author?: string;
  date?: string;
  published?: boolean;
}

export type ContactMessageStatus = 'new' | 'reviewed' | 'archived';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

export interface AdminSession {
  role: 'admin';
  username: string;
  email: string;
}
