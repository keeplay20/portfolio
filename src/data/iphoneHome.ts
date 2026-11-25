import { experiences, personalInfo, projects } from "./portfolio";

export type AppDestination =
  | { type: "project"; projectId: string }
  | { type: "route"; path: string }
  | { type: "external"; url: string }
  | { type: "experience"; experienceId: string };

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
}

export interface PhoneFolder {
  id: string;
  name: string;
  overview: string;
  previewColors: [string, string, string, string];
  apps: PhoneApp[];
}

const webProjects = projects.filter((p) => p.category === "Web App");
const appProjects = projects.filter((p) => p.category === "Mobile App");

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
  "wander-travel": {
    iconBackground: "linear-gradient(160deg, #0369a1 0%, #0ea5e9 60%, #fcd34d 100%)",
    iconBg: "#0284c7",
  },
  "javascript-mini-projects": {
    iconBackground: "linear-gradient(145deg, #ca8a04 0%, #eab308 100%)",
    iconBg: "#ca8a04",
  },
  "html-css-projects": {
    iconBackground: "linear-gradient(145deg, #e11d48 0%, #f97316 100%)",
    iconBg: "#e11d48",
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

function projectImage(p: (typeof projects)[number]): string | undefined {
  if (p.previewImage) return p.previewImage;
  if (p.demoVideo?.startsWith("/")) {
    return `${process.env.PUBLIC_URL ?? ""}${p.demoVideo}`;
  }
  return undefined;
}

function projectApp(
  p: (typeof projects)[number],
  glyph?: string
): PhoneApp {
  const meta = projectIconMeta[p.id];
  return {
    id: p.id,
    name: p.title,
    label: p.title.split(/[\s-]/).slice(0, 2).join(" "),
    glyph: glyph ?? p.title.slice(0, 2).toUpperCase(),
    iconBg: meta?.iconBg ?? "#1c1c1e",
    iconFg: "#f5f5f7",
    iconBackground: meta?.iconBackground,
    iconImage: projectImage(p),
    overview: p.description,
    destination: { type: "project", projectId: p.id },
    badge: p.status === "In Progress" ? "1" : undefined,
  };
}

const gameApps: PhoneApp[] = [
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    label: "Tic Tac Toe",
    glyph: "O/X",
    iconBg: "#0a84ff",
    iconBackground: "linear-gradient(145deg, #0a84ff, #5ac8fa)",
    overview: "Classic X's and O's against a simple opponent.",
    destination: { type: "route", path: "/games/tictactoe" },
  },
  {
    id: "rps",
    name: "Rock Paper Scissors",
    label: "RPS",
    glyph: "RPS",
    iconBg: "#bf5af2",
    iconBackground: "linear-gradient(145deg, #af52de, #ff2d55)",
    overview: "Quick rounds against AI.",
    destination: { type: "route", path: "/games/rps" },
  },
  {
    id: "snake",
    name: "Snake",
    label: "Snake",
    glyph: "SN",
    iconBg: "#30d158",
    iconBackground: "linear-gradient(145deg, #30d158, #248a3d)",
    overview: "Classic snake on a grid.",
    destination: { type: "route", path: "/games/snake" },
  },
  {
    id: "typing",
    name: "Typing Test",
    label: "Typing",
    glyph: "WPM",
    iconBg: "#ff9f0a",
    iconBackground: "linear-gradient(145deg, #ff9f0a, #ffcc00)",
    overview: "Measure typing speed on code snippets.",
    destination: { type: "route", path: "/games/typing" },
  },
  {
    id: "memory",
    name: "Memory Cards",
    label: "Memory",
    glyph: "MEM",
    iconBg: "#ff375f",
    iconBackground: "linear-gradient(145deg, #ff375f, #ff6482)",
    overview: "Flip and match pairs.",
    destination: { type: "route", path: "/games/memory" },
  },
];

const experienceIconMeta: Record<
  string,
  { iconBackground: string; iconBg: string; iconFg: string }
> = {
  superhealth: {
    iconBackground: "linear-gradient(145deg, #dc2626, #991b1b)",
    iconBg: "#dc2626",
    iconFg: "#fff",
  },
  dream11: {
    iconBackground: "linear-gradient(145deg, #ea580c, #c2410c)",
    iconBg: "#ea580c",
    iconFg: "#fff",
  },
  gupshup: {
    iconBackground: "linear-gradient(145deg, #2563eb, #1d4ed8)",
    iconBg: "#2563eb",
    iconFg: "#fff",
  },
  vxl: {
    iconBackground: "linear-gradient(145deg, #475569, #334155)",
    iconBg: "#475569",
    iconFg: "#fff",
  },
  freelancer: {
    iconBackground: "linear-gradient(145deg, #7c3aed, #5b21b6)",
    iconBg: "#7c3aed",
    iconFg: "#fff",
  },
  wipro: {
    iconBackground: "linear-gradient(145deg, #0d9488, #0f766e)",
    iconBg: "#0d9488",
    iconFg: "#fff",
  },
};

const experienceApps: PhoneApp[] = experiences.map((exp) => {
  const meta = experienceIconMeta[exp.id];
  const pal = meta ?? {
    iconBg: "#1c1c1e",
    iconFg: "#f5f5f7",
    iconBackground: "linear-gradient(145deg, #3a3a3c, #1c1c1e)",
  };
  return {
    id: exp.id,
    name: exp.company,
    label: exp.company.split(" ")[0],
    glyph: exp.company.slice(0, 2).toUpperCase(),
    iconBg: pal.iconBg,
    iconFg: pal.iconFg,
    iconBackground: pal.iconBackground,
    overview: `${exp.position} · ${exp.duration}\n${exp.location ?? ""}\n\n${exp.description[0]}`,
    destination: { type: "experience", experienceId: exp.id },
  };
});

export const phoneFolders: PhoneFolder[] = [
  {
    id: "web",
    name: "Web Projects",
    overview:
      "Interaction labs and web experiments—motion, state machines, and tools shipped to Vercel.",
    previewColors: ["#0a84ff", "#5e5ce6", "#30d158", "#ff9f0a"],
    apps: webProjects.map((p) => projectApp(p)),
  },
  {
    id: "apps",
    name: "App Projects",
    overview: "React Native and Expo apps—discovery, games, and mobile UI craft.",
    previewColors: ["#30d158", "#0a84ff", "#ff375f", "#64d2ff"],
    apps: appProjects.map((p) => projectApp(p)),
  },
  {
    id: "games",
    name: "Games",
    overview: "Mini games built into the portfolio—tap an icon to play.",
    previewColors: ["#5e5ce6", "#30d158", "#ff9f0a", "#ff375f"],
    apps: gameApps,
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
    iconBackground: "linear-gradient(145deg, #0a66c2, #004182)",
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
    id: "archive",
    name: "Archive",
    label: "Archive",
    glyph: "AR",
    iconBg: "#636366",
    iconFg: "#fff",
    iconBackground: "linear-gradient(145deg, #8e8e93, #48484a)",
    overview: "Full project list with filters.",
    destination: { type: "route", path: "/work" },
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
      return [];
    default:
      return comingSoon();
  }
}