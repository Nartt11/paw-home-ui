export interface BaseResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  timestamp: string;
  correlationId?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: 0;
  size: 20;
  totalElements: 42;
  totalPages: 3;
  last: false;
}
