import type { PhoneApp } from "./iphoneHome";

const PUBLIC = process.env.PUBLIC_URL ?? "";

export const WARRANTY_VAULT_TEASER_ID = "warranty-vault";

export const LOCK_NOTIF_DISMISS_KEY = "phone-warranty-notif-dismissed";
export const WARRANTY_NOTIFY_EMAILS_KEY = "warranty-vault-notify-emails";

export type TeaserMilestone = {
  id: string;
  label: string;
  done: boolean;
};

export const warrantyVaultTeaser = {
  id: WARRANTY_VAULT_TEASER_ID,
  notification: {
    appLabel: "Warranty Vault",
    title: "Building: Warranty Vault, bill tracker",
    body: "Store receipts & warranties, track renewals, and see recurring bills in one place.",
    timeLabel: "now",
  },
  comingSoon: {
    headline: "Warranty Vault",
    tagline: "Household admin, without the spreadsheet",
    description:
      "Snap receipts, stash warranty PDFs, and get nudges before policies lapse—plus a simple bill tracker for rent, utilities, and subscriptions.",
    progressPercent: 68,
    etaLabel: "Next milestone",
    etaValue: "TestFlight build · targeting Q1",
    milestones: [
      { id: "design", label: "Vault UI & receipt capture flow", done: true },
      { id: "ocr", label: "Parse amounts & merchant from photos", done: true },
      { id: "bills", label: "Recurring bill tracker & reminders", done: false },
      { id: "beta", label: "TestFlight + household sharing", done: false },
    ] satisfies TeaserMilestone[],
  },
} as const;

export const warrantyVaultTeaserApp: PhoneApp = {
  id: WARRANTY_VAULT_TEASER_ID,
  name: "Warranty Vault",
  label: "Warranty Vault",
  glyph: "WV",
  iconBg: "#2c5f4a",
  iconFg: "#fff",
  iconBackground: "linear-gradient(145deg, #1a3d32 0%, #3d8f6e 55%, #9ad4bc 100%)",
  iconWordmark: "Vault",
  overview: warrantyVaultTeaser.comingSoon.description,
  destination: { type: "coming-soon", teaserId: WARRANTY_VAULT_TEASER_ID },
};

export function readLockNotifDismissed(): boolean {
  try {
    return localStorage.getItem(LOCK_NOTIF_DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function persistLockNotifDismissed() {
  try {
    localStorage.setItem(LOCK_NOTIF_DISMISS_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function saveNotifyEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return false;
  }
  try {
    const raw = localStorage.getItem(WARRANTY_NOTIFY_EMAILS_KEY);
    const list: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    if (!list.includes(normalized)) {
      list.push(normalized);
      localStorage.setItem(WARRANTY_NOTIFY_EMAILS_KEY, JSON.stringify(list));
    }
    return true;
  } catch {
    return false;
  }
}

export function teaserIconUrl(): string {
  return `${PUBLIC}/app-icons/warranty-vault.svg`;
}