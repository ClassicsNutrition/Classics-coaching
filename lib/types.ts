import { Block } from './blocks';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'client' | 'admin';
  created_at: string;
}

export interface Ebook {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  sections: Block[];
  pdf_url: string | null;
  theme_primary: string;
  theme_accent: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  sections: Block[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  gif_url: string | null;
  muscle_group: string | null;
  instructions: string | null;
  created_at: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  content_type: 'ebook' | 'program';
  content_id: string;
  status: 'pending' | 'granted' | 'revoked';
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  ebook?: Ebook;
  program?: Program;
}
