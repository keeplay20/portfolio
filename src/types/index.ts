export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  location?: string;
  description: string[];
  technologies: string[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  summary: string;
  yearsOfExperience: number;
  location: string;
  email: string;
  phone?: string;
  website?: string;
  linkedin: string;
  github: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string[];
  category: "Mobile App" | "Web App" | "Full Stack" | "Other";
  technologies: string[];
  features: string[];
  highlights: string[];
  status: "Completed" | "In Progress" | "Planned";
  featured?: boolean;
  tagline?: string;
  previewImage?: string;
  caseStudy?: {
    problem: string;
    role: string;
    outcome: string;
    decisions: { title: string; body: string }[];
  };
  demoVideo?: string;
  liveDemo?: string;
  githubRepo?: string;
  downloadLinks?: {
    android?: string;
    ios?: string;
    apk?: string;
  };
  images?: string[];
  duration: string;
  teamSize?: number;
}

