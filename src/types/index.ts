export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  headline: string;
  raw_json: ResumeData;
  created_at: string;
}

export interface ResumeData {
  name: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  gpa?: string;
}

export interface Resume {
  id: string;
  user_id: string;
  profile_id: string;
  optimized_json: ResumeData;
  public_link_slug: string;
  expires_at: string | null;
  is_active: boolean;
  job_title?: string;
  created_at: string;
}

export interface Subscription {
  user_id: string;
  stripe_customer_id: string;
  status: 'active' | 'trialing' | 'expired' | 'canceled';
  trial_end: string | null;
}

export type SectionKey =
  | 'header'
  | 'summary'
  | 'skills'
  | 'experience'
  | 'education'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'additional_awards'
  | 'additional_volunteering'
  | 'additional_publications'
  | 'additional_leadership';

export interface ResumeJSON {
  header: {
    full_name: string;
    headline: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin_url?: string;
    portfolio_url?: string;
    github_url?: string;
    photo_url?: string;
    show_photo?: boolean;
  };
  summary?: string;
  skills: {
    core?: string[];
    tools?: string[];
    categories?: {
      name: string;
      items: string[];
    }[];
  };
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  additional?: {
    awards?: { id: string; title: string; issuer?: string; date?: string; description?: string }[];
    volunteering?: { id: string; organization: string; role: string; dates?: string; description?: string }[];
    publications?: { id: string; title: string; publisher?: string; date?: string; url?: string }[];
    leadership?: { id: string; title: string; organization: string; dates?: string; description?: string }[];
  };
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  bullets: string[];
  tech_stack?: string[];
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  gpa?: string;
  coursework?: string[];
  honors?: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  link?: string;
  stack?: string[];
  start_date?: string;
  end_date?: string;
  bullets: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  expiry_date?: string;
  credential_id?: string;
  link?: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  level: 'Native' | 'Fluent' | 'Professional' | 'Conversational' | 'Basic';
  score?: string;
}

export interface CV {
  id: string;
  user_id: string;
  title: string;
  resume_json: ResumeJSON;
  theme_id: string;
  theme_category: 'ats_safe' | 'visual';
  color_palette_id: string;
  section_order: SectionKey[];
  hidden_sections: SectionKey[];
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}
