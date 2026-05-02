export interface BannerDto {
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

export interface CreateBannerPayloadDto {
  title: string;
  subtitle: string;
  mediaId: string;
  linkUrl: string;
  linkType: string;
  displayOrder: number;
  startDate: string;
  endDate: string;
  active: boolean;
  targetPage: string;
}

export interface UpdateBannerPayloadDto {
  title?: string;
  subtitle?: string;
  mediaId?: string;
  linkUrl?: string;
  linkType?: string;
  displayOrder?: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  targetPage?: string;
}

export interface BannerListConfig {
  page?: number;
  size?: number;
}
