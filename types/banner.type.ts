export interface Banner {
  bannerId: string;
  title: string;
  subtitle: string;
  mediaId: string;
  mediaUrl: string;
  linkUrl: string;
  linkType: string;
  displayOrder: number;
  startDate: string;
  endDate: string;
  active: boolean;
  targetPage: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerListParams {
  targetPage?: string;
  page?: number;
  size?: number;
  status?: boolean;
}

export type BannerPayload = Omit<Banner, "bannerId" | "createdAt" | "updatedAt">;