// src/core/value-objects/pagination-params.vo.ts
export interface PaginationParams {
  page: number;      // 1-based
  pageSize: number;  // items per page
}

export const normalizePagination = (p?: Partial<PaginationParams>): PaginationParams => {
  const page = Math.max(1, Number(p?.page ?? 1) | 0);
  const pageSize = Math.min(100, Math.max(1, Number(p?.pageSize ?? 12) | 0));
  return { page, pageSize };
};