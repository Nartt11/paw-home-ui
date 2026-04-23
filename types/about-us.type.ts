export type AboutUsTabKey = "story" | "team" | "timeline";

export interface AboutUsStatItem {
  value: string;
  label: string;
  tone?: "sun" | "emerald" | "orange" | "sky" | "rose";
}

export interface AboutUsTeamMember {
  name: string;
  role: string;
  avatar_emoji: string;
  tone?: "emerald" | "orange" | "sky" | "rose" | "slate";
  years: string;
  badge: string;
}

export interface AboutUsTimelineEvent {
  year: string;
  title: string;
  description: string;
  tone?: "orange" | "emerald" | "sky" | "slate" | "rose";
}

export interface AboutUsValueItem {
  emoji: string;
  title: string;
  description: string;
}

export interface AboutUsData {
  hero: {
    badge: string;
    title: string;
    description: string;
    image_url: string;
  };
  stats: AboutUsStatItem[];
  tabs: Array<{ key: AboutUsTabKey; label: string }>;
  story: {
    heading: string;
    paragraphs: string[];
    values: AboutUsValueItem[];
    cta: {
      label: string;
      href: string;
    };
    gallery: {
      primary_image_url: string;
      secondary_image_url: string;
      highlights: Array<{ emoji: string; text: string }>;
    };
  };
  team: {
    title: string;
    description: string;
    members: AboutUsTeamMember[];
    volunteerCta: {
      title: string;
      description: string;
      chips: string[];
      href: string;
      label: string;
    };
  };
  timeline: {
    title: string;
    events: AboutUsTimelineEvent[];
  };
}
