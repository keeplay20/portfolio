import { personalInfo } from "./portfolio";
import { openSourceContributions } from "./openSourceContributions";

export const homeScreenStats = {
  yearsExperience: personalInfo.yearsOfExperience,
  dream11: {
    value: 250,
    suffix: "M+ users",
    label: "Dream11",
  },
  superhealth: {
    headline: "0→1",
    label: "Superhealth",
  },
} as const;

const openSourceProjectIds = new Set(
  openSourceContributions.map((item) => item.project)
);

export const openSourceStat = {
  mergedPrs: openSourceContributions.length,
  repos: openSourceProjectIds.size,
  label: "OSS",
} as const;