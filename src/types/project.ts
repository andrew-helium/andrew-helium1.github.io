export type VibecodingTool =
  | 'Claude Artifacts'
  | 'Lovable'
  | 'v0 by Vercel'
  | 'Bolt.new'
  | 'Cursor'
  | 'Replit'
  | 'Custom Prompt';

export type LabCategory =
  | 'Human-AI Interaction'
  | 'Generative Interfaces'
  | 'Cognitive & Thinking Tools'
  | 'Autonomous Agents'
  | 'Computational Science'
  | 'Creative & 3D Media';

export interface ProjectAuthor {
  name: string;
  role: string;
  affiliation?: string;
  github?: string;
  email?: string;
  avatarUrl?: string;
}

export interface VibeProject {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: LabCategory;
  tool: VibecodingTool;
  modelUsed?: string; // e.g. "Claude 3.7 Sonnet", "GPT-4o", "Gemini 2.5 Flash"
  author: ProjectAuthor;
  sourceType: 'code' | 'embed_url';
  rawHtml?: string; // Runnable HTML5 / JS / CSS bundle
  embedUrl?: string; // e.g. Lovable preview, Claude Artifact link, v0 link
  promptRecipe: string; // The primary prompt used to vibecode the prototype
  systemPrompt?: string; // System prompt or vibe instructions
  iterationsSummary?: string; // How the prompt evolved
  tags: string[];
  paperTitle?: string; // Associated research paper / preprint
  paperUrl?: string;
  featured?: boolean;
  stars?: number;
  testedWorking?: boolean;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface ProjectFilterState {
  searchQuery: string;
  category: LabCategory | 'All';
  tool: VibecodingTool | 'All';
  tag?: string;
  sourceType: 'All' | 'code' | 'embed_url';
  sortBy: 'featured' | 'recent' | 'stars' | 'title';
}

export interface LabPublication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  abstract: string;
  paperUrl?: string;
  linkedProjectId?: string; // Links directly to a vibecoded artifact
  tags: string[];
}

export interface LabMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  github?: string;
  email?: string;
  contributedProjectIds: string[];
}
