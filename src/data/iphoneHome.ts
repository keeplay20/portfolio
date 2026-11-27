import { experiences, personalInfo, projects } from "./portfolio";

const PUBLIC = process.env.PUBLIC_URL ?? "";

function appIconPath(file: string): string {
  return `${PUBLIC}/app-icons/${file}`;
}

/** Home-screen icon captions — no ALL-CAPS words */
const PRESERVE_APP_LABELS: Record<string, string> = {
  LinkedIn: "LinkedIn",
  GitHub: "GitHub",
  Dream11: "Dream11",
  VXL: "VXL",
  Gupshup: "Gupshup",
};

function formatAppLabel(raw: string): string {
  const text = raw.trim();
  if (!text) return text;
  if (PRESERVE_APP_LABELS[text]) return PRESERVE_APP_LABELS[text];

  return text
    .split(/\s+/)
    .map((word) => {
      if (/^[A-Z]{2,}$/.test(word)) {
        return word.charAt(0) + word.slice(1).toLowerCase();
      }
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export type AppDestination =
  | { type: "project"; projectId: string }
  | { type: "route"; path: string }
  | { type: "external"; url: string }
  | { type: "experience"; experienceId: string }
  | { type: "experience-hub" }
  | { type: "open-source-hub" };

export interface PhoneApp {
  id: string;
  name: string;
  label: string;
  glyph: string;
  iconBg: string;
  iconFg?: string;
  /** CSS background (gradient or color) behind icon art */
  iconBackground?: string;
  /** Screenshot / GIF used as full-bleed icon art */
  iconImage?: string;
  overview: string;
  destination: AppDestination;
  badge?: string;
  /** Short title rendered on the icon (Journey-style wordmark). Skipped when iconImage is set. */
  iconWordmark?: string;
}

export interface PhoneFolder {
  id: string;
  name: string;
  overview: string;
  previewColors: [string, string, string, string];
  apps: PhoneApp[];
}

/** Web projects on the shell home — only apps with a live demo (no placeholders). */
const PHONE_WEB_PROJECT_IDS_EXCLUDED = new Set(["wander-travel"]);

const webProjects = projects.filter(
  (p) =>
    p.category === "Web App" && !PHONE_WEB_PROJECT_IDS_EXCLUDED.has(p.id)
);

const projectIconMeta: Record<
  string,
  { iconBackground: string; iconBg: string }
> = {
  "deep-link-doctor": {
    iconBackground: "linear-gradient(145deg, #4338ca 0%, #7c3aed 48%, #c026d3 100%)",
    iconBg: "#5b21b6",
  },
  "animate-spotlight-showcase": {
    iconBackground: "linear-gradient(160deg, #1e3a5f 0%, #3d2914 55%, #d4a574 100%)",
    iconBg: "#1e3a5f",
  },
  "transition-trail-explorer": {
    iconBackground: "linear-gradient(145deg, #0f766e 0%, #134e4a 50%, #22d3ee 100%)",
    iconBg: "#0f766e",
  },
  moviebuzz: {
    iconBackground: "linear-gradient(145deg, #0f0f0f 0%, #7f1d1d 100%)",
    iconBg: "#18181b",
  },
  sudoku: {
    iconBackground: "linear-gradient(145deg, #f4f4f5 0%, #d4d4d8 100%)",
    iconBg: "#e4e4e7",
  },
};

const projectWordmarks: Record<string, string> = {
  "deep-link-doctor": "Deep Link",
  "animate-spotlight-showcase": "Spotlight",
  "transition-trail-explorer": "Transitions",
  moviebuzz: "MovieBuzz",
  sudoku: "Sudoku",
};

function projectApp(
  p: (typeof projects)[number],
  glyph?: string
): PhoneApp {
  const meta = projectIconMeta[p.id];
  return {
    id: p.id,
    name: p.title,
    label: formatAppLabel(
      p.title.split(/[\s-]/).slice(0, 2).join(" ")
    ),
    glyph: glyph ?? p.title.slice(0, 2).toUpperCase(),
    iconBg: meta?.iconBg ?? "#1c1c1e",
    iconFg: p.id === "sudoku" ? "#1c1c1e" : "#f5f5f7",
    iconBackground: meta?.iconBackground,
    iconWordmark: projectWordmarks[p.id] ?? formatAppLabel(p.title.split(/\s/)[0]),
    overview: p.description,
    destination: { type: "project", projectId: p.id },
    badge: p.status === "In Progress" ? "1" : undefined,
  };
}

export const gameApps: PhoneApp[] = [
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    label: "Tic Tac Toe",
    glyph: "O/X",
    iconBg: "#0a84ff",
    iconFg: "#fff",
    iconBackground: "linear-gradient(145deg, #0a84ff, #5ac8fa)",
    iconWordmark: "Tic Tac Toe",
    overview: "Classic X's and O's against a simple opponent.",
    destination: { type: "route", path: "/games/tictactoe" },
  },
  {
    id: "rps",
    name: "Rock Paper Scissors",
    label: "Rock Paper",
    glyph: "RPS",
    iconWordmark: "Rock Paper",
    iconBg: "#bf5af2",
    iconFg: "#fff",
    iconBackground: "linear-gradient(145deg, #af52de, #ff2d55)",
    overview: "Quick rounds against AI.",
    destination: { type: "route", path: "/games/rps" },
  },
  {
    id: "snake",
    name: "Snake",
    label: "Snake",
    glyph: "SN",
    iconWordmark: "Snake",
    iconBg: "#30d158",
    iconFg: "#fff",
    iconBackground: "linear-gradient(145deg, #30d158, #248a3d)",
    overview: "Classic snake on a grid.",
    destination: { type: "route", path: "/games/snake" },
  },
  {
    id: "typing",
    name: "Typing Test",
    label: "Typing",
    glyph: "WPM",
    iconWordmark: "Typing Test",
    iconBg: "#ff9f0a",
    iconFg: "#1c1c1e",
    iconBackground: "linear-gradient(145deg, #ff9f0a, #ffcc00)",
    overview: "Measure typing speed on code snippets.",
    destination: { type: "route", path: "/games/typing" },
  },
  {
    id: "memory",
    name: "Memory Cards",
    label: "Memory",
    glyph: "MEM",
    iconWordmark: "Memory Cards",
    iconBg: "#ff375f",
    iconFg: "#fff",
    iconBackground: "linear-gradient(145deg, #ff375f, #ff6482)",
    overview: "Flip and match pairs.",
    destination: { type: "route", path: "/games/memory" },
  },
];

export const experienceIconMeta: Record<
  string,
  {
    iconBackground: string;
    iconBg: string;
    iconFg: string;
    iconImage: string;
  }
> = {
  superhealth: {
    iconBackground: "linear-gradient(145deg, #dc2626, #991b1b)",
    iconBg: "#dc2626",
    iconFg: "#fff",
    iconImage: appIconPath("superhealth.svg"),
  },
  dream11: {
    iconBackground: "linear-gradient(145deg, #ea580c, #c2410c)",
    iconBg: "#ea580c",
    iconFg: "#fff",
    iconImage: appIconPath("dream11.svg"),
  },
  gupshup: {
    iconBackground: "linear-gradient(145deg, #2563eb, #1d4ed8)",
    iconBg: "#2563eb",
    iconFg: "#fff",
    iconImage: appIconPath("gupshup.svg"),
  },
  vxl: {
    iconBackground: "#ffffff",
    iconBg: "#ffffff",
    iconFg: "#1a1a1a",
    iconImage: appIconPath("vxl.svg"),
  },
  freelancer: {
    iconBackground: "linear-gradient(145deg, #7c3aed, #5b21b6)",
    iconBg: "#7c3aed",
    iconFg: "#fff",
    iconImage: appIconPath("freelancer.svg"),
  },
  wipro: {
    iconBackground: "linear-gradient(145deg, #0d9488, #0f766e)",
    iconBg: "#0d9488",
    iconFg: "#fff",
    iconImage: appIconPath("wipro.svg"),
  },
};

function experienceOverview(exp: (typeof experiences)[number]): string {
  const header = `${exp.position} · ${exp.duration}\n${exp.location ?? ""}`;
  if (exp.deepDive) {
    return `${header}\n\n${exp.deepDive.productLine}\n\n${exp.deepDive.tagline}`;
  }
  return `${header}\n\n${exp.description[0]}`;
}

export function getExperienceIconImage(experienceId: string): string {
  const meta = experienceIconMeta[experienceId];
  return meta?.iconImage ?? appIconPath(`${experienceId}.svg`);
}

export const experienceHubApp: PhoneApp = {
  id: "experience",
  name: "Experience",
  label: "Experience",
  glyph: "EX",
  iconBg: "#152331",
  iconFg: "#ffffff",
  iconBackground: "linear-gradient(160deg, #000000 0%, #152331 100%)",
  iconWordmark: "Experience",
  overview: "Swipe through roles, timelines, and highlights—tap Know more for the full story.",
  destination: { type: "experience-hub" },
};

const experienceApps: PhoneApp[] = experiences.map((exp) => {
  const meta = experienceIconMeta[exp.id];
  const pal = meta ?? {
    iconBg: "#1c1c1e",
    iconFg: "#f5f5f7",
    iconBackground: "linear-gradient(145deg, #3a3a3c, #1c1c1e)",
    iconImage: appIconPath(`${exp.id}.svg`),
  };
  return {
    id: exp.id,
    name: exp.company,
    label: formatAppLabel(exp.company.split(" ")[0]),
    glyph: exp.company.slice(0, 2).toUpperCase(),
    iconBg: pal.iconBg,
    iconFg: pal.iconFg,
    iconBackground: pal.iconBackground,
    iconImage: pal.iconImage,
    overview: experienceOverview(exp),
    destination: { type: "experience", experienceId: exp.id },
  };
});

export type PhoneHomeSection = {
  id: string;
  title: string;
  apps: PhoneApp[];
};

export const phoneFolders: PhoneFolder[] = [
  {
    id: "web",
    name: "Projects",
    overview:
      "Interaction labs and web experiments—motion, state machines, and tools shipped to Vercel.",
    previewColors: ["#0a84ff", "#5e5ce6", "#30d158", "#ff9f0a"],
    apps: webProjects.map((p) => projectApp(p)),
  },
  {
    id: "experience",
    name: "Experience",
    overview:
      "Companies and chapters—from enterprise consulting to mobile at scale.",
    previewColors: ["#1c1c1e", "#0a84ff", "#30d158", "#bf5af2"],
    apps: experienceApps,
  },
];

/** Home screen rows — Experience first, then projects (games are an easter egg). */
export const phoneHomeSections: PhoneHomeSection[] = [
  {
    id: "experience",
    title: "Experience",
    apps: [experienceHubApp],
  },
  {
    id: "web",
    title: "Projects",
    apps: webProjects.map((p) => projectApp(p)),
  },
];

export const phoneArcadeSection: PhoneHomeSection = {
  id: "arcade",
  title: "Arcade",
  apps: gameApps,
};

export const dockApps: PhoneApp[] = [
  {
    id: "mail",
    name: "Mail",
    label: "Mail",
    glyph: "@",
    iconBg: "#0a84ff",
    iconFg: "#fff",
    iconBackground: "linear-gradient(180deg, #5ac8fa 0%, #0a84ff 45%, #0066d6 100%)",
    overview: `Email ${personalInfo.name}`,
    destination: { type: "external", url: `mailto:${personalInfo.email}` },
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    label: "LinkedIn",
    glyph: "in",
    iconBg: "#0a66c2",
    iconFg: "#fff",
    iconBackground: "#0a66c2",
    iconImage: appIconPath("linkedin.svg"),
    overview: "Professional profile and work history.",
    destination: { type: "external", url: personalInfo.linkedin },
  },
  {
    id: "github",
    name: "GitHub",
    label: "GitHub",
    glyph: "GH",
    iconBg: "#0d1117",
    iconFg: "#fff",
    iconBackground: "linear-gradient(145deg, #30363d, #0d1117)",
    overview: "Code, experiments, and open repos.",
    destination: { type: "external", url: personalInfo.github },
  },
  {
    id: "opensource",
    name: "Open Source",
    label: "Open Source",
    glyph: "OSS",
    iconBg: "#5856d6",
    iconFg: "#fff",
    iconBackground:
      "linear-gradient(155deg, #a855f7 0%, #5856d6 42%, #0a84ff 100%)",
    overview:
      "Merged PR #1959 on hot-updater: Console hint when a bundle git commit has no console.gitUrl (docs link + tests).",
    destination: { type: "open-source-hub" },
  },
];

export function getFolder(id: string): PhoneFolder | undefined {
  return phoneFolders.find((f) => f.id === id);
}

export function getAppById(
  folderId: string,
  appId: string
): PhoneApp | undefined {
  return getFolder(folderId)?.apps.find((a) => a.id === appId);
}

export type ResolvedAppLink = {
  href: string;
  external: boolean;
  label: "Live site" | "Coming soon";
  disabled?: boolean;
};

export function getAppDirectLink(
  destination: AppDestination,
  projectLookup: typeof projects
): ResolvedAppLink | null {
  const links = resolveAppHref(destination, projectLookup);
  return links.find((link) => !link.disabled && Boolean(link.href)) ?? null;
}

export type InPhoneLaunch =
  | { mode: "iframe"; src: string }
  | { mode: "route"; path: string }
  | { mode: "experience"; experienceId: string }
  | { mode: "experience-hub" }
  | { mode: "open-source-hub" }
  | { mode: "placeholder" };

/** How to render an app inside the phone shell (no new browser tab). */
export function resolveInPhoneLaunch(
  destination: AppDestination,
  projectLookup: typeof projects
): InPhoneLaunch | null {
  if (destination.type === "external") {
    return null;
  }

  if (destination.type === "experience-hub") {
    return { mode: "experience-hub" };
  }

  if (destination.type === "open-source-hub") {
    return { mode: "open-source-hub" };
  }

  if (destination.type === "experience") {
    return { mode: "experience", experienceId: destination.experienceId };
  }

  if (destination.type === "route") {
    if (destination.path.startsWith("/games/")) {
      return { mode: "route", path: destination.path };
    }
    return {
      mode: "iframe",
      src: new URL(destination.path, window.location.origin).href,
    };
  }

  const direct = getAppDirectLink(destination, projectLookup);
  if (direct) {
    if (direct.external) {
      return { mode: "iframe", src: direct.href };
    }
    if (direct.href.startsWith("/games/")) {
      return { mode: "route", path: direct.href };
    }
    return {
      mode: "iframe",
      src: new URL(direct.href, window.location.origin).href,
    };
  }

  return { mode: "placeholder" };
}

export function resolveAppHref(
  destination: AppDestination,
  projectLookup: typeof projects
): ResolvedAppLink[] {
  const liveSite = (
    href: string,
    external: boolean
  ): ResolvedAppLink[] => [{ href, external, label: "Live site" }];

  const comingSoon = (): ResolvedAppLink[] => [
    { href: "", external: false, label: "Coming soon", disabled: true },
  ];

  switch (destination.type) {
    case "route":
      return liveSite(destination.path, false);
    case "external":
      return liveSite(destination.url, true);
    case "project": {
      const p = projectLookup.find((x) => x.id === destination.projectId);
      if (p?.liveDemo) {
        return liveSite(p.liveDemo, true);
      }
      return comingSoon();
    }
    case "experience":
    case "experience-hub":
    case "open-source-hub":
      return [];
    default:
      return comingSoon();
  }
}