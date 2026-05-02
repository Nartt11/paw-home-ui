export type DonateStep = "choose" | "confirm" | "success";
export type DonateMethod = "transfer" | "momo" | "vnpay";

export interface DonateTier {
  id: string;
  amount: number;
  label: string;
  description: string;
  emoji: string;
  tone?: "sky" | "emerald" | "orange" | "rose" | "slate";
  popular?: boolean;
}

export interface DonateImpactItem {
  emoji: string;
  amount: string;
  description: string;
}

export interface DonateImpactBar {
  label: string;
  percent: number;
  tone?: "orange" | "emerald" | "sky" | "sun";
}

export interface DonateDonor {
  name: string;
  amount: string;
  time: string;
  avatar: string;
}

export interface DonateTrustBadge {
  icon: "shield" | "check" | "users";
  title: string;
  description: string;
  tone?: "emerald" | "sky" | "orange";
}

export interface DonateBankInfo {
  bank: string;
  account_number: string;
  account_name: string;
}

export interface DonateData {
  hero: {
    title: string;
    description: string;
    stats: Array<{ value: string; label: string; tone?: string }>;
  };
  tiers: DonateTier[];
  impactBars: DonateImpactBar[];
  impacts: DonateImpactItem[];
  trustBadges: DonateTrustBadge[];
  donors: DonateDonor[];
  bankInfo: DonateBankInfo;
}
