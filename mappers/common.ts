import { PageDto } from "@/services/api-dto";

export function mapPage<TDto, TModel>(
  dto: PageDto<TDto>,
  mapItem: (x: TDto) => TModel,
) {
  return {
    content: dto.content.map(mapItem),
    page: dto.page,
    size: dto.size,
    totalElements: dto.totalElements,
    totalPages: dto.totalPages,
    last: dto.last,
  };
}