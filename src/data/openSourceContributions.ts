import { OPEN_SOURCE_HIGHLIGHT_URL } from "./iphoneHome";

export type OpenSourceContribution = {
  id: string;
  project: string;
  title: string;
  summary: string;
  url: string;
  mergedLabel?: string;
};

export const OPEN_SOURCE_INTRO =
  "Public contributions and merged PRs—production-minded changes shipped to repos I do not own.";

export const openSourceContributions: OpenSourceContribution[] = [
  {
    id: "hot-updater-1959",
    project: "hot-updater",
    title: "feat(console): hint when git commit has no console.gitUrl",
    summary:
      "Shows a maintainer hint under the Git commit row when a bundle has a hash but console.gitUrl is unset—links to Console Git URL docs. Includes constants + BundleMetadata tests.",
    url: OPEN_SOURCE_HIGHLIGHT_URL,
    mergedLabel: "Merged · Nov 2025",
  },
];