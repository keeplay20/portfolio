const PUBLIC = process.env.PUBLIC_URL ?? "";

/** Replace with your headshot — place file under `public/images/`. */
export const ABOUT_ME_PROFILE_IMAGE = `${PUBLIC}/images/profile.jpg`;

export const ABOUT_ME_RESUME_PDF = `${PUBLIC}/resume/mandar-vyas-resume.pdf`;

export const ABOUT_ME_RESUME_DOWNLOAD_NAME = "Mandar-Vyas-Resume.pdf";

/** Extra detail only — lock screen already shows `personalInfo.summary`. */
export const aboutMeShortBio =
  "I focus on React-Native mobile apps at scale, motion-heavy web interfaces, and shipping with reliability, accessibility, and store compliance in mind.";

/** Practices & strengths (tools live under tech stack). */
export const aboutMeSkills: string[] = [
  "SDUI",
  "Performance tuning",
  "CI/CD & OTA",
  "System design",
  "Mentorship",
];

export const aboutMeTechStack: string[] = [
  "React Native",
  "Expo SDK",
  "TypeScript",
  "Reanimated",
  "React Query",
  "Zustand",
  "Firebase",
  "Moengage",
  "Jest",
  "Detox",
  "React",
];

export type AboutMeEducation = {
  id: string;
  school: string;
  degree: string;
  years: string;
  detail?: string;
};

export const aboutMeEducation: AboutMeEducation[] = [
  {
    id: "btech",
    school: "Pune University",
    degree: "B.E. — Computer Engineering",
    years: `2009 - 2013`,
  },
];