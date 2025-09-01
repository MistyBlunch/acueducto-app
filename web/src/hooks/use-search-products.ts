import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
import { type SearchParams } from '@/types/api';

export interface UseSearchProductsParams extends SearchParams {
  enabled?: boolean;
}

export function useSearchProducts({
  query = '',
  page = 1,
  pageSize = 10,
  enabled = true,
}: UseSearchProductsParams) {
  const searchParams: SearchParams = { query, page, pageSize };

  return useQuery({
    queryKey: queryKeys.search(searchParams),
    queryFn: () => apiClient.searchProducts(searchParams),
    enabled: enabled && (query.trim().length > 0 || page > 1),
    placeholderData: previousData => previousData,
  });
}
