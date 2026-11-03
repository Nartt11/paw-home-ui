export interface PageDto<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface CursorPageDto<T> {
  items: T[];
  nextCursor?: string | null;
  hasMore: boolean;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
}

export type ApiEntity = Record<string, unknown>;
