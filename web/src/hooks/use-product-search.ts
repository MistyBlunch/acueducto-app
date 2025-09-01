'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
import { ProductsResponseSchema, type ProductsResponse } from '@/types/api';
import { isPalindrome, debounce } from '@/lib/utils';

export type SearchState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface UseProductSearchResult {
  // Data
  data?: ProductsResponse;
  allProductsData?: ProductsResponse;

  // States
  state: SearchState;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isEmpty: boolean;

  // Query info
  query: string;
  debouncedQuery: string;
  isPalindromeQuery: boolean;

  // Error handling
  error: Error | null;
  retry: () => void;

  // Pagination
  page: number;
  setPage: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  // Search metadata
  searchMetadata?: {
    total: number;
    executionTimeMs: number;
    isPalindrome: boolean;
    executedAt: string;
  };

  // Query management
  updateQuery: (query: string) => void;
}

export function useProductSearch(
  initialQuery: string = '',
  pageSize: number = 12,
): UseProductSearchResult {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  const debouncedSetQuery = useMemo(
    () =>
      debounce((newQuery: string) => {
        setDebouncedQuery(newQuery);
        setPage(1);
      }, 300),
    [],
  );

  useEffect(() => {
    setQuery(initialQuery);
    debouncedSetQuery(initialQuery);
  }, [initialQuery, debouncedSetQuery]);

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
    debouncedSetQuery(newQuery);
  };

  const isPalindromeQuery = useMemo(
    () =>
      isPalindrome(debouncedQuery.trim()) && debouncedQuery.trim().length >= 3,
    [debouncedQuery],
  );

  // Don't search for empty queries
  const shouldSearch = debouncedQuery.length > 0;
  const queryResult = useQuery({
    queryKey: queryKeys.search({
      query: debouncedQuery,
      page,
      pageSize,
    }),
    enabled: shouldSearch,
    queryFn: async () => {
      console.log(
        `🔍 Searching products with query: "${debouncedQuery}", page: ${page}, pageSize: ${pageSize}`,
      );

      try {
        const response = await apiClient.searchProducts({
          query: debouncedQuery,
          page,
          pageSize,
        });

        console.log(
          `✅ Search successful. Found ${response.items?.length || 0} items`,
        );

        // Validate response with Zod
        const validatedResponse = ProductsResponseSchema.parse(response);
        return validatedResponse;
      } catch (error) {
        console.error('❌ Search failed:', error);
        throw error;
      }
    },
    placeholderData: previousData => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error && 'statusCode' in error) {
        const statusCode = (error as any).statusCode;
        if (statusCode >= 400 && statusCode < 500) {
          console.log(`🚫 Not retrying client error: ${statusCode}`);
          return false;
        }
      }
      console.log(`🔄 Retrying search (attempt ${failureCount + 1}/3)`);
      return failureCount < 3;
    },
  });

  const allProductsQueryResult = useQuery({
    queryKey: queryKeys.allProducts(page, pageSize),
    enabled: !shouldSearch,
    queryFn: async () => {
      console.log(
        `🔍 Fetching all products - page: ${page}, pageSize: ${pageSize}`,
      );

      try {
        const response = await apiClient.getAllProducts(page, pageSize);

        console.log(
          `✅ Fetch successful. Found ${response.items?.length || 0} items`,
        );

        // Validate response with Zod
        const validatedResponse = ProductsResponseSchema.parse(response);
        return validatedResponse;
      } catch (error) {
        console.error('❌ Fetch failed:', error);
        throw error;
      }
    },
    placeholderData: previousData => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error && 'statusCode' in error) {
        const statusCode = (error as any).statusCode;
        if (statusCode >= 400 && statusCode < 500) {
          console.log(`🚫 Not retrying client error: ${statusCode}`);
          return false;
        }
      }
      console.log(`🔄 Retrying fetch (attempt ${failureCount + 1}/3)`);
      return failureCount < 3;
    },
  });

  const state: SearchState = useMemo(() => {
    if (!shouldSearch) return 'idle';
    if (queryResult.isLoading) return 'loading';
    if (queryResult.isError) return 'error';
    if (queryResult.data && queryResult.data.items.length === 0) return 'empty';
    if (queryResult.data && queryResult.data.items.length > 0) return 'success';
    return 'idle';
  }, [
    shouldSearch,
    queryResult.isLoading,
    queryResult.isError,
    queryResult.data,
  ]);

  const searchMetadata = useMemo(() => {
    if (!queryResult.data?.meta) return undefined;

    return {
      total: queryResult.data.pagination.total,
      executionTimeMs: queryResult.data.meta.executionTimeMs,
      isPalindrome: queryResult.data.meta.isPalindrome,
      executedAt: queryResult.data.meta.executedAt,
    };
  }, [queryResult.data]);

  const hasNextPage = shouldSearch
    ? (queryResult.data?.pagination.hasNextPage ?? false)
    : (allProductsQueryResult.data?.pagination.hasNextPage ?? false);
  const hasPreviousPage = shouldSearch
    ? (queryResult.data?.pagination.hasPreviousPage ?? false)
    : (allProductsQueryResult.data?.pagination.hasPreviousPage ?? false);
  return {
    data: queryResult.data,
    allProductsData: allProductsQueryResult.data,
    state,
    isIdle: state === 'idle',
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    isEmpty: state === 'empty',
    query,
    debouncedQuery,
    isPalindromeQuery,
    error: queryResult.error,
    retry: queryResult.refetch,
    page,
    setPage,
    hasNextPage,
    hasPreviousPage,
    searchMetadata,
    updateQuery,
  };
}
