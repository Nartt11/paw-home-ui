import { BannerDto } from "@/services/banner/banner-dto";
import { Banner } from "@/types/banner.type";

export function mapBanner(dto: BannerDto): Banner {
  return {
    bannerId: dto.bannerId,
    title: dto.title,
    subtitle: dto.subtitle,
    mediaId: dto.mediaId,
    mediaUrl: dto.mediaUrl,
    linkUrl: dto.linkUrl,
    linkType: dto.linkType,
    displayOrder: dto.displayOrder,
    startDate: dto.startDate,
    endDate: dto.endDate,
    active: dto.active,
    targetPage: dto.targetPage,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
