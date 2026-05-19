import type { Banner } from "@/types/banner.type";

export const PUBLIC_BANNER_TARGETS = {
  HOME: "HOME",
  ADOPTION: "ADOPTION",
  RESCUE: "RESCUE",
  DONATE: "DONATE",
} as const;

export type PublicBannerTarget =
  (typeof PUBLIC_BANNER_TARGETS)[keyof typeof PUBLIC_BANNER_TARGETS];

export function getBannersForTargetPage(
  banners: Banner[],
  targetPage: PublicBannerTarget,
): Banner[] {
  return banners
    .filter((banner) => banner.targetPage === targetPage)
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

export function pickBannerForTargetPage(
  banners: Banner[],
  targetPage: PublicBannerTarget,
  index = 0,
): Banner | undefined {
  return getBannersForTargetPage(banners, targetPage)[index];
}

export function getBannerHref(
  banner: Banner | undefined,
  fallbackHref: string,
): string {
  const linkUrl = banner?.linkUrl?.trim();
  return linkUrl || fallbackHref;
}
